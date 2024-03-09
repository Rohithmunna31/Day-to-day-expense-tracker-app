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
  try {
    const { username, email, password } = req.body;

    const find = await Data.findOne({
      where: {
        email: email,
      },
    });

    if (find) {
      return res
        .status(400)
        .json({ err: "email already exists try logging in" });
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        await Data.create({
          username: username,
          email: email,
          password: hash,
        });
        res.send({ success: true, msg: "user created" });
      });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "an error occured" });
  }
};

exports.postUserlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newData = await Data.findOne({ where: { email: email } });

    if (newData) {
      bcrypt.compare(password, newData.dataValues.password, (err, data) => {
        if (err) {
      
          res.send("err occured didnt compare password");
        }
        if (data === true) {
          res.status(200).json({
            message: "password matched succesfully",
            token: generateAccessToken(
              newData.dataValues.id,
              newData.dataValues.username,
              newData.dataValues.ispremiumuser
            ),
          });
        } else {
          res.status(401).send("wrong password");
        }
      });
    } else {
      res.status(404).send("email not found");
    }
  } catch (err) {
    res.status(400).json({success:false,message:"an error occured"});
  }
};

function generateAccessToken(id, name, ispremiumuser) {
  return jwt.sign(
    { userId: id, name: name, ispremiumuser: ispremiumuser },
    "secretkey"
  );
}
