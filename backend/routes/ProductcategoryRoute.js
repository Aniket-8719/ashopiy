const express = require("express");
const router = express.Router();

const {
  isAuthenticatedUser,
  authorizedRoles,
} = require("../middleware/auth");

const {
  createProductCategory,
  getAllProductCategories,
  getProductCategory,
  updateProductCategory,
  deleteProductCategory,
} = require("../controller/productCategoryController");

const { checkSubscriptionStatus } = require("../middleware/subscribe");
const { checkFeatureLock } = require("../middleware/lock");

// Create Product Category
router
  .route("/createCategory")
  .post(isAuthenticatedUser, checkSubscriptionStatus, checkFeatureLock("CreateProductCategory"), createProductCategory);

// Get All Categories
router
  .route("/allCategories")
  .get(isAuthenticatedUser, checkFeatureLock("ProductCategory"), getAllProductCategories);

// Get, Update, Delete Single Category by ID
router
  .route("/category/:id")
  .get(isAuthenticatedUser,checkFeatureLock("CreateProductCategory"),  getProductCategory)
  .put(isAuthenticatedUser,checkFeatureLock("CreateProductCategory"), checkSubscriptionStatus, updateProductCategory)
  .delete(isAuthenticatedUser,checkFeatureLock("CreateProductCategory"), checkSubscriptionStatus, deleteProductCategory);

module.exports = router;
