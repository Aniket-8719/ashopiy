const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  avatar: {
    public_id: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  shopName: {
    type: String,
    required: [true, "Shop name is required"],
    trim: true,
    maxLength: [50, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  shopType: {
    type: String,
    required: [true, "Shop type is required"],
  },
  customShopType: {
    type: String,
    trim: true,
    default: null, // Only populated if "Other" is selected
  },
  shopOwnerName: {
    type: String,
    required: [true, "Shop owner name is required"],
    trim: true,
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [2, "Name should have more than 2 characters"],
  },
  whatsappNo: {
    type: String,
    required: [true, "WhatsApp number is required"],
    match: [/^\d{10}$/, "Please enter a valid 10-digit WhatsApp number"],
  },
  mobileNo: {
    type: String,
    required: [true, "Mobile number is required"],
    match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
  },
  merchantID: {
    type: String,
    trim: true,
    default: null,
    sparse: true,
  },
  gstNo: {
    type: String,
    trim: true,
    match: [
      /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,
      "Please enter a valid GST number",
    ],
    default: null,
  },
  country: {
    type: String,
    default: "IN",
    required: true,
  },
  state: {
    type: String,
    required: [true, "State is required"],
  },
  city: {
    type: String,
    required: [true, "City is required"],
  },
  pincode: {
    type: String,
    required: [true, "Pincode is required"],
    match: [/^\d{6}$/, "Please enter a valid 6-digit pincode"],
  },
  // area: {
  //   type: String,
  //   required: [true, "area is required"],
  // },
  landmark: {
    type: String,
    trim: true,
    default: null,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  agentID: {
    type: String,
    trim: true,
    default: null,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,

  planName: {
    type: String, // Store the selected plan (e.g., 'basic' or 'premium')
    enum: ["basic", "premium"], // Optional: restrict to specific plan names
    default: null, // Or set a default plan if needed
  },

  // Subscription fields
  subscription: {
    basic: {
      startDate: { type: Date, default: null }, // Start date of the basic subscription
      endDate: { type: Date, default: null }, // End date of the basic subscription
      isActive: { type: Boolean, default: false }, // Basic subscription status
    },
    premium: {
      startDate: { type: Date, default: null }, // Start date of the premium subscription
      endDate: { type: Date, default: null }, // End date of the premium subscription
      isActive: { type: Boolean, default: false }, // Premium subscription status
    },
  },
});

// Prevent changes to subscription data during registration or update
userSchema.pre("save", function (next) {
  if (!this.isModified("subscription")) {
    next();
  } else {
    // Ensure subscription is only modified when explicitly handled
    next();
  }
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

//  Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("users", userSchema);

module.exports = User;
