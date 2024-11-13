const express = require("express");
const { addInvestmentIncome, getInvestmentIncome, deleteSingleInvestment, updateInvestment } = require("../controller/investmentController");
const router = express.Router();


router.route("/newInvestment").post(addInvestmentIncome);
router.route("/allInvestment").get(getInvestmentIncome);
router.route("/allInvestment/:id").delete(deleteSingleInvestment).put(updateInvestment);

module.exports = router;