const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.get("/create-checkout-session", paymentController.createCheckoutSession);

module.exports = router;
