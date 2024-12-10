const mongoose = require("mongoose");

const dailyIncomeSchema = new mongoose.Schema({
    dailyIncome: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        required: true,
      },
      time: {
        type: String,
        required: true
      },
      day: {
        type: String,
        required: true
      },
      earningType: {
        type: String,
        default: 'Cash'
      },
      latestSpecialDay: {
        type: String,
        default: 'Normal'
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
})

module.exports = mongoose.model("DailyIncome", dailyIncomeSchema);