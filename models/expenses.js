const Sequelize = require("sequelize");

const sequelize = require("../utill/database");

const expenses = sequelize.define("expenses", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  expense: {
    type: Sequelize.INTEGER,
  },
  description: {
    type: Sequelize.TEXT,
  },
  category: {
    type: Sequelize.STRING,
  },
});

module.exports = expenses;
