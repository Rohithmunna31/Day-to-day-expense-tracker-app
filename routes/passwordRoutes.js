const express = require("express");

const passwordController = require("../controllers/passwordControllers");

const router = express.Router();

router.get("/forgotpassword", passwordController.getForgotpassword);

router.post("/forgotpassword", passwordController.postForgotpassword);

router.post("/resetpassword", passwordController.postResetPassword);

router.get("/resetpassword/:id", passwordController.getResetPassword);

module.exports = router;
