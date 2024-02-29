const Razorpay = require("razorpay");

const Order = require("../models/order");

const User = require("../models/User");

require("dotenv").config();

exports.purchasepremium = async (req, res) => {
  try {
    // console.log(process.env.RAZORPAY_KEY_ID);
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;
    console.log(amount);
    rzp.orders
      .create({ amount, currency: "INR" }, async (err, order) => {
        if (err) {
          console.log("orders . create ? ");
          console.log(err);
          // throw new Error(JSON.stringify(err));
        }
        await Order.create({
          orderid: order.id,
          status: "PENDING",
          UserId: req.user.id,
        })
          .then(() => {
            console.log("in createOrder");
            return res.status(201).json({ order, key_id: rzp.key_id });
          })
          .catch((err) => {
            throw new Error(err);
          });
      })
      .then(() => {
        console.log("rzpordrratd");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "something went wrong", error: err });
  }
};

exports.updatetransactionstatus = async (req, res) => {
  const { payment_id, order_id } = req.body;

  console.log(payment_id);
  console.log(" this is payment id");
  console.log(order_id);

  await Order.update(
    {
      paymentId: payment_id,
      status: "successfull",
    },
    {
      where: { orderid: order_id },
    }
  );

  const userid = req.user.id;

  await User.update({ ispremiumuser: true }, { where: { id: userid } });

  res.status(202).json({ success: true, message: "transaction successfull" });
};
