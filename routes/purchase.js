const express = require("express");

const purchaseController = require("../controllers/purchaseController");

const authenicateMiddleware = require("../utill/authenication");

const router = express.Router();

router.get(
  "/buypremiummembership",
  authenicateMiddleware.authentication,
  purchaseController.purchasepremium
);

router.post(
  "/updatetransactionstatus",
  authenicateMiddleware.authentication,
  purchaseController.updatetransactionstatus
);

module.exports = router;
