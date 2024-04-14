const User = require("../models/User");

exports.getshowleaderboard = async (req, res, next) => {
  try {
    const leadboarddetails = await User.find({})
      .select("id username total_cost")
      .sort({ total_cost: -1 });

    res.status(200).send(leadboarddetails);
  } catch (err) {
    res.status(400).send("Error occurred");
  }
};

// const express = require("express");

// const sequelize = require("sequelize");

// const User = require("../models/User");

// exports.getshowleaderboard = async (req, res, next) => {
//   try {
//     const leadboarddetails = await User.findAll({
//       attributes: ["id", "username", "total_cost"],
//       order: [["total_cost", "DESC"]],
//     });
//     res.status(200).send(leadboarddetails);
//   } catch (err) {
//     res.status(400).send("error occured");
//   }
// };
