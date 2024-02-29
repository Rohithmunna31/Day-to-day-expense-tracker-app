const express = require("express");

const Expense = require("../models/expenses");

const sequelize = require("sequelize");

const User = require("../models/User");

exports.getshowleaderboard = async (req, res, next) => {
  try {
    const leadboarddetails = await User.findAll({
      attributes: [
        "id",
        "username",
        [sequelize.fn("sum", sequelize.col("expenses.expense")), "total_cost"],
      ],
      include: [
        {
          model: Expense,
          attributes: [],
        },
      ],
      group: ["user.id"],
      order: [["total_cost", "DESC"]],
    });
    res.status(200).send(leadboarddetails);
  } catch (err) {
    console.log(err);
  }
};
