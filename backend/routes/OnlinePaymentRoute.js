const express = require("express");
const { OnlinePaymentFlow } = require("../controller/OnlinePaymentController");
const router = express.Router();



router.route("/payment/webhook").post(OnlinePaymentFlow);

module.exports = router;
