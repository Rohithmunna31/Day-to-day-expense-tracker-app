const express = require("express");

const Expense = require("../models/expenses");

const sequelize = require("sequelize");

const User = require("../models/User");

exports.getshowleaderboard = async (req, res, next) => {
  try {
    const users = await User.findAll();
    const expenses = await Expense.findAll();

    const UserExpenses = {};

    expenses.forEach((expense) => {
      if (UserExpenses[expense.UserId]) {
        UserExpenses[expense.UserId] =
          UserExpenses[expense.UserId] + expense.expense;
      } else {
        UserExpenses[expense.UserId] = expense.expense;
      }
      console.log(UserExpenses);
    });

    const leadboarddetails = [];
    users.forEach((user) => {
      leadboarddetails.push({
        name: user.username,
        total_cost: UserExpenses[user.id],
      });
    });
    leadboarddetails.sort((a, b) => b.total_cost - a.total_cost);
    res.status(200).send(leadboarddetails);
  } catch (err) {
    console.log(err);
  }
};
