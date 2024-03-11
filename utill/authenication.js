const User = require("../models/User");

const jwt = require("jsonwebtoken");

const secretKeyfolder = require("../nodemon");

exports.authenication = (req, res, next) => {
  const token = req.header("Authorization");

  const user = jwt.verify(token, secretKeyfolder.secretkey);
  User.findByPk(user.userId)
    .then((user) => {
      req.user = user.dataValues;
      next();
    })
    .catch((err) => {
      document.body.innerHTML += "<div> Authenitication failed <div>";
    });
};
