const mongoose = require('mongoose');

const UdharBookSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/, // Assuming Indian phone numbers
    },
    address: {
        type: String,
        default: "Not Provided"
    },
    udharAmount: {
        type: Number,
        required: true,
        min: 0
    },
    transactions: [
        {
            date: {
                type: Date,
                default: Date.now,
            },
            description: {
                type: String,
                trim: true,
                default: "No description provided",
            },
            amount: {
                type: Number,
                required: true,
            },
            type: {
                type: String,
                enum: ["credit", "debit"], // Specify whether it's a loan given (credit) or received back (debit)
                required: true,
            }
        }
    ],
    totalCredit: {
        type: Number,
        default: 0,
    },
    totalDebit: {
        type: Number,
        default: 0,
    },
    remainingBalance: {
        type: Number,
        default: function () {
            return this.totalCredit - this.totalDebit;
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Middleware to update `updatedAt` on document modification
UdharBookSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const UdharBook = mongoose.model('UdharBook', UdharBookSchema);

module.exports = UdharBook;
