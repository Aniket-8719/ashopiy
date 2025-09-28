export const hasAccess = (user, featureName, lockedFeatures = {}) => {
  if (!user) return false;

  // Owners/Admins always have access
  if (user.role !== "worker") return true;

  // If worker has NO AppLock assigned (empty object) → block all
  if (user.role === "worker" && Object.keys(lockedFeatures).length === 0) {
    return false;
  }

  if(featureName === "Lock" && user.role === "worker") return false; 

  // Workers → check lock settings
  return !lockedFeatures[featureName]; // true = allowed, false = locked
};
