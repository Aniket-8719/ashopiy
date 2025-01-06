const express = require("express"); 
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");
const { createRazorpayOrder, paymentSuccess } = require("../controller/subscriptionController");



router.route("/checkout").post(createRazorpayOrder);
router.route("/payment-success").post(isAuthenticatedUser, paymentSuccess);


module.exports = router;

