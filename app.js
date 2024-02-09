const express = require("express");

const cors = require("cors");
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const sequelize = require("./utill/database");
const Data = require("./models/data");

app.use(bodyparser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyparser.json());

app.use(cors());
app.get("/user", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/signup.html"));
});

app.post("/user/signup", (req, res) => {
  console.log(req.body);

  const { username, email, password } = req.body;

  const newData = Data.create({
    username: username,
    email: email,
    password: password,
  });
  res.send(req.body);
});

sequelize
  .sync()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3001);
