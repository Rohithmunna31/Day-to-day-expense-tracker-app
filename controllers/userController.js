const Data = require("../models/User");

const path = require("path");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

exports.getUsersignup = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/signup.html"));
};

exports.getUserlogin = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
};

exports.postUsersignup = async (req, res) => {
  console.log(req.body);

  const { username, email, password } = req.body;

  const find = await Data.findOne({
    where: {
      email: email,
    },
  });

  if (find) {
    console.log("email already exists try logging in");
    return res.status(400).json({ err: "email already exists try logging in" });
  } else {
    console.log("uploading user data");
    bcrypt.hash(password, 10, async (err, hash) => {
      console.log(err);
      console.log("iam here in creation");
      await Data.create({
        username: username,
        email: email,
        password: hash,
      });
      res.send({ msg: "user created" });
    });
  }
};

exports.postUserlogin = async (req, res) => {
  const { email, password } = req.body;

  const newData = await Data.findOne({ where: { email: email } });

  console.log(newData.dataValues);

  if (newData) {
    bcrypt.compare(password, newData.dataValues.password, (err, data) => {
      if (err) {
        console.log("err occrued didnt compare");
        // res.status(400).send("err occured didnt compare password");
      }
      if (data === true) {
        console.log("password matched successfully");
        res.status(200).json({
          message: "password matched succesfully",
          token: generateAccessToken(newData.dataValues.id),
        });
        // return res.sendFile(path.join(__dirname, "../public/Addexpense.html"));
      } else {
        console.log("Wrong password");
        // res.status(400).send("wrong password");
      }
    });
  } else {
    console.log("email not found ");
    // res.status(400).send("email not found");
  }
};

function generateAccessToken(id) {
  return jwt.sign({ userId: id }, "secretkey");
}
