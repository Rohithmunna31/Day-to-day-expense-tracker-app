const express = require("express");

const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.get("/user/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/signup.html"));
});

app.listen(3000);
