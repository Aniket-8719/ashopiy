const ProductCategory = require("../models/ProductCategoryModel");
const catchAsyncError = require("../middleware/catchAsyncError");

// Create Product Category
exports.createProductCategory = catchAsyncError(async (req, res, next) => {
  let userId = req.user._id;
  if (req.user.role === "worker") {
    if (!req.user.workerDetails?.ownerAccountId) {
      return res
        .status(401)
        .json({ message: "You are not recognized by any owner." });
    }
    userId = req.user.workerDetails.ownerAccountId;
  }
  const { name, price } = req.body;

  const validNamePattern = /^[a-zA-Z0-9\s-]+$/;

  // Check for existing category
  const existingCategory = await ProductCategory.findOne({ name: name.trim() });
  if (existingCategory) {
    return res
      .status(400)
      .json({ message: "Category with this name already exists" });
  }

  // Validate name
  if (!name || !validNamePattern.test(name)) {
    return res.status(400).json({
      message:
        "Category name can only contain letters, numbers, spaces, and dashes",
    });
  }

  // Validate price (optional, but must be non-negative if provided)
  let numericPrice;
  if (price !== undefined && price !== "") {
    numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: "Please provide a valid price" });
    }
  }

  try {
    const category = await ProductCategory.create({
      name: name.trim(),
      price: numericPrice,
      user: userId
    });

    res.status(201).json({
      success: true,
      message: "Product category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
});


// Get All Product Categories
exports.getAllProductCategories = catchAsyncError(async (req, res, next) => {
  let userId = req.user._id;
  if (req.user.role === "worker") {
    if (!req.user.workerDetails?.ownerAccountId) {
      return res
        .status(401)
        .json({ message: "You are not recognized by any owner." });
    }
    userId = req.user.workerDetails.ownerAccountId;
  }
  const categories = await ProductCategory.find({user: userId}).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    categories,
  });
});

// Get Single Product Category
exports.getProductCategory = catchAsyncError(async (req, res, next) => {
  let userId = req.user._id;
  if (req.user.role === "worker") {
    if (!req.user.workerDetails?.ownerAccountId) {
      return res
        .status(401)
        .json({ message: "You are not recognized by any owner." });
    }
    userId = req.user.workerDetails.ownerAccountId;
  }
  const category = await ProductCategory.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Product category not found" });
  }

  if(category.user.toString() !== userId.toString()){
    return res.status(403).json({ message: "You don't have the right to access it." });
  }

  res.status(200).json({
    success: true,
    category,
  });
});

// Update Product Category
exports.updateProductCategory = catchAsyncError(async (req, res, next) => {
  let userId = req.user._id;
  if (req.user.role === "worker") {
    if (!req.user.workerDetails?.ownerAccountId) {
      return res
        .status(401)
        .json({ message: "You are not recognized by any owner." });
    }
    userId = req.user.workerDetails.ownerAccountId;
  }
  const { name, price } = req.body;

  // Regex to allow only letters, numbers, spaces, dashes
  const validNamePattern = /^[a-zA-Z0-9\s-]+$/;

  // Find category by ID
  let category = await ProductCategory.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Product category not found" });
  }
  if(category.user.toString() !== userId.toString()){
    return res.status(403).json({ message: "You don't have the right to update it." });
  } 

  // Validate and update name if provided
  if (name) {
    if (!validNamePattern.test(name.trim())) {
      return res.status(400).json({
        message: "Category name can only contain letters, numbers, spaces, and dashes",
      });
    }
    category.name = name.trim();
  }

  // Validate and update price if provided
  if (price !== undefined && price !== "") {
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: "Please provide a valid non-negative price" });
    }
    category.price = numericPrice;
  }

  // Save updated category
  try {
    await category.save();

    res.status(200).json({
      success: true,
      message: "Product category updated successfully",
      category,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((val) => val.message)
        .join(", ");
      return res.status(400).json({ message });
    }
    next(error);
  }
});

// Delete Product Category
exports.deleteProductCategory = catchAsyncError(async (req, res, next) => {
  let userId = req.user._id;
  if (req.user.role === "worker") {
    if (!req.user.workerDetails?.ownerAccountId) {
      return res
        .status(401)
        .json({ message: "You are not recognized by any owner." });
    }
    userId = req.user.workerDetails.ownerAccountId;
  }
  const category = await ProductCategory.findByIdAndDelete(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Product category not found" });
  }
  if(category.user.toString() !== userId.toString()){
    return res.status(403).json({ message: "You don't have the right to delete it." });
  }

  res.status(200).json({
    success: true,
    message: "Product category deleted successfully",
  });
});
