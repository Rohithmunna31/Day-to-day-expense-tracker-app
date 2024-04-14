const mongoose = require("mongoose");

// Define the schema for the savedFiles
const savedFilesSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    required: true,
  },
  // Adding reference to the User model
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Create the model for the savedFiles
const SavedFiles = mongoose.model("SavedFiles", savedFilesSchema);

module.exports = SavedFiles;

// const Sequelize = require("sequelize");

// const sequelize = require("../utill/database");

// const savedfiles = sequelize.define("savedFiles", {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     allowNull: false,
//   },
//   fileUrl: {
//     type: Sequelize.STRING,
//   },
// });

// module.exports = savedfiles;
