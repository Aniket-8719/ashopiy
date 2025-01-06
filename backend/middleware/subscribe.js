const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");

exports.checkSubscriptionStatus = catchAsyncError(async (req, res, next) => {
  const user = req.user; // Assuming req.user is already populated via authentication middleware

  if (!user) {
    return next(new ErrorHandler("User not authenticated. Please log in.", 401));
  }

  // Check if the user has an active subscription
  const hasActiveSubscription =
    user?.subscription?.basic?.isActive || user?.subscription?.premium?.isActive;

  if (!hasActiveSubscription) {
    return next(
      new ErrorHandler("You do not have an active subscription. Please subscribe to access this resource.", 403)
    );
  }

  next(); // User has an active subscription, proceed to the next middleware or route handler
});
