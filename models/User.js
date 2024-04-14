const mongoose = require("mongoose");

// Define the Mongoose schema for the User
const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremiumUser: {
    type: Boolean,
    default: false,
  },
  totalCost: {
    type: Number,
    default: 0,
  },
});

// Create the Mongoose model for the User
const User = mongoose.model("User", userSchema);

module.exports = User;

// const Sequelize = require("sequelize");

// const sequelize = require("../utill/database");

// const User = sequelize.define("User", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   username: {
//     type: Sequelize.STRING,
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   password: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   ispremiumuser: Sequelize.BOOLEAN,
//   total_cost: {
//     type: Sequelize.INTEGER,
//     defaultValue: 0,
//   },
// });

// module.exports = User;
