const path = require("path");

const uuid = require("uuid");

const bcrypt = require("bcrypt");

const sequelize = require("../utill/database");

const User = require("../models/User");

const brevo = require("@getbrevo/brevo");
const forgotpassword = require("../models/forgotpasswordrequest");
const { error } = require("console");

exports.getForgotpassword = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/forgotpassword.html"));
};

exports.postForgotpassword = async (req, res) => {
  try {
    const id = uuid.v4();
    console.log(id);
    const { email } = req.body;
    let apiInstance = new brevo.TransactionalEmailsApi();

    let apiKey = apiInstance.authentications["apiKey"];
    apiKey.apiKey = process.env.YOUR_API_V3_KEY;

    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      return res
        .status(400)
        .send({ message: "Cannot find user with this email id" });
    }
    console.log(user);
    const userId = user.dataValues.id;

    await forgotpassword.create({
      id: id,
      active: true,
      UserId: userId,
    });

    let sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Link to reset Password";
    sendSmtpEmail.htmlContent = `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`;
    sendSmtpEmail.sender = { name: "Rohith", email: "rohithkasna31@gmail.com" };
    sendSmtpEmail.to = [{ email: email, name: "Reciever" }];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    // console.log(data);
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err, sucess: false });
  }
};

exports.postResetPassword = async (req, res) => {
  try {
    let { id, newPassword } = req.body;

    const t = await sequelize.transaction();
    bcrypt.hash(newPassword, 10, async (err, hash) => {
      if (err) {
        throw new error(err);
      }
      const forgotPasswordUser = await forgotpassword.findOne({
        where: { id: id },
      });
      const userId = forgotPasswordUser.dataValues.UserId;
      await User.update(
        {
          password: hash,
        },
        {
          where: { id: userId },
        },
        { transaction: t }
      );

      await forgotpassword.update(
        {
          active: false,
        },
        {
          where: { id: id },
        },
        { transaction: t }
      );
      await t.commit();
      res.status(200).send({ message: "success" });
    });
  } catch (err) {
    await t.rollback();
    res.status(400).send({ message: "password reset failed try again" });
  }
};

exports.getResetPassword = async (req, res) => {

  res.sendFile(path.join(__dirname, "../public/resetpassword.html"));
};
