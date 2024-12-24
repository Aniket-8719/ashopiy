const mongoose = require("mongoose");

const UdharBookSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    required: [true, "Mobile number is required"],
    match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
  },
  address: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  udharAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("UdharBook", UdharBookSchema);
