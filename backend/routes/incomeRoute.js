const express = require("express");
const router = express.Router();
const { addDailyIncome, getMonthlyIncome, getYearlyIncome, perDayIncome, perMonthIncome, todayIncome, deleteTodayIncome, updateTodayIncome, addFullDayIncome, monthlyHistory, getCompleteData } = require("../controller/incomeController");
const { isAuthenticatedUser } = require("../middleware/auth");
const { checkSubscriptionStatus } = require("../middleware/subscribe");
const { checkFeatureLock } = require("../middleware/lock");


router.route("/newIncome").post(isAuthenticatedUser,checkSubscriptionStatus, checkFeatureLock("Earning"),  addDailyIncome);
router.route("/completeData").get(isAuthenticatedUser,checkFeatureLock("History"), getCompleteData);
router.route("/addFullDayIncome").post(isAuthenticatedUser, addFullDayIncome);
router.route("/monthlyHistory").get(isAuthenticatedUser, checkFeatureLock("History"), monthlyHistory);
router.route("/todayIncome").get(isAuthenticatedUser, checkSubscriptionStatus, checkFeatureLock("Earning"),  todayIncome);
router.route("/getMonthlyIncome").get(isAuthenticatedUser, checkFeatureLock("Charts"),  getMonthlyIncome);
router.route("/getYearlyIncome").get(isAuthenticatedUser, checkFeatureLock("Charts"), getYearlyIncome);
router.route("/perMonthIncome").get(isAuthenticatedUser, checkFeatureLock("Charts"), perMonthIncome);
router.route("/todayIncome/:id").delete(isAuthenticatedUser, checkSubscriptionStatus, checkFeatureLock("Earning"),  deleteTodayIncome).put(isAuthenticatedUser, checkSubscriptionStatus, checkFeatureLock("Earning"),  updateTodayIncome); 

module.exports = router;