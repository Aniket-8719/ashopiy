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

    // Get the current date and time in the Asia/Kolkata timezone
    const indiaDateTime = moment.tz("Asia/Kolkata");
  
    // Add 5 hours and 30 minutes to adjust to UTC
    const utcDateTime = indiaDateTime.clone().add(5, "hours").add(30, "minutes");

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
    landmark,
    address,
    createdAt: utcDateTime.toDate(), // Store the UTC Date object after adjustment
    agentID,
  });

  //  Creating Token and saving in cookie
  const token = user.getJWTToken();

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
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
    httpOnly: true,
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
    httpOnly: true,
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

  const htmlMessage = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h1 style="font-weight: bold; color: #d87600; font-size: 24px;">ashopiy</h1>
    
    <h2 style="color: #f78a08;">Hi ${user.name || "User"},</h2>
    
    <p>We received a request to reset the password for your account.</p>
    
    <p><strong>🔑 Reset Password Link:</strong></p>
    <p><a href="${resetPasswordUrl}" style="color: #f78a08; text-decoration: none;">Click here to reset your password</a></p>
    
    <p>If you didn’t request a password reset, you can safely ignore this email. Your password will not be changed unless you click the link above and create a new one.</p>
    
    <p>If you have any questions, feel free to reach out to our support team.</p>
    
    <p>Thanks,<br>The Ashopiy Team</p>
  </div>
`;

  try {
    await sendEmail({
      email: user.email,
      subject: `ashopiy Recovery`,
      message: ``,
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

const storage = (document)=>{
  // Calculate total size in bytes
  let totalSizeInBytes = 0;

  document.forEach((doc) => {
    // Convert the document to JSON and calculate its size in bytes
    const docJson = JSON.stringify(doc);
    const docSize = Buffer.byteLength(docJson, 'utf8'); // Size in bytes
    totalSizeInBytes += docSize;
  });

  const TotalSizeInMB = totalSizeInBytes / (1024 * 1024); // Convert bytes to MB
  return TotalSizeInMB;
  
}

// Get Single User (Admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
    // Fetch all DailyIncome documents for the user
    const dailyIncome = await DailyIncome.find({ user: userId });
    const fullDayIncome = await FullDayIncome.find({user:userId});
    const investmentDocument = await investmentModel.find({user:userId});

    const dailyData = storage(dailyIncome);
    const fullDayData = storage(fullDayIncome);
    const investData = storage(investmentDocument);

    console.log("all data storeage", `${dailyData.toFixed(2)}, ${fullDayData.toFixed(2)}, ${investData.toFixed(2)}`)

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

// for contact us page
exports.contactUsEmailRecieve = catchAsyncError(async (req, res, next) => {
  const { name, email, message } = req.body;

  try {
    await sendEmail({
      email: process.env.COMPANY_EMAIL, // Your email to receive messages
      subject: `Contact Form Message from ${name}`,
      message: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      htmlMessage: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #2a9d8f;">New Contact Form Message</h2>
    
    <p><strong style="color: #264653;">Name:</strong> ${name}</p>
    <p><strong style="color: #264653;">Email:</strong> ${email}</p>
    <p><strong style="color: #264653;">Message:</strong> <br>${message}</p>

    <hr style="border: 1px solid #e9ecef; margin-top: 20px;" />
    
    <footer style="color: #6c757d; font-size: 12px;">
      <p>Received this message via your website's Contact Us form.</p>
      <p style="font-style: italic;">If you did not expect this email, please disregard it.</p>
    </footer>
  </div>
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



