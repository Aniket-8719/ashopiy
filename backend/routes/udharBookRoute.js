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

router.route("/createUdhar").post(isAuthenticatedUser, checkSubscriptionStatus, createUdhar);
router.route("/generate-qr").post(QRCodeGen);
router.route("/allUdhars").get(isAuthenticatedUser, getAllUdhar);
router
  .route("/udhar/:id")
  .get(isAuthenticatedUser, getSingleUdhar)
  .delete(isAuthenticatedUser, checkSubscriptionStatus, deleteUdhar)
  .put(isAuthenticatedUser, checkSubscriptionStatus, updateUdhar);

module.exports = router;
