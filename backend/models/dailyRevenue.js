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
        // Custom validator: only required if merchantId is not provided
        validate: {
          validator: function(value) {
            // user is required only if merchantId is not present
            if (!this.merchantID) {
              return value != null; // User should be present
            }
            return true; // Skip validation if merchantId is present
          },
          message: "User is required if merchantId is not provided"
        }
      },
      merchantID: {
        type: String,  // Add this field for storing Razorpay merchant ID
        // Custom validator: only required if user is not provided
        validate: {
          validator: function(value) {
            // merchantId is required only if user is not present
            if (!this.user) {
              return value != null; // MerchantId should be present
            }
            return true; // Skip validation if user is present
          },
          message: "MerchantId is required if user is not provided"
        }
      }
})

module.exports = mongoose.model("DailyIncome", dailyIncomeSchema);