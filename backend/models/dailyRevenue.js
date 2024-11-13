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
      specialDay: {
        type: String,
        default: 'Normal'
      }
})

module.exports = mongoose.model("DailyIncome", dailyIncomeSchema);