const mongoose = require("mongoose");

const appLockSchema = new mongoose.Schema(
  {
    WorkerId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    WorkerEmailId: {
      type: String,
      default: undefined,
      unique: true,
      lowercase: true,
      trim: true,
    },
    lockedFeatures: {
      type: Map,
      of: Boolean, 
      default: {
        Earning: false,
        Charts: false,
        Investments: false,
        UdharBook: false,
        CreateProductCategory: false,
        ProductCategory: false,
        History: false,
      },
    },
    ownerId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("AppLock", appLockSchema);
