const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const sequelize = require("./utill/database");
const { log } = require("console");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const User = require("./models/User");
const Expense = require("./models/expenses");
const Orders = require("./models/order");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyparser.json());

app.use(cors());

app.use("/user", userRoutes);

app.use("/expense", expenseRoutes);

app.user("purchase");

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Orders);
Orders.belongsTo(User);

sequelize
  .sync()
  .then((res) => {
    // console.log(res);
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
    console.log("Database connection failed");
  });

app.listen(3000);
