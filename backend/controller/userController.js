const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("cloudinary");

//  Register User
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const {
    email,
    password,
    shopName,
    shopType,
    customShopType,
    shopOwnerName,
    whatsappNo,
    mobileNo,
    gstNo,
    country,
    state,
    city,
    pincode,
    area,
    landmark,
    address,
    agentID,
  } = req.body;

  // Initialize avatar data as null
  let avatar = {
    public_id: null,
    url: null,
  };

  // Check if file exists
  if (req.files && req.files.file) {
    const file = req.files.file;

    // Handle file upload logic (e.g., upload to Cloudinary)
    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "avatars",
    });

    avatar.public_id = uploadResult.public_id;
    avatar.url = uploadResult.secure_url;
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Email already exists", 400));
  }

  // Create a new user
  const user = await User.create({
    avatar,
    email,
    password,
    shopName,
    shopType,
    customShopType,
    shopOwnerName,
    whatsappNo,
    mobileNo,
    gstNo,
    country,
    state,
    city,
    pincode,
    area,
    landmark,
    address,
    agentID,
  });

  //  Creating Token and saving in cookie
  const token = user.getJWTToken();

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly:true,
    secure: true,
    sameSite: 'None',
  };

  res.status(201).cookie("token", token, options).json({
    success: true,
    user,
    token,
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

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly:true,
    secure: true,
    sameSite: 'None',
  };

  res.status(201).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
});

//  Logout User
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly:true,
    secure: true,
    sameSite: 'None',
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

  const message = `Your password reset token is temp-- :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `ashopiy Recovery`,
      message,
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
    httpOnly:true,
    secure: true,
    sameSite: 'None',
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
  res.status(200).json({
    success: true,
    user,
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
    httpOnly:true,
    secure: true,
    sameSite: 'None',
  };

  res.status(201).cookie("authToken", token, options).json({
    success: true,
    user,
    token,
  });
});

//  Update User Profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const { password, role, ...newUserData } = req.body; // Exclude password, role from request body

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

  const user = await User.findById(req.user.id); // Fetch the current user data

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
    new: true, // Return the updated document
    runValidators: true, // Ensure validation rules are applied
    useFindAndModify: false, // Use the newer Mongoose update mechanism
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
      { shopOwnerName: searchRegex },
      { shopName: searchRegex },
      { pincode: searchRegex },
      { area: searchRegex },
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

// Get Single User (Admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//  Delete User --Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  //  we will remove cloudinary later
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
