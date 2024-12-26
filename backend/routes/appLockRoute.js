const express = require("express");
const { updateLockSettings, unlockSettings, lockfeaturesList } = require("../controller/appLockController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();

// App lock
router.route("/lockFeature").post(isAuthenticatedUser, updateLockSettings); 
router.route("/unlockFeature").post(isAuthenticatedUser, unlockSettings); 
router.route("/lockFeatureList").get(isAuthenticatedUser, lockfeaturesList); 


module.exports = router;
