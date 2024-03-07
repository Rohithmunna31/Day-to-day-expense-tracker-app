const AWS = require("aws-sdk");
const S3 = require("aws-sdk/clients/s3");
const expenses = require("../models/expenses");

const savedFiles = require("../models/savedfiles");

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
  try {
    const page = parseInt(req.query.page) || 1; // Extract page number from query parameter, default to page 1 if not provided
    const limit = 10; // Number of expenses per page

    const offset = (page - 1) * limit;

    const totalExpenses = await expenses.count({
      where: { userId: req.user.id },
    });

    const totalPages = Math.ceil(totalExpenses / limit);
    const nextPage = page + 1;
    const previosPage = page - 1;

    const hasNextpage = nextPage <= totalPages ? true : false;
    const hasPreviospage = page > 1 ? true : false;

    const allExpenses = await expenses.findAll({
      where: { userId: req.user.id },
      limit,
      offset,
    });

    res.status(200).json({
      totalPages,
      currentPage: page,
      nextPage: nextPage,
      previousPage: previosPage,
      hasNextpage,
      hasPreviospage,
      expenses: allExpenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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

exports.downloadexpense = async (req, res) => {
  try {
    const expense = await expenses.findAll({ where: { UserId: req.user.id } });

    console.log(expense);

    const stringifiedexpense = JSON.stringify(expense);

    const userid = req.user.id;

    const filename = `Expenses${userid}/${new Date()}.txt`;

    const fileUrl = await uploadtos3(stringifiedexpense, filename);

    await savedFiles.create({ fileUrl: fileUrl, UserId: req.user.id });

    res.status(201).json({ fileUrl, status: "success", err: null });
  } catch (err) {
    console.log(err);
    res.status(401).json({ fileUrl: null, success: "failed", err });
  }
};

function uploadtos3(data, filename) {
  const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
  const USER_KEY = process.env.AWS_IAM_USER_KEY;
  const USER_SECRET = process.env.AWS_IAM_USER_SECRET;
  console.log(BUCKET_NAME);

  let s3 = new AWS.S3({
    accessKeyId: USER_KEY,
    secretAccessKey: USER_SECRET,
  });

  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: "public-read",
      },
      {},
      (err, response) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(response.Location);
        }
      }
    );
  });
}
