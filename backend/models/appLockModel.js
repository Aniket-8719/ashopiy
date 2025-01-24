const mongoose = require("mongoose");

const appLockSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [6, "Password should be greater than 6 characters"],
    select: false,
  },
  lockedFeatures: {
    type: Map,
    of: Boolean, // true = locked, false = unlocked
    default: {
      Earning: false,
      Charts: false,
      Investments: false,
      UdharBook: false,
      History: false,
      Profile: false,
    },
  },
});

module.exports = mongoose.model("AppLock", appLockSchema);
