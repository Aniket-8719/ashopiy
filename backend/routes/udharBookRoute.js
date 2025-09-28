const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");
const {
  createUdhar,
  getAllUdhar,
  deleteUdhar,
  updateUdhar,
  getSingleUdhar,
  QRCodeGen,
} = require("../controller/udharBookController");
const { checkSubscriptionStatus } = require("../middleware/subscribe");
const { checkFeatureLock } = require("../middleware/lock");

router.route("/createUdhar").post(isAuthenticatedUser, checkSubscriptionStatus,checkFeatureLock("UdharBook"), createUdhar);
// router.route("/generate-qr").post(QRCodeGen);
router.route("/allUdhars").get(isAuthenticatedUser, checkFeatureLock("UdharBook"), getAllUdhar);
router
  .route("/udhar/:id")
  .get(isAuthenticatedUser, checkFeatureLock("UdharBook"), getSingleUdhar)
  .delete(isAuthenticatedUser, checkSubscriptionStatus, checkFeatureLock("UdharBook"), deleteUdhar)
  .put(isAuthenticatedUser, checkSubscriptionStatus, checkFeatureLock("UdharBook"), updateUdhar);

module.exports = router;
