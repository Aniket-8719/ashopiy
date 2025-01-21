const express = require("express");
const router = express.Router();
const { addDailyIncome, getMonthlyIncome, getYearlyIncome, perDayIncome, perMonthIncome, todayIncome, deleteTodayIncome, updateTodayIncome, addFullDayIncome, monthlyHistory, getCompleteData } = require("../controller/incomeController");
const { isAuthenticatedUser } = require("../middleware/auth");
const { checkSubscriptionStatus } = require("../middleware/subscribe");
const { checkFeatureLock } = require("../middleware/lock");


router.route("/newIncome").post(isAuthenticatedUser,checkSubscriptionStatus, addDailyIncome);
router.route("/completeData").get(isAuthenticatedUser, getCompleteData);
router.route("/addFullDayIncome").post(isAuthenticatedUser, addFullDayIncome);
router.route("/monthlyHistory").get(isAuthenticatedUser, checkFeatureLock("History"), monthlyHistory);
router.route("/todayIncome").get(isAuthenticatedUser, checkSubscriptionStatus, todayIncome);
router.route("/getMonthlyIncome").get(isAuthenticatedUser, getMonthlyIncome);
router.route("/getYearlyIncome").get(isAuthenticatedUser,getYearlyIncome);
router.route("/perMonthIncome").get(isAuthenticatedUser, perMonthIncome);
router.route("/todayIncome/:id").delete(isAuthenticatedUser, checkSubscriptionStatus, deleteTodayIncome).put(isAuthenticatedUser, checkSubscriptionStatus, updateTodayIncome); 

module.exports = router;