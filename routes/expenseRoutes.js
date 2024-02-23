// const path = require('path');

const express = require("express");

const expenseController = require("../controllers/expenseController");

const router = express.Router();

// expense/addexpense => GET
router.get("/addexpense", expenseController.getAddexpense);

// expense/addexpense => POST
router.post("/addexpense", expenseController.postAddexpense);

// expense/getexpenses => GET
router.get("/getexpenses", expenseController.getExpenses);

// expense/delete/:id => DELETE
router.delete("/delete/:id", expenseController.deleteExpense);

module.exports = router;
