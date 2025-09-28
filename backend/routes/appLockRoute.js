const express = require("express");
const {deleteLock, createLockSettings, getAllAppLocks, updateAccessFeatures } = require("../controller/appLockController");
const { isAuthenticatedUser } = require("../middleware/auth");
const { checkSubscriptionStatus } = require("../middleware/subscribe");
const router = express.Router();

// App lock
router.route("/create-lock").post(isAuthenticatedUser, checkSubscriptionStatus, createLockSettings);
router.route("/all-locks").get(isAuthenticatedUser, getAllAppLocks);
router.route("/updateLock/:id").put(isAuthenticatedUser, updateAccessFeatures);
router.route("/deleteLock/:id").delete(isAuthenticatedUser, deleteLock);


module.exports = router;
