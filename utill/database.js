const Sequelize = require("sequelize");

const mysqlKeywords = require("../nodemon");

const sequelize = new Sequelize(
  mysqlKeywords.mysql_databasename,
  mysqlKeywords.mysql_username,
  mysqlKeywords.mysql_password,
  {
    dialect: "mysql",
    host: "localhost",
  }
);

module.exports = sequelize;
