const expenses = require("../models/expenses");

const path = require("path");

const bcrypt = require("bcrypt");

exports.getAddexpense = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/Addexpense.html"));
};

exports.postAddexpense = (req, res) => {
  const { expense, description, category } = req.body;
  // console.log(req.body);

  let values;

  const createExpense = expenses
    .create({
      expense: expense,
      description: description,
      category: category,
    })
    .then((data) => {
      console.log("expense created");
      values = data.dataValues;
      console.log(values);
      res.send(values);
    })
    .catch((err) => {
      console.log(err);
      console.log("error occured in creating expense");
      // res.send("an error occurder cannot create expense");
    });
};

exports.getExpenses = async (req, res) => {
  const allExpenses = await expenses.findAll();
  console.log(allExpenses);
  res.status(200).send(allExpenses);
};

exports.deleteExpense = (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  console.log(id);
  const count = expenses.destroy({ where: { id } });
  res.send("deleted successfully");
};
