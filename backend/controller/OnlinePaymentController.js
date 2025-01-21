const catchAsyncError = require("../middleware/catchAsyncError");
const moment = require("moment-timezone");
const DailyIncome = require("../models/dailyRevenue");
const User = require("../models/userModel");

// captured by webhook
exports.OnlinePaymentFlow = catchAsyncError(async (req, res) => {
  try {
    const payload = req.body;

    // Extract payment details from the payload
    const payment = payload.payload.payment.entity;

    // Extract and process the merchant ID from the payload
    const merchantId = payload.account_id;
    const merchantID_sub = merchantId.split("_")[1]; // Extract 'PZUqcmc8wPqtC0'

    // Find the user by merchantID_sub in the User model
    const user = await User.findOne({ merchantID: merchantID_sub });

    // Check if the user has an active subscription (basic or premium)
    if (
      user &&
      (user.subscription.basic.isActive || user.subscription.premium.isActive)
    ) {
      // Proceed if payment is captured
      if (payment.status === "captured") {
        // Get the current date and time in the Asia/Kolkata timezone
        const indiaDateTime = moment.tz("Asia/Kolkata");

        // Adjust to UTC by adding 5 hours and 30 minutes
        const utcDateTime = indiaDateTime
          .clone()
          .add(5, "hours")
          .add(30, "minutes");

        // Create a new income entry
        const newIncomeEntry = new DailyIncome({
          dailyIncome: Number(payment.amount / 100), // Convert paise to INR
          time: indiaDateTime.format("HH:mm:ss"), // Time in 'HH:mm:ss' format
          day: indiaDateTime.format("dddd"), // Day of the week
          date: utcDateTime.toDate(), // UTC Date object
          earningType: "Online",
          latestSpecialDay: "Normal", // Or any logic to set special day
          merchantID: merchantID_sub, // Merchant ID from the extracted value
        });

        // Save the new income entry to the database
        await newIncomeEntry.save();

        return res.status(200).json({
          status: "success",
          message: "Payment processed and earnings updated",
        });
      }
    }

    // If payment is not captured or no active subscription
    return res.status(200).json({
      status: "ok",
      message:
        "Payment is not captured or no active subscription. No action taken.",
    });
  } catch (error) {
    console.error("Error processing webhook:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

// Extract payment data function (reuse from above)
// function extractPaymentData(payload) {
//   try {
//     const payment = payload.payload.payment.entity;
//     return {
//       paymentId: payment.id,
//       amount: payment.amount / 100,
//       currency: payment.currency,
//       status: payment.status,
//       method: payment.method,
//       createdAt: new Date(payment.created_at * 1000).toISOString(),
//     };
//   } catch (error) {
//     console.error("Error extracting payment data:", error.message);
//     return null;
//   }
// }
