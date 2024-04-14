const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    required: true,
  },
  active: {
    type: Boolean,
  },
  expiresBy: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema);

module.exports = ForgotPassword;

// const Sequelize = require("sequelize");
// const sequelize = require("../utill/database");

// const forgotpassword = sequelize.define("forgotpassword", {
//   id: {
//     type: Sequelize.UUID,
//     allowNull: false,
//     primaryKey: true,
//   },
//   active: Sequelize.BOOLEAN,
//   expiresby: Sequelize.DATE,
// });

// module.exports = forgotpassword;
