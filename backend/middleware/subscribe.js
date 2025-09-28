const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandler");

exports.checkSubscriptionStatus = catchAsyncError(async (req, res, next) => {
  let user = req.user;

  if (!user) {
    return next(
      new ErrorHandler("User not authenticated. Please log in.", 401)
    );
  }

  if (user?.role === "admin") {
    return next();
  }

  if (user?.role === "worker") {
    Owner = await User.findById(user?.workerDetails?.ownerAccountId);
    if (!Owner) {
      return next(new ErrorHandler("You are not recognized by any owner.", 401));
    }
    user = Owner;
  }

  // Check if the user has an active subscription
  const hasActiveSubscription =
    user?.subscription?.basic?.isActive ||
    user?.subscription?.premium?.isActive;

  if (!hasActiveSubscription) {
    return next(
      new ErrorHandler(
        "You do not have an active subscription. Please subscribe to access this resource.",
        403
      )
    );
  }

  next(); // User has an active subscription, proceed to the next middleware or route handler
});
