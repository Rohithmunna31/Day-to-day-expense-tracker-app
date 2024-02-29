const User = require("../models/User");

const jwt = require("jsonwebtoken");

exports.authenication = (req, res, next) => {
  const token = req.header("Authorization");

  console.log(token + "here at token");
  const user = jwt.verify(token, "secretkey");
  console.log(user);
  User.findByPk(user.userId)
    .then((user) => {
      console.log(user.dataValues);
      req.user = user.dataValues;
      next();
    })
    .catch((err) => {
      console.log("User authenication failed");
    });
};
