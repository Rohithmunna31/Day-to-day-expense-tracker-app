const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authentication = (req, res, next) => {
  const token = req.header("Authorization");

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    User.findById(decoded.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      });
  });
};

// const User = require("../models/User");

// const jwt = require("jsonwebtoken");

// require("dotenv").config();

// exports.authenication = (req, res, next) => {
//   const token = req.header("Authorization");

//   const user = jwt.verify(token, process.env.SECRET_KEY);
//   User.findByPk(user.userId)
//     .then((user) => {
//       req.user = user.dataValues;
//       next();
//     })
//     .catch((err) => {
//       document.body.innerHTML += "<div> Authenitication failed <div>";
//     });
// };
