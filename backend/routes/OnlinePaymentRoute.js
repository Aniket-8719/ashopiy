const express = require("express");
const { OnlinePaymentFlow } = require("../controller/OnlinePaymentController");
const router = express.Router();



router.route("/webhooks/payment").post(OnlinePaymentFlow);

module.exports = router;
