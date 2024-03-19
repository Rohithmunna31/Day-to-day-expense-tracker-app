const express = require("express");
const fs = require("fs");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const sequelize = require("./utill/database");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const purchaseRoutes = require("./routes/purchase");
const User = require("./models/User");
const Expense = require("./models/expenses");
const Orders = require("./models/order");
const forgotpassword = require("./models/forgotpasswordrequest");
const savedFiles = require("./models/savedfiles");
const premiumRoutes = require("./routes/premiumRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const accesslogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: false }));

app.use(bodyparser.json());
require("dotenv").config();
app.use(cors());
app.use(morgan("combined", { stream: accesslogStream }));

app.use("/user", userRoutes);

app.use("/expense", expenseRoutes);

app.use("/purchase", purchaseRoutes);

app.use("/premium", premiumRoutes);

app.use("/password", passwordRoutes);

app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`public/${req.url}`));
})

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Orders);
Orders.belongsTo(User);

User.hasMany(forgotpassword);
forgotpassword.belongsTo(User);

User.hasMany(savedFiles);
savedFiles.belongsTo(User);

sequelize
  .sync()
  .then((res) => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log("database connection failed");
  });
