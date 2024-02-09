const Sequelize = require("sequelize");

const sequelize = new Sequelize("nodeproject1", "root", "Rohith@3112", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

