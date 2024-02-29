const express = require("express");

const purchaseController = require("../controllers/purchaseController");

const authenicateMiddleware = require("../utill/authenication");

const router = express.Router();

router.get(
  "/buypremiummembership",
  authenicateMiddleware.authenication,
  purchaseController.purchasepremium
);

router.post(
  "/updatetransactionstatus",
  authenicateMiddleware.authenication,
  purchaseController.updatetransactionstatus
);

module.exports = router;
