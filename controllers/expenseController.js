const expenses = require("../models/expenses");

const User = require("../models/User");

const path = require("path");

const sequelize = require("../utill/database");

const { log } = require("console");

exports.getAddexpense = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/Addexpense.html"));
};

exports.postAddexpense = async (req, res) => {
  const t = await sequelize.transaction();
  const { expense, description, category } = req.body;

  if (expense == undefined || expense.length == 0) {
    return res
      .status(400)
      .json({ success: false, message: "paramenters missing " });
  }
  let values;
  try {
    const data = await expenses.create(
      {
        expense: expense,
        description: description,
        category: category,
        UserId: req.user.id,
      },
      {
        transaction: t,
      }
    );
    values = data.dataValues;
    console.log(values);
    const total_expense = Number(req.user.total_cost) + Number(expense);
    console.log(total_expense);
    await User.update(
      {
        total_cost: total_expense,
      },
      {
        where: { id: req.user.id },
        transaction: t,
      }
    );
    await t.commit();
    res.status(200).send(values);
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.send("an error occurder cannot create expense");
  }
};

exports.getExpenses = async (req, res) => {
  const allExpenses = await expenses.findAll({
    where: { userId: req.user.id },
  });
  res.status(200).send(allExpenses);
};

exports.deleteExpense = async (req, res) => {
  const sequelize = require("../utill/database");
  const t = await sequelize.transaction();
  const { id } = req.params;

  try {
    const total_cost = req.user.total_cost;
    console.log(id);
    const expensetodelete = await expenses.findOne({ where: { id } });
    const updatedtotal_cost = total_cost - expensetodelete.dataValues.expense;

    await User.update(
      { total_cost: updatedtotal_cost },
      {
        where: {
          id: req.user.id,
        },
        transaction: t,
      }
    );
    await expenses.destroy({
      where: { id: id, userId: req.user.id },
      transaction: t,
    });
    t.commit();
    res.status(200).send("deleted successfully");
  } catch (err) {
    t.rollback();
    console.log(err);
    res.status(500).send("an error occured cannot delete expense");
  }
};
