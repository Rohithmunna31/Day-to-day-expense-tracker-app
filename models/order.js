const Sequelize = require("sequelize");

const sequelize = require("../utill/database");

const Order = sequelize.define("Order", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  paymentId: Sequelize.STRING,
  orderid: Sequelize.STRING,
  status: Sequelize.STRING,
});

module.exports = Order;
