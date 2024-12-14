const UdharBook = require("../models/udharBookModel");
const catchAsyncError = require("../middleware/catchAsyncError");

// Create Udhar Record
exports.createUdhar = catchAsyncError(async (req, res, next) => {
    const { customerName, phoneNumber, address, udharAmount, transactions } = req.body;

    const udhar = await UdharBook.create({
        customerName,
        phoneNumber,
        address,
        udharAmount,
        transactions
    });

    res.status(201).json({
        success: true,
        message: "Udhar record created successfully",
        udhar
    });
});

// Get All Udhar Records
exports.getAllUdhar = catchAsyncError(async (req, res, next) => {
    const udharRecords = await UdharBook.find();

    res.status(200).json({
        success: true,
        message: "Udhar records fetched successfully",
        udharRecords
    });
});

// Get Single Udhar Record by ID
exports.getSingleUdhar = catchAsyncError(async (req, res, next) => {
    const udhar = await UdharBook.findById(req.params.id);

    if (!udhar) {
        return res.status(404).json({
            success: false,
            message: "Udhar record not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Udhar record fetched successfully",
        udhar
    });
});

// Update Udhar Record
exports.updateUdhar = catchAsyncError(async (req, res, next) => {
    let udhar = await UdharBook.findById(req.params.id);

    if (!udhar) {
        return res.status(404).json({
            success: false,
            message: "Udhar record not found"
        });
    }

    const { customerName, phoneNumber, address, udharAmount, transactions } = req.body;

    udhar = await UdharBook.findByIdAndUpdate(
        req.params.id,
        {
            customerName,
            phoneNumber,
            address,
            udharAmount,
            transactions,
        },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: "Udhar record updated successfully",
        udhar
    });
});

// Delete Udhar Record
exports.deleteUdhar = catchAsyncError(async (req, res, next) => {
    const udhar = await UdharBook.findById(req.params.id);

    if (!udhar) {
        return res.status(404).json({
            success: false,
            message: "Udhar record not found"
        });
    }

    await udhar.remove();

    res.status(200).json({
        success: true,
        message: "Udhar record deleted successfully"
    });
});
