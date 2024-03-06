const Sequelize = require("sequelize");

const sequelize = require("../utill/database");

const savedfiles = sequelize.define("savedFiles", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  fileUrl: {
    type: Sequelize.STRING,
  },
});

module.exports = savedfiles;
