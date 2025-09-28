const mongoose = require("mongoose");

const fullDayIncomeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  time: [
    {
      type: String,
      required: true,
    },
  ],
  latestSpecialDay: {
    type: String,
    default: "Normal",
    required: false
  },
  totalIncome: {
    type: Number,
    required: true,
  },
  totalCustomers: {
    type: Number,
    required: true,
  },
  totalOnlineAmount: {
    type: Number,
    required: true,
  },
  categoryWiseIncome: [ 
    {
      productCategory: { type: String, required: true },
      categoryTotalIncome: { type: Number, required: true },
    },
  ],
});

// Add unique index on user and normalized date
fullDayIncomeSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("FullDayIncome", fullDayIncomeSchema);
