const AppLock = require("../models/appLockModel"); // Assuming this is the correct model

exports.checkFeatureLock = (featureName) => {
  return async (req, res, next) => {
    try {
      const userId = req.user._id; // Assuming the user ID is available in req.user from authentication middleware

      // Fetch the locked features for the authenticated user
      const lockDoc = await AppLock.findOne({ userId });

      // If no lock data is found, proceed without any error
      if (!lockDoc) {
        return next();
      }

      // Check if the specific feature is locked
      const isFeatureLocked = lockDoc.lockedFeatures[featureName];

      // If the feature is unlocked (false), allow the request to proceed
      if (!isFeatureLocked) {
        return next();
      }

      // If the feature is locked, deny access
      return res.status(403).json({
        message: `Access denied. The feature "${featureName}" is locked.`,
      });
    } catch (error) {
      console.error("Error checking feature lock:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};
