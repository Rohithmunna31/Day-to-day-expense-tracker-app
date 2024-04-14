const mongoose = require("mongoose");

// Define the schema for the Order
const orderSchema = new mongoose.Schema({
  paymentId: {
    type: String,
  },
  orderid: {
    type: String,
  },
  status: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Create the model for the Order
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

// const Sequelize = require("sequelize");

// const sequelize = require("../utill/database");

// const Order = sequelize.define("Order", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   paymentId: Sequelize.STRING,
//   orderid: Sequelize.STRING,
//   status: Sequelize.STRING,
// });

// module.exports = Order;
