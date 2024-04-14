const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  expense: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Create the model for the expenses
const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;

// const Sequelize = require("sequelize");

// const sequelize = require("../utill/database");

// const expenses = sequelize.define("expenses", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   expense: {
//     type: Sequelize.INTEGER,
//   },
//   description: {
//     type: Sequelize.TEXT,
//   },
//   category: {
//     type: Sequelize.STRING,
//   },
// });

// module.exports = expenses;
