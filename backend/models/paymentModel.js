const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  planName: { type: String, enum: ["basic", "premium"], required: true },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["unpaid", "completed", "failed"], default: "unpaid" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
