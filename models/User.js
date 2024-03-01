const Sequelize = require("sequelize");

const sequelize = require("../utill/database");

const User = sequelize.define("User", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ispremiumuser: Sequelize.BOOLEAN,
  total_cost: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = User;
