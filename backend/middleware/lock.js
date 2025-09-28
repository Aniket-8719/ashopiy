const AppLock = require("../models/appLockModel");
const ErrorHandler = require("../utils/errorhandler");

exports.checkFeatureLock = (featureName) => {
  return async (req, res, next) => {
    try {
      // Owners/Admins skip lock checks
      if (req.user?.role !== "worker") {
        return next();
      }

      const userId = req.user?._id;
      if (!userId) {
        return next(new ErrorHandler("User not authenticated", 401));
      }

      // Look up lock settings
      const lockDoc = await AppLock.findOne({ WorkerId: userId });

      // If no lockDoc, allow worker
      if (!lockDoc) {
        return next();
      }

      // Check specific feature lock
      const isLocked = lockDoc.lockedFeatures?.get(featureName);

      if (isLocked) {
        return next(
          new ErrorHandler(
            `Access denied. The "${featureName}" feature is locked by your Owner.`,
            403
          )
        );
      }

      // Not locked → allow
      return next();
    } catch (error) {
      console.error("Error checking feature lock:", error);
      return next(new ErrorHandler("Internal server error", 500));
    }
  };
};
