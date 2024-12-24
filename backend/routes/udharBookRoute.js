const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");
const {
  createUdhar,
  getAllUdhar,
  deleteUdhar,
  updateUdhar,
  getSingleUdhar,
} = require("../controller/udharBookController");

router.route("/createUdhar").post(isAuthenticatedUser, createUdhar);
router.route("/allUdhars").get(isAuthenticatedUser, getAllUdhar);
router
  .route("/udhar/:id")
  .get(isAuthenticatedUser, getSingleUdhar)
  .delete(isAuthenticatedUser, deleteUdhar)
  .put(isAuthenticatedUser, updateUdhar);

module.exports = router;
