const Sequelize = require("sequelize");

const sequelize = require("../utill/database");

const Data = sequelize.define("data", {
  id: {
    type: Sequelize.INTEGER,
    autoIncreament: true,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  password: {
    type: Sequelize.password,
    allowNull: false,
  },
});

module.exports = Data;
