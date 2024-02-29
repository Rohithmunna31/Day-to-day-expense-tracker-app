const premiumControllers = require('../controllers/premiumControllers');

const express = require('express');

const authenicationMiddleware = require('../utill/authenication');

const router = express.Router();

router.get('/showleaderboard',authenicationMiddleware.authenication,premiumControllers.getshowleaderboard);

module.exports = router;