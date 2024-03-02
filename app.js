const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const sequelize = require("./utill/database");
const { log } = require("console");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const purchaseRoutes = require("./routes/purchase");
const User = require("./models/User");
const Expense = require("./models/expenses");
const Orders = require("./models/order");
const forgotpassword = require("./models/forgotpasswordrequest");
const premiumRoutes = require("./routes/premiumroutes");
const passwordRoutes = require("./routes/passwordRoutes");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyparser.json());

app.use(cors());

app.use("/user", userRoutes);

app.use("/expense", expenseRoutes);

app.use("/purchase", purchaseRoutes);

app.use("/premium", premiumRoutes);

app.use("/password", passwordRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Orders);
Orders.belongsTo(User);

User.hasMany(forgotpassword);
forgotpassword.belongsTo(User);

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
