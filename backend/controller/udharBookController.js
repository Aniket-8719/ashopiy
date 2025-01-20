const UdharBook = require("../models/udharBookModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const moment = require("moment-timezone");

// Create Udhar Record
exports.createUdhar = catchAsyncError(async (req, res, next) => {
  const { customerName, phoneNumber, address, description, udharAmount } =
    req.body;

  const exitingUserUdhar = await UdharBook.findOne({ phoneNumber });
  if (exitingUserUdhar) {
    return res
      .status(400)
      .json({ message: "Udhar already exist on this number" });
  }
  // Check if dailyIncome is valid and can be converted to a number
  if (!udharAmount || isNaN(Number(udharAmount))) {
    return res
      .status(400)
      .json({ message: "Please provide a valid daily income" });
  }

  // Get the current date and time in the Asia/Kolkata timezone
  const indiaDateTime = moment.tz("Asia/Kolkata");

  // Add 5 hours and 30 minutes to adjust to UTC
  const utcDateTime = indiaDateTime.clone().add(5, "hours").add(30, "minutes");

  try {
    // Create Udhar record in the database
    const udhar = await UdharBook.create({
      customerName,
      phoneNumber,
      address,
      description,
      udharAmount: Number(udharAmount),
      date: utcDateTime.toDate(),
      time: indiaDateTime.format("HH:mm:ss"),
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Udhar record created successfully",
      udhar,
    });
  } catch (error) {
     // Handle Mongoose validation errors manually
     if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((val) => val.message).join(", ");
      return res.status(400).json({ message });
    }

    // For other errors, pass them to the next error handler
    next(error);
  }
});

// Get All Udhar Records
exports.getAllUdhar = catchAsyncError(async (req, res, next) => {
  const { search } = req.query;

  // Create a dynamic query object
  const query = { user: req.user._id }; // Filter by authenticated user's ID

  // Handle search functionality
  if (search) {
    const searchRegex = new RegExp(search, "i"); // Case-insensitive regex
    query.$or = [
      { customerName: searchRegex },
      { phoneNumber: searchRegex },
      { address: searchRegex },
      { description: searchRegex },
    ];
  }
  const udharRecords = await UdharBook.find(query)
    .collation({ locale: "en", strength: 2 })
    .sort({ _id: -1 });

  res.status(200).json({
    success: true,
    message: "Udhar records fetched successfully",
    udharRecords,
  });
});

// Get Single Udhar Record by ID
exports.getSingleUdhar = catchAsyncError(async (req, res, next) => {
  const udhar = await UdharBook.findById(req.params.id);

  if (!udhar) {
    return res.status(404).json({
      success: false,
      message: "Udhar record not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Udhar record fetched successfully",
    udhar,
  });
});

// Update Udhar Record
exports.updateUdhar = catchAsyncError(async (req, res, next) => {
  let udhar = await UdharBook.findById(req.params.id);

  if (!udhar) {
    return res.status(404).json({
      success: false,
      message: "Udhar record not found",
    });
  }

  const { customerName, phoneNumber, description, address, udharAmount } =
    req.body;

  udhar = await UdharBook.findByIdAndUpdate(
    req.params.id,
    {
      customerName,
      phoneNumber,
      address,
      udharAmount,
      description,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Udhar record updated successfully",
    udhar,
  });
});

// Delete Udhar Record
exports.deleteUdhar = catchAsyncError(async (req, res, next) => {
  const udhar = await UdharBook.findById(req.params.id);

  if (!udhar) {
    return res.status(404).json({
      success: false,
      message: "Udhar record not found",
    });
  }

  await udhar.deleteOne();

  res.status(200).json({
    success: true,
    message: "Udhar record deleted successfully",
  });
});


const QRCode = require("qrcode");

exports.QRCodeGen = catchAsyncError(async (req, res) => {
  const { upiId, amount } = req.body;

  if (!upiId || !amount) {
    return res.status(400).json({ error: "Missing UPI ID or amount" });
  }

  const uniqueOrderId = `TXN${Date.now()}`;  // Unique ID to track payments

  const upiURL = `upi://pay?pa=${upiId}&pn=AshopiyShopkeeper&mc=0000&tid=${uniqueOrderId}&tr=${uniqueOrderId}&tn=Purchase&am=${amount}&cu=INR`;

  try {
    const qrCodeImage = await QRCode.toDataURL(upiURL);
    res.status(200).json({ qrCodeUrl: qrCodeImage, orderId: uniqueOrderId });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});






