const Razorpay = require("razorpay");

const Order = require("../models/order");

const User = require("../models/User");

require("dotenv").config();

exports.purchasepremium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;

    const order = await new Promise((resolve, reject) => {
      rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
        if (err) {
          reject(err);
        } else {
          resolve(order);
        }
      });
    });

    await Order.create({
      orderid: order.id,
      status: "PENDING",
      UserId: req.user.id,
    });

    return res.status(201).json({ order, key_id: rzp.key_id });
  } catch (err) {
    res.status(403).json({ message: "something went wrong", error: err });
  }
};

exports.updatetransactionstatus = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;

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
  } catch (err) {
    res.status(400).json({ success: false, message: "an error occured" });
    
  }
};
