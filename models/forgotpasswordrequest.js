const Sequelize = require("sequelize");
const sequelize = require("../utill/database");

const forgotpassword = sequelize.define("forgotpassword", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
  },
  active: Sequelize.BOOLEAN,
  expiresby: Sequelize.DATE,
});

module.exports = forgotpassword;
