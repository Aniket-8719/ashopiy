const express = require("express");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, getAllAdmins, deleteUser, contactUsEmailRecieve, addMerchantID } = require("../controller/userController");
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

// Import the rate limiters
const { registrationLimiter, loginLimiter, contactUsmessage } = require("../middleware/rateLimiter");


router.route("/registerUser").post(registrationLimiter, registerUser);
router.route("/loginUser").post(loginLimiter, loginUser);
router.route("/password/forgot").post(forgotPassword); 
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser,getUserDetails);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/me/update").put(isAuthenticatedUser,updateProfile);
router.route("/user/add-merchant-id").put(isAuthenticatedUser, addMerchantID);

router.route("/admin/allAdmins").get(isAuthenticatedUser, authorizedRoles("admin"), getAllAdmins);
router.route("/admin/allUsers").get(isAuthenticatedUser, authorizedRoles("admin"), getAllUser);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizedRoles("admin"), getSingleUser)
                                .put(isAuthenticatedUser, authorizedRoles("admin"),updateUserRole)
                                .delete(isAuthenticatedUser, authorizedRoles("admin"),deleteUser);

router.route("/contactUs").post(contactUsmessage, contactUsEmailRecieve); 






module.exports = router;