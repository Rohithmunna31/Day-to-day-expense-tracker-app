// const path = require('path');

const express = require("express");

const expenseController = require("../controllers/expenseController");

const router = express.Router();

const userAuthenication = require("../utill/authenication");

// expense/addexpense => GET
router.get("/addexpense", expenseController.getAddexpense);

// expense/addexpense => POST
router.post(
  "/addexpense",
  userAuthenication.authenication,
  expenseController.postAddexpense
);

// expense/getexpenses => GET
router.get(
  "/getexpenses",
  userAuthenication.authenication,
  expenseController.getExpenses
);

router.get('/download',userAuthenication.authenication,expenseController.downloadexpense);

// expense/delete/:id => DELETE
router.delete("/delete/:id",userAuthenication.authenication ,expenseController.deleteExpense);

module.exports = router;
