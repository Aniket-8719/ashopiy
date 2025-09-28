const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("cloudinary");
const moment = require("moment-timezone");
const DailyIncome = require("../models/dailyRevenue");
const FullDayIncome = require("../models/fullDayRevenue");
const investmentModel = require("../models/investmentModel");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const AppLock = require("../models/appLockModel");

// Register User with avatar upload
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User already exists with this email", 400));
  }

  // Validate required fields
  if (!name || !email || !password || !role) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  // Initialize avatar data as null
  let avatar = {
    public_id: null,
    url: null,
  };

  // Check if file exists
  if (req.files && req.files.avatar) {
    const file = req.files.avatar;

    // Handle file upload logic (e.g., upload to Cloudinary)
    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "avatars",
    });

    avatar.public_id = uploadResult.public_id;
    avatar.url = uploadResult.secure_url;
  }

  // Get current date and time in Asia/Kolkata timezone
  const indiaDateTime = moment.tz("Asia/Kolkata");

  // Add 5 hours and 30 minutes to adjust to UTC
  const utcDateTime = indiaDateTime.clone().add(5, "hours").add(30, "minutes");

  // Calculate subscription dates (1 week free trial for shopkeepers)
  const subscriptionStartDate = utcDateTime.toDate();
  const subscriptionEndDate = new Date(subscriptionStartDate);
  subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 7); // Add 7 days for 1 week trial

  // Prepare user data
  const userData = {
    Name: name,
    email,
    password,
    role,
    avatar,
    loginMethods: ["password"],
    isProfileComplete: false,
  };

  // Add subscription only for shopkeeper role (not for worker)
  if (role === "shopkeeper") {
    userData.subscription = {
      basic: {
        isActive: true, // Activate the subscription
        startDate: subscriptionStartDate,
        endDate: subscriptionEndDate,
      },
    };
  }

  // Create new user
  const user = await User.create(userData);

  // Generate token
  const token = user.getJWTToken();
  const expiresAt = new Date(
    Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
  );

  // Cookie options
  const options = {
    expires: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };

  // Send welcome email with subscription details for shopkeepers
  // After creating user, send trial email for shopkeepers
  if (role === "shopkeeper") {
    await sendTrialEmail(user, subscriptionStartDate, subscriptionEndDate);
  }

  res
    .status(201)
    .cookie("token", token, options)
    .json({
      success: true,
      user,
      message:
        role === "shopkeeper"
          ? "Registration successful. 1-week free trial activated."
          : "Registration successful.",
    });
});

// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  // checking if user has given email and password both
  if (!email || !password) {
    return next(new ErrorHandler("please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  //  Creating Token and saving in cookie
  const token = user.getJWTToken();
  const expiresAt = new Date(
    Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
  );

  // options for cookie
  const options = {
    expires: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };

  res.status(200).cookie("token", token, options).json({
    success: true,
    user,
  });
});

// Google Login (existing user)
exports.googleLogin = catchAsyncError(async (req, res, next) => {
  const { token: googleToken } = req.body;

  if (!googleToken) {
    return next(new ErrorHandler("Google token is required", 400));
  }

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, sub: googleId } = payload;

    // Find user by email or googleId
    let user = await User.findOne({
      $or: [{ email }, { googleId }],
    });

    if (!user) {
      return next(
        new ErrorHandler("User not found. Please register first.", 404)
      );
    }

    // Update user if needed
    if (!user.googleId) {
      user.googleId = googleId;
    }
    if (!user.loginMethods.includes("google")) {
      user.loginMethods.push("google");
    }
    await user.save();

    const authToken = user.getJWTToken();

    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };

    return res.status(200).cookie("token", authToken, cookieOptions).json({
      success: true,
      user,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Google login error:", error);
    return next(new ErrorHandler("Authentication failed", 401));
  }
});

// Google Register (new user)
exports.googleRegister = catchAsyncError(async (req, res, next) => {
  const { token: googleToken, role } = req.body;

  if (!googleToken) {
    return next(new ErrorHandler("Google token is required", 400));
  }

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user already exists
    let user = await User.findOne({
      $or: [{ email }, { googleId }],
    });

    if (user) {
      return next(
        new ErrorHandler("User already exists. Please login instead.", 400)
      );
    }

    if (!role) {
      return next(new ErrorHandler("Role are required", 400));
    }

    // Validate role
    if (!["shopkeeper", "worker"].includes(role)) {
      return next(new ErrorHandler("Invalid role selection", 400));
    }

    // Get current date and time in Asia/Kolkata timezone
    const indiaDateTime = moment.tz("Asia/Kolkata");

    // Add 5 hours and 30 minutes to adjust to UTC
    const utcDateTime = indiaDateTime
      .clone()
      .add(5, "hours")
      .add(30, "minutes");

    // Calculate subscription dates (1 week free trial for shopkeepers)
    const subscriptionStartDate = utcDateTime.toDate();
    const subscriptionEndDate = new Date(subscriptionStartDate);
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 7); // Add 7 days for 1 week trial

    // Prepare user data
    const userData = {
      Name: name,
      email,
      googleId,
      loginMethods: ["google"],
      role,
      isProfileComplete: false,
      avatar: { url: picture },
      name,
      password: undefined,
    };

    // Add subscription only for shopkeeper role (not for worker)
    if (role === "shopkeeper") {
      userData.subscription = {
        basic: {
          isActive: true, // Activate the subscription
          startDate: subscriptionStartDate,
          endDate: subscriptionEndDate,
        },
      };
    }

    // Create new user
    user = await User.create(userData);

    const authToken = user.getJWTToken();

    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };

    // After creating user, send trial email for shopkeepers
    if (role === "shopkeeper") {
      await sendTrialEmail(user, subscriptionStartDate, subscriptionEndDate);
    }

    return res
      .status(201)
      .cookie("token", authToken, cookieOptions)
      .json({
        success: true,
        user,
        message:
          role === "shopkeeper"
            ? "Registration successful. 1-week free trial activated."
            : "Registration successful.",
      });
  } catch (error) {
    console.error("Google register error:", error);
    return next(new ErrorHandler("Registration failed", 401));
  }
});

exports.completeProfile = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  let updateData = { ...req.body };

  // Block shopkeeper-only fields for workers
  if (user.role === "worker") {
    const blockedFields = [
      "shopName",
      "shopType",
      "customShopType",
      "merchantID",
      "gstNo",
    ];
    blockedFields.forEach((field) => delete updateData[field]);
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  // Define required fields based on role
  let requiredFields = [];

  if (updatedUser.role === "worker") {
    requiredFields = [
      "whatsappNo",
      "mobileNo",
      "address",
      "city",
      "state",
      "pincode",
    ];
  } else if (updatedUser.role === "shopkeeper") {
    requiredFields = [
      "shopName",
      "whatsappNo",
      "mobileNo",
      "address",
      "city",
      "state",
      "pincode",
    ];

    // Handle shopType/customShopType logic
    if (updatedUser.shopType === "Other") {
      requiredFields.push("customShopType");
    } else {
      requiredFields.push("shopType");
    }
  }

  // Check completeness
  const isComplete = requiredFields.every((field) => {
    if (field === "whatsappNo" || field === "mobileNo") {
      return updatedUser.whatsappNo || updatedUser.mobileNo;
    }
    return !!updatedUser[field];
  });

  // Update only if changed
  if (updatedUser.isProfileComplete !== isComplete) {
    updatedUser.isProfileComplete = isComplete;
    await updatedUser.save();
  }

  res.status(200).json({
    success: true,
    user: updatedUser,
    message: updatedUser.isProfileComplete
      ? "Profile complete"
      : "Profile updated but incomplete",
  });
});

// Set Password for Google Users
exports.setPassword = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const { password } = req.body;

  if (!password) {
    return next(new ErrorHandler("Password is required", 400));
  }

  const user = await User.findById(userId).select("+password"); // make sure we can update password
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Prevent resetting if already set
  if (user.isPasswordSet) {
    return next(new ErrorHandler("Password is already set", 400));
  }

  // ✅ Update password
  user.password = password; // will be hashed by pre-save hook
  user.isPasswordSet = true;

  // ✅ Ensure loginMethods includes "password"
  if (!user.loginMethods.includes("password")) {
    user.loginMethods.push("password");
  }

  await user.save();

  res.status(200).json({
    success: true,
    message:
      "Password set successfully. You can now log in with email & password.",
  });
});

//  Logout User
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    // secure: true,
    // sameSite: "None",
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //  Generating URL
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const htmlMessage = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f1f5f9;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <tr>
            <td style="padding: 0; background: linear-gradient(to right, #4f46e5, #9333ea);">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td style="padding: 24px 32px; text-align: center;">
                            <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">ashopiy</h1>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style="padding: 32px;">
                <h2 style="color: #4f46e5; margin-top: 0; font-size: 22px;">Password Reset Request</h2>
                <p style="margin-bottom: 24px;">Hi ${user.Name || "User"},</p>
                <p>We received a request to reset the password for your ashopiy account.</p>
                <div style="text-align: center; margin: 28px 0;">
                    <a href="${resetPasswordUrl}" 
                       style="display: inline-block; 
                              background: linear-gradient(to right, #4f46e5, #9333ea); 
                              color: white; 
                              padding: 14px 32px; 
                              text-decoration: none; 
                              border-radius: 6px; 
                              font-weight: 600;
                              font-size: 16px;
                              box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);">
                        Reset Your Password
                    </a>
                </div>
                <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
                    <strong>Note:</strong> This password reset link will expire in 1 hour for security reasons.
                </p>
                <div style="background-color: #f8fafc; border-left: 4px solid #e2e8f0; padding: 16px; margin: 24px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">
                        If you didn't request a password reset, you can safely ignore this email. 
                        Your password will remain unchanged unless you create a new one via the link above.
                    </p>
                </div>
                <p>If you need additional assistance, please contact our support team.</p>
                <p>Best regards,<br>The ashopiy Team</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; text-align: center; color: #64748b; font-size: 14px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 16px 0;">© ${new Date().getFullYear()} ashopiy. All rights reserved.</p>
                 <p style="margin: 0 0 8px 0;"><a href="${
                   process.env.FRONTEND_URL
                 }/privacy-policy" style="color: #4f46e5; text-decoration: none;">Privacy Policy</a> | <a href="${
    process.env.FRONTEND_URL
  }/terms-conditions" style="color: #4f46e5; text-decoration: none;">Terms of Service</a></p>
      <p style="margin: 0;">You're receiving this email because you have an account with ashopiy.</p>
            </td>
        </tr>
    </table>
</body>

</html>
`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Password Reset Request - ashopiy`,
      message: `Hi ${
        user.Name || "User"
      },\n\nWe received a request to reset your password. Please use this link to reset it: ${resetPasswordUrl}\n\nIf you didn't request this, please ignore this email.\n\nThanks,\nThe ashopiy Team`,
      htmlMessage,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  //  Creating Token and saving in cookie
  const token = user.getJWTToken();

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res.status(201).cookie("authToken", token, options).json({
    success: true,
    user,
    token,
  });
});

//  Get User Details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const appLock = await AppLock.findOne({ WorkerId: req.user.id });
  res.status(200).json({
    success: true,
    user,
    lockedFeatures: appLock ? appLock.lockedFeatures : {},
  });
});

//  Update User Password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  //  Creating Token and saving in cookie
  const token = user.getJWTToken();

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res.status(201).cookie("authToken", token, options).json({
    success: true,
    user,
    token,
  });
});

// Update User Profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const { password, role, ...newUserData } = req.body;

  // Validate if role or password is being updated
  if (role) {
    return res
      .status(400)
      .json({ success: false, message: "You can't update the role" });
  }
  if (password) {
    return res
      .status(400)
      .json({ success: false, message: "You can't update the password here" });
  }

  const user = await User.findById(req.user.id);

  // Validate at least one phone number is provided
  if (!newUserData.whatsappNo && !newUserData.mobileNo) {
    return res.status(400).json({
      success: false,
      message: "At least one phone number is required",
    });
  }

  // For workers, remove shop-related fields
  if (user.role === "worker") {
    delete newUserData.shopType;
    delete newUserData.customShopType;
    delete newUserData.shopName;
    delete newUserData.gstNo;
  }

  // Handle avatar upload
  if (req.files && req.files.avatar) {
    try {
      // Delete old avatar if it exists
      if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      // Upload new avatar
      const result = await cloudinary.uploader.upload(
        req.files.avatar.tempFilePath,
        { folder: "avatars", width: 150, crop: "scale" }
      );
      newUserData.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      return next(new ErrorHandler("Failed to upload avatar", 500));
    }
  } else {
    // Keep the existing avatar if no new avatar is provided
    newUserData.avatar = user.avatar;
  }

  // Update user data except the password and role
  await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
  });
});

//  Update User Role (Admin)
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const { password, ...newUserDataByAdmin } = req.body; // Exclude password from the request body

  const user = await User.findByIdAndUpdate(req.params.id, newUserDataByAdmin, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    next(new ErrorHandler("User Not found"));
  } else {
    res.status(200).json({
      success: true,
    });
  }
});

// Get all users (Admin)
exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const {
    search,
    shopType,
    country,
    state,
    city,
    agentID,
    startDate,
    endDate,
  } = req.query;

  // Create a dynamic query object
  const query = {};

  // Handle search functionality
  if (search) {
    const searchRegex = new RegExp(search, "i"); // Case-insensitive regex
    query.$or = [
      { email: searchRegex },
      { mobileNo: searchRegex },
      { whatsappNo: searchRegex },
      { Name: searchRegex },
      { shopName: searchRegex },
      { pincode: searchRegex },
      { landmark: searchRegex },
      { address: searchRegex },
    ];
  }

  // Handle filters
  // Handle shopType filter with specific logic for "Other"
  if (shopType) {
    if (shopType === "Other") {
      query.shopType = "Other";
    } else {
      query.shopType = shopType;
    }
  }
  if (country) query.country = country;
  if (state) query.state = state;
  if (city) query.city = city;
  if (agentID) query.agentID = agentID;

  // Handle date filters (startDate and endDate)
  if (startDate || endDate) {
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate); // Greater than or equal to start date
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate); // Less than or equal to end date
    }
    query.createdAt = dateFilter; // Apply date filter to the createdAt field
  }

  // Fetch users based on search and filter conditions
  const users = await User.find(query).collation({ locale: "en", strength: 2 });

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// Get all admins (Admin)
exports.getAllAdmins = catchAsyncError(async (req, res, next) => {
  // Assuming you have a "role" field in your User schema to determine the user's role
  const admins = await User.find({ role: "admin" });

  if (!admins) {
    return next(new ErrorHandler(`No admin exist`));
  }

  res.status(200).json({
    success: true,
    admins,
  });
});

const storage = (document) => {
  // Calculate total size in bytes
  let totalSizeInBytes = 0;

  document.forEach((doc) => {
    // Convert the document to JSON and calculate its size in bytes
    const docJson = JSON.stringify(doc);
    const docSize = Buffer.byteLength(docJson, "utf8"); // Size in bytes
    totalSizeInBytes += docSize;
  });

  const TotalSizeInMB = totalSizeInBytes / (1024 * 1024); // Convert bytes to MB
  return TotalSizeInMB;
};

// Get Single User (Admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  // Fetch all DailyIncome documents for the user
  const dailyIncome = await DailyIncome.find({ user: userId });
  const fullDayIncome = await FullDayIncome.find({ user: userId });
  const investmentDocument = await investmentModel.find({ user: userId });

  // Format the output string
  const DataNumbers =
    `Daily Income: ${dailyIncome.length}\n || ` +
    `Full Day Income: ${fullDayIncome.length}\n || ` +
    `Investment: ${investmentDocument.length}`;

  const dailyData = storage(dailyIncome);
  const fullDayData = storage(fullDayIncome);
  const investData = storage(investmentDocument);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
    dailyData: dailyData.toFixed(2),
    fullDayData: fullDayData.toFixed(2),
    investData: investData.toFixed(2),
    DataNumbers,
  });
});

//  Delete User --Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }
  await Promise.all([
    AppLock.deleteMany({ WorkerId: user._id }),
    AppLock.deleteMany({ ownerId: user._id }),
  ]);

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

// for contact us page
exports.contactUsEmailRecieve = catchAsyncError(async (req, res, next) => {
  const { name, email, message } = req.body;

  try {
    await sendEmail({
      email: process.env.SMTP_MAIL, // Your email to receive messages
      subject: `Contact Form Message from ${name}`,
      message: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      htmlMessage: `
    <!DOCTYPE html>
<html>
<head>
</head>
<body>
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #007bff; color: #ffffff; text-align: center; padding: 20px;">
        <h1 style="margin: 0; font-size: 24px;">New Contact Form Message</h1>
      </div>
      
      <div style="padding: 20px; color: #333333; line-height: 1.6;">
        <p style="margin: 0 0 15px;">
          <strong style="color: #007bff;">Name:</strong> ${name}
        </p>
        <p style="margin: 0 0 15px;">
          <strong style="color: #007bff;">Email:</strong> ${email}
        </p>
        <p style="margin: 0 0 15px;">
          <strong style="color: #007bff;">Message:</strong><br>
          ${message}
        </p>
      </div>

      <hr style="border: 1px solid #e9ecef; margin: 0;" />
      
      <div style="text-align: center; background-color: #f4f4f4; padding: 15px; font-size: 12px; color: #888888;">
        <p style="margin: 0 0 10px;">
          Received this message via your website's Contact Us form.
        </p>
        <p style="margin: 0; font-style: italic;">
          If you did not expect this email, please disregard it.
        </p>
        <p style="margin: 10px 0 0;">
          &copy; ${new Date().getFullYear()} ashopiy. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`,
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email", error);
    res
      .status(500)
      .json({ success: false, message: "Email could not be sent" });
  }
});

// add merchant ID
exports.addMerchantID = catchAsyncError(async (req, res, next) => {
  const { merchantID } = req.body;
  const email = req.user.email;

  // If merchantID is provided, check if it exists in another user's record
  if (merchantID) {
    const existingMerchant = await User.findOne({ merchantID });

    if (existingMerchant && existingMerchant.email !== email) {
      return res.status(400).json({
        success: false,
        message: "Merchant ID already exists. Please use a unique one.",
      });
    }
  }

  // Find the user by email and update the merchantID field
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { merchantID } },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "Merchant ID added successfully",
    merchantID: user.merchantID,
  });
});

// Unified function to send registration trial email
const sendTrialEmail = async (
  user,
  subscriptionStartDate,
  subscriptionEndDate
) => {
  const formattedStartDate = moment(subscriptionStartDate).format(
    "MMMM D, YYYY"
  );
  const formattedEndDate = moment(subscriptionEndDate).format("MMMM D, YYYY");

  const emailOptions = {
    email: user.email,
    subject: "Welcome to ashopiy - Free 1 Week Trial Activated",
    message: `Hi ${user.Name},\n\nWe are pleased to inform you that your registration was successful, and you have received a free 1-week trial subscription from ${formattedStartDate} to ${formattedEndDate}.\n\nEnjoy exploring our platform and make the most of your trial period.\n\nBest regards,\nThe ashopiy Team`,
    htmlMessage: ` <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ashopiy</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #374151;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to ashopiy!</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Your business journey starts here</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <!-- Greeting -->
            <div style="margin-bottom: 30px;">
              <h2 style="color: #6366f1; margin: 0 0 15px 0; font-size: 22px;">Hello ${
                user.Name
              },</h2>
              <p style="color: #6b7280; margin: 0; font-size: 16px;">
                We're thrilled to welcome you to ashopiy! Your registration was successful, and we've activated your free 1-week trial to help you explore all our features.
              </p>
            </div>

            <!-- Trial Card -->
            <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 30px 0;">
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="background-color: #a855f7; color: #ffffff; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px;">
                  ⭐
                </div>
              </div>
              <h3 style="color: #6366f1; text-align: center; margin: 0 0 20px 0; font-size: 20px;">Your Free Trial is Active</h3>
              
              <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; border: 1px solid #e2e8f0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9;">
                  <span style="color: #64748b; font-weight: 600;">Plan:</span>
                  <span style="color: #6366f1; font-weight: 600;">Basic Plan (1 Week Trial)</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9;">
                  <span style="color: #64748b; font-weight: 600;">Start Date:</span>
                  <span style="color: #059669; font-weight: 600;">${formattedStartDate}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b; font-weight: 600;">End Date:</span>
                  <span style="color: #dc2626; font-weight: 600;">${formattedEndDate}</span>
                </div>
              </div>
            </div>

<!-- Features -->
<div style="margin: 30px 0;">
  <h3 style="color: #6366f1; margin: 0 0 15px 0; font-size: 18px;">
    During your trial, you can:
  </h3>
  <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
    <li style="margin-bottom: 8px;">Try all the features of the platform</li>
    <li style="margin-bottom: 8px;">Create and set up your shop profile</li>
    <li style="margin-bottom: 8px;">Add product prices and check your earnings</li>
    <li>See simple reports and analytics</li>
  </ul>
</div>


            <!-- CTA Button -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="#" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; transition: all 0.3s;">
                Start Exploring Now
              </a>
            </div>

            <!-- Support Info -->
            <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; text-align: center;">
              <p style="color: #0369a1; margin: 0; font-size: 14px;">
                <strong>Need help?</strong> Our support team is here for you at 
                <a href="mailto:info.ashopiy@gmail.com" style="color: #0369a1; text-decoration: underline;">info.ashopiy@gmail.com</a>
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #1f2937; padding: 30px; text-align: center;">
            <div style="margin-bottom: 15px;">
              <span style="color: #6366f1; font-size: 20px; font-weight: 700;">ashopiy</span>
            </div>
            <p style="color: #9ca3af; margin: 0 0 15px 0; font-size: 14px;">
              Empowering businesses with smart solutions
            </p>
            <p style="color: #6b7280; margin: 0; font-size: 12px;">
             &copy; ${new Date().getFullYear()} ashopiy. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>`,
  };

  await sendEmail(emailOptions);
};
