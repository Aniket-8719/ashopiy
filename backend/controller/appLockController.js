const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const AppLock = require("../models/appLockModel"); // Assuming you have the AppLock model

// app lock controller
exports.updateLockSettings = catchAsyncError(async (req, res, next) => {
  const { features, setPassword, loginPassword } = req.body;

  // Validate input
  if (!features || !Array.isArray(features)) {
    return next(new ErrorHandler("Features must be an array.", 400));
  }
  if (!setPassword || setPassword.length < 6) {
    return next(
      new ErrorHandler("SetPassword must be at least 6 characters long.", 400)
    );
  }
  if (!loginPassword) {
    return next(new ErrorHandler("Login password is required.", 400));
  }

  try {
    // Step 1: Verify the user's login password
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordMatched = await user.comparePassword(loginPassword);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid login password", 401));
    }

    // Step 2: Hash the lock password
    const hashedSetPassword = await bcrypt.hash(setPassword, 10);

    // Step 3: Find or create the AppLock document
    let appLock = await AppLock.findOne({ user: req.user._id });
    if (!appLock) {
      // If no lock settings exist, create a new record
      appLock = new AppLock({
        user: req.user._id,
        password: hashedSetPassword,
        lockedFeatures: {}, // Optional: Schema default will apply
      });
    } else {
      // Update the lock password if needed
      appLock.password = hashedSetPassword;
    }

    // Step 4: Update the locked features
    const defaultFeatures = [
      "Earning",
      "Charts",
      "Investments",
      "UdharBook",
      "History",
    ];

    // Mark all features as false
    defaultFeatures.forEach((feature) => {
      appLock.lockedFeatures.set(feature, false);
    });

    // Mark specified features as true
    features.forEach((feature) => {
      if (defaultFeatures.includes(feature)) {
        appLock.lockedFeatures.set(feature, true);
      }
    });

    await appLock.save();

    res.status(200).json({ message: "Lock settings updated successfully." });
  } catch (error) {
    console.error("Error updating lock settings:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// app UnLock controller
exports.unlockSettings = catchAsyncError(async (req, res, next) => {
    const { featureName, setPassword } = req.body;
  
    // Validate input
    if (!featureName || typeof featureName !== "string") {
      return next(new ErrorHandler("Feature name must be a non-empty string.", 400));
    }
    if (!setPassword) {
      return next(new ErrorHandler("SetPassword is required.", 400));
    }
  
    try {
      // Step 1: Find the AppLock document for the user
      const appLock = await AppLock.findOne({ user: req.user._id }).select("+password");
      if (!appLock) {
        return res.status(404).json({ message: "Lock settings not found for the user." });
      }
  
      // Step 2: Verify the setPassword
      const isPasswordMatched = await bcrypt.compare(setPassword, appLock.password);
      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid lock password.", 401));
      }
  
      // Step 3: Update the lockedFeatures map
      if (appLock.lockedFeatures.has(featureName)) {
        // Mark the specified feature as false (unlocked)
        appLock.lockedFeatures.set(featureName, false);
      } else {
        return next(new ErrorHandler(`Feature "${featureName}" does not exist in lock settings.`, 400));
      }
  
      // Save the updated document
      await appLock.save();
  
      res.status(200).json({
        success: true,
        message: `Feature "${featureName}" unlocked successfully.`,
        lockedFeatures: Object.fromEntries(appLock.lockedFeatures), // Send updated features map as response
      });
    } catch (error) {
      console.error("Error updating lock settings:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  });

// app Lock List
exports.lockfeaturesList = catchAsyncError(async (req, res, next) => {
    const lockfeaturelist = await AppLock.find({ user: req.user._id })
       
  
      res.status(200).json({
        success: true,
        lockfeaturelist
      });
    
  });
  
   
