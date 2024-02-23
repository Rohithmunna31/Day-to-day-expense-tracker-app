// const path = require('path');

const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

// user/signup=> GET
router.get("/signup", userController.getUsersignup);

// user/login => GET
router.get("/login", userController.getUserlogin);

//  user/signup => POST
router.post("/signup", userController.postUsersignup);

// user/login => POST
router.post("/login", userController.postUserlogin);

module.exports = router;
