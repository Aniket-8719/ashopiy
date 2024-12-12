const express = require("express");
const router = express.Router();
const { addDailyIncome, getDailyIncome, getMonthlyIncome, getYearlyIncome, perDayIncome, perMonthIncome, todayIncome, deleteTodayIncome, updateTodayIncome, createFullDayIncome, addFullDayIncome, getFullDayIncome, monthlyHistory } = require("../controller/incomeController");
const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/newIncome").post(isAuthenticatedUser,addDailyIncome);
router.route("/allIncome").get(isAuthenticatedUser, getFullDayIncome);
router.route("/addFullDayIncome").post(isAuthenticatedUser, addFullDayIncome);
router.route("/monthlyHistory").get(isAuthenticatedUser,monthlyHistory);
router.route("/todayIncome").get(isAuthenticatedUser,isAuthenticatedUser, todayIncome);
router.route("/getMonthlyIncome").get(isAuthenticatedUser,getMonthlyIncome);
router.route("/getYearlyIncome").get(isAuthenticatedUser,getYearlyIncome);
router.route("/perMonthIncome").get(isAuthenticatedUser,perMonthIncome);
router.route("/todayIncome/:id").delete(deleteTodayIncome).put(updateTodayIncome); 

module.exports = router;