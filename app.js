const express = require("express");

const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const sequelize = require("./utill/database");
const Data = require("./models/data");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyparser.json());

app.use(cors());
app.get("/user/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/signup.html"));
});

app.post("/user/signup", async (req, res) => {
  console.log(req.body);

  const { username, email, password } = req.body;

  const find = await Data.findOne({
    where: {
      email: email,
    },
  });

  if (find) {
    console.log("email already exists try logging in");
    return res.status(400).json({ err: "email already exists try logging in" });
  } else {
    console.log("uploading user data");
    bcrypt.hash(password, 10, async (err, hash) => {
      console.log(err);
      console.log("iam here in creation");
      await Data.create({
        username: username,
        email: email,
        password: hash,
      });
    });
  }
});

app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  const newData = await Data.findOne({ where: { email: email } });

  // console.log(newData.data.dataValues.password);
  console.log(newData);

  if (newData) {
    bcrypt.compare(password, newData.dataValues.password, (err, res) => {
      if (err) {
        console.log("login failed password doesnt match");
      }
      if (res == true) {
        console.log("logged in successfully");
      }else{
        console.log("passwords didnt match");
      }
    });
  } else {
    console.log("email not found ");
  }
});
sequelize
  .sync()
  .then((res) => {
    // console.log(res);
    console.log("Database connected");
  })
  .catch((err) => {
    // console.log(err);
    console.log("Database connection failed");
  });

app.get("/user/login", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/login.html"));
});

app.get("/user/page", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/loginsucess.html"));
});

app.listen(3000);
