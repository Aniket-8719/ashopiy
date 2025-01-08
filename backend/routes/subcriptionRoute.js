const express = require("express"); 
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");
const { createRazorpayOrder, paymentSuccess, getPaymentHistory } = require("../controller/subscriptionController");



router.route("/checkout").post(isAuthenticatedUser, createRazorpayOrder);
router.route("/payment-success").post(isAuthenticatedUser, paymentSuccess);
router.route("/payment-history").get(isAuthenticatedUser, getPaymentHistory);


module.exports = router;

