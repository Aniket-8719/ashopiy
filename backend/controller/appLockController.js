const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const AppLock = require("../models/appLockModel");

const VALID_FEATURES = [
  "Earning",
  "Charts",
  "Investments",
  "UdharBook",
  "CreateProductCategory",
  "ProductCategory",
  "History",
];
const DEFAULT_LOCKED_FEATURES = Object.fromEntries(
  VALID_FEATURES.map(feature => [feature, false])
);

// CREATE AppLock for a worker
exports.createLockSettings = catchAsyncError(async (req, res, next) => {
  const { workerEmail, features } = req.body;

  // Step 1: Validate role
  if (req.user.role !== "shopkeeper" && req.user.role !== "admin") {
    return next(new ErrorHandler("Only shopkeepers can assign AppLock.", 403));
  }

  if (!workerEmail) {
    return next(new ErrorHandler("Worker email is required.", 400));
  }
  if (!features || !Array.isArray(features)) {
    return next(new ErrorHandler("Features must be an array.", 400));
  }

  // Step 2: Find worker
  const worker = await User.findOne({ email: workerEmail });
  if (!worker) return next(new ErrorHandler("Worker not found.", 404));

  if (worker.role !== "worker") {
    return next(new ErrorHandler("This user is not registered as a worker.", 400));
  }

  // Step 3: Check if worker already belongs to another owner
  if (
    worker.workerDetails?.ownerAccountId &&
    worker.workerDetails.ownerAccountId.toString() !== req.user._id.toString()
  ) {
    return next(new ErrorHandler("Worker already assigned to another owner.", 400));
  }

  // Step 4: Check owner limit (max 3 AppLocks)
  const appLockCount = await AppLock.countDocuments({ ownerId: req.user._id });
  if (appLockCount >= 3) {
    return next(new ErrorHandler("You can assign AppLock to only 3 workers.", 400));
  }

  // Step 5: Prevent duplicate AppLock for same worker under same owner
  const existing = await AppLock.findOne({
    WorkerId: worker._id,
    ownerId: req.user._id,
  });
  if (existing) {
    return next(new ErrorHandler("This worker already has an AppLock entry.", 400));
  }

  // Step 6: Validate and prepare lockedFeatures (using global config)
  for (const f of features) {
    if (!VALID_FEATURES.includes(f)) {
      return next(new ErrorHandler(`Invalid feature: ${f}`, 400));
    }
  }

  // Create lockedFeatures object using the default and override with selected features
  const lockedFeatures = { ...DEFAULT_LOCKED_FEATURES };
  features.forEach(feature => {
    lockedFeatures[feature] = true;
  });

  // Step 7: Create AppLock document
  const newAppLock = new AppLock({
    WorkerId: worker._id,
    WorkerEmailId: worker.email,
    ownerId: req.user._id,
    lockedFeatures,
  });

  await newAppLock.save();

  // Step 8: Assign worker under this owner (if not already assigned)
  if (!worker.workerDetails.ownerAccountId) {
    worker.workerDetails.ownerAccountId = req.user._id;
    await worker.save();
  }

  res.status(201).json({
    success: true,
    message: "AppLock created successfully.",
    document: newAppLock,
  });
});

// GET all AppLock docs for a shopkeeper (owner)
exports.getAllAppLocks = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "shopkeeper" && req.user.role !== "admin") {
    return next(new ErrorHandler("Only shopkeepers can view AppLocks.", 403));
  }

  // Step 1: Fetch all AppLocks for this owner
  const appLocks = await AppLock.find({ ownerId: req.user._id }).lean();

  if (!appLocks.length) {
    return res.status(200).json({ success: true, documents: [] });
  }

  // Step 2: Get all workerIds
  const workerIds = [
    ...new Set(appLocks.map((doc) => doc.WorkerId.toString())),
  ];

  // Step 3: Fetch workers data
  const workers = await User.find({ _id: { $in: workerIds } })
    .select("avatar Name email phone role")
    .lean();

  const workerMap = {};
  workers.forEach((w) => (workerMap[w._id.toString()] = w));

  // Step 4: Enrich docs with worker details + access features
  const enrichedDocs = appLocks.map((doc) => ({
    _id: doc._id,
    ownerId: doc.ownerId,
    WorkerId: doc.WorkerId,
    WorkerEmailId: doc.WorkerEmailId,
    lockedFeatures: doc.lockedFeatures, // ✅ include features
    createdAt: doc.createdAt, // ✅ timestamps
    updatedAt: doc.updatedAt,
    worker: workerMap[doc.WorkerId.toString()] || null,
  }));

  res.status(200).json({
    success: true,
    count: enrichedDocs.length,
    documents: enrichedDocs,
  });
});

// Update Access Features (updated)
exports.updateAccessFeatures = catchAsyncError(async (req, res, next) => {
  const { id } = req.params; // AppLock document ID
  const { features } = req.body; // feature to unlock (string)
  const loggedInUser = req.user;

  // Check if user is shopkeeper
  if (loggedInUser.role !== "shopkeeper" && loggedInUser.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Only shopkeepers can update access features",
    });
  }

  // Find the AppLock document
  const appLockDoc = await AppLock.findById(id);
  if (!appLockDoc) {
    return res.status(404).json({
      success: false,
      message: "AppLock document not found",
    });
  }

  // Verify ownership
  if (String(appLockDoc.ownerId) !== String(loggedInUser._id)) {
    return res.status(403).json({
      success: false,
      message: "You are not the creator of this AppLock document",
    });
  }

  // Create a new lockedFeatures object using the global default
  const newLockedFeatures = { ...DEFAULT_LOCKED_FEATURES };

  // Set the selected features to true
  if (features && Array.isArray(features)) {
    features.forEach((feature) => {
      if (VALID_FEATURES.includes(feature)) {
        newLockedFeatures[feature] = true;
      }
    });
  }

  // Update using findByIdAndUpdate for better reliability
  const updatedDoc = await AppLock.findByIdAndUpdate(
    id,
    { lockedFeatures: newLockedFeatures },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: `Access updated successfully`,
    data: updatedDoc,
  });
});

// Delete AppLock document
exports.deleteLock = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "shopkeeper" && req.user.role !== "admin") {
    return next(new ErrorHandler("Only shopkeepers can delete AppLock.", 403));
  }
  const lock = await AppLock.findById(req.params.id);
  if (!lock) {
    return next(new ErrorHandler("Lock not found", 404));
  }
  // Verify ownership
  if (String(lock.ownerId) !== String(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: "You are not the creator of this AppLock document",
    });
  }
  const user = await User.findById(lock.WorkerId);
  user.workerDetails.ownerAccountId = null;
  await user.save();
  await lock.deleteOne();
  res.status(200).json({
    success: true,
    message: "Lock deleted successfully",
  });
});
