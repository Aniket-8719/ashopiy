const express = require("express");
const { addDailyIncome, getDailyIncome, getMonthlyIncome, getYearlyIncome, perDayIncome, perMonthIncome, todayIncome, deleteTodayIncome, updateTodayIncome } = require("../controller/incomeController");
const router = express.Router();

router.route("/newIncome").post(addDailyIncome);
router.route("/allIncome").get(getDailyIncome);
router.route("/perDayIncome").get(perDayIncome);
router.route("/todayIncome").get(todayIncome);
router.route("/getMonthlyIncome").get(getMonthlyIncome);
router.route("/getYearlyIncome").get(getYearlyIncome);
router.route("/perMonthIncome").get(perMonthIncome);
router.route("/todayIncome/:id").delete(deleteTodayIncome).put(updateTodayIncome);

module.exports = router;