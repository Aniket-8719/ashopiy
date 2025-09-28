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
    required: function () {
      return this.loginMethods.includes("password");
    },
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  shopName: {
    type: String,
    trim: true,
    maxLength: [50, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  shopType: {
    type: String,
  },
  customShopType: {
    type: String,
    trim: true,
  },
  Name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [2, "Name should have more than 2 characters"],
  },
  whatsappNo: {
    type: String,
    default: null,
    match: [/^\d{10}$/, "Please enter a valid 10-digit WhatsApp number"],
  },
  mobileNo: {
    type: String,
    default: null,
    match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
  },
  merchantID: {
    type: String,
    trim: true,
  },
  gstNo: {
    type: String,
    trim: true,
    match: [
      /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,
      "Please enter a valid GST number",
    ],
  },
  country: {
    type: String,
    default: "IN",
  },
  state: {
    type: String,
    default: null,
  },
  city: {
    type: String,
    default: null,
  },
  pincode: {
    type: String,
    default: null,
    match: [/^\d{6}$/, "Please enter a valid 6-digit pincode"],
  },
  landmark: {
    type: String,
    trim: true,
    default: null,
  },
  address: {
    type: String,
    default: null,
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
    type: String,
    enum: ["basic", "premium"],
    default: null,
  },
  subscription: {
    basic: {
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
      isActive: { type: Boolean, default: false },
    },
    premium: {
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
      isActive: { type: Boolean, default: false },
    },
  },
  loginMethods: {
    type: [String],
    enum: ["password", "google"],
    default: ["password"],
  },
  isPasswordSet: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
    default: null,
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["shopkeeper", "worker", "admin"],
  },

  workerDetails: {
    ownerAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
});

// Pre-save hooks and methods remain the same
userSchema.pre("save", function (next) {
  if (!this.isModified("subscription")) {
    next();
  } else {
    next();
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.pre("save", function (next) {
  if (this.role === "shopkeeper") {
    this.workerDetails = undefined; // completely remove for shopkeepers
    this.shopName = null;
    this.shopType = null;
    this.customShopType = null;
    this.merchantID = null;
    this.gstNo = null;
  } else if (this.role === "worker" && !this.workerDetails) {
    this.workerDetails = {
      ownerAccountId: null,
      WorkerRole: [],
      joiningDate: null,
    };
  }
  next();
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("users", userSchema);

module.exports = User;
