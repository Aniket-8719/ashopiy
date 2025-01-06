const express = require("express");
const { addInvestmentIncome, getInvestmentIncome, deleteSingleInvestment, updateInvestment } = require("../controller/investmentController");
const { isAuthenticatedUser } = require("../middleware/auth");
const { checkSubscriptionStatus } = require("../middleware/subscribe");
const { checkFeatureLock } = require("../middleware/lock");
const router = express.Router();


router.route("/newInvestment").post(isAuthenticatedUser, checkSubscriptionStatus, addInvestmentIncome);
router.route("/allInvestment").get(isAuthenticatedUser,checkFeatureLock("Investments"),  getInvestmentIncome);
router.route("/allInvestment/:id").delete(isAuthenticatedUser,  deleteSingleInvestment).put(isAuthenticatedUser, updateInvestment);

module.exports = router;