const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
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
      investmentIncome: {
        type: Number,
        required: true
      },
      typeOfInvestment: {
        type: String,
        default: 'Normal'
      },
});

module.exports = mongoose.model("Investment", investmentSchema);