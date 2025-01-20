const catchAsyncError = require("../middleware/catchAsyncError");
const axios = require("axios");

exports.OnlinePaymentFlow = catchAsyncError(async (req, res) => {
  try {
    console.log("Webhook Payload:", JSON.stringify(req.body, null, 2)); // Log the payload for debugging

    // Validate payload structure
    const { payload } = req.body;
    if (!payload || !payload.payment || !payload.payment.entity) {
      return res.status(400).json({ error: "Invalid webhook payload structure" });
    }

    const { entity } = payload.payment; // Extract the payment entity
    const { amount, status, email, contact, notes } = entity;

    // Check for merchant ID in notes
    const razorpayMerchantId = notes?.merchant_id || null;

    if (!razorpayMerchantId) {
      console.warn("Merchant ID is missing in the notes field.");
      // Optional: Proceed only if merchant ID is critical
      // return res.status(400).json({ error: "Missing merchant ID in notes" });
    }

    if (status === "captured") {
      // Handle captured payment
      const earningData = {
        dailyIncome: amount / 100, // Convert paise to INR
        earningType: "Online",
        latestSpecialDay: "Normal",
      };

      const API_URL = process.env.BACKEND_URL;
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      // Make a POST request to save earning data
      const { data } = await axios.post(
        `${API_URL}/api/v2/newIncome`,
        earningData,
        config
      );

      console.log("Earning Data Saved:", data);
      return res.json({ status: "success", message: "Payment processed" });
    }

    res.status(400).json({ error: "Unhandled payment status" });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
