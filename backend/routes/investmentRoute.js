const express = require("express");
const { addInvestmentIncome, getInvestmentIncome, deleteSingleInvestment, updateInvestment } = require("../controller/investmentController");
const { isAuthenticatedUser } = require("../middleware/auth");
const { checkSubscriptionStatus } = require("../middleware/subscribe");
const router = express.Router();


router.route("/newInvestment").post(isAuthenticatedUser, checkSubscriptionStatus, addInvestmentIncome);
router.route("/allInvestment").get(isAuthenticatedUser,  getInvestmentIncome);
router.route("/allInvestment/:id").delete(isAuthenticatedUser,  deleteSingleInvestment).put(isAuthenticatedUser, updateInvestment);

module.exports = router;