const catchAsyncError = require("../middleware/catchAsyncError");
const moment = require("moment-timezone");

exports.OnlinePaymentFlow = catchAsyncError(async (req, res) => {
  try {
    const { entity } = req.body.payload.payment;
    const { amount, status, email, contact } = entity;
    const razorpayMerchantId = entity.notes.merchant_id; // Ensure merchants provide this in their notes

    if (!razorpayMerchantId) {
      return res.status(400).json({ error: "Missing merchant ID" });
    }

    // // Find the shopkeeper using merchant ID
    // const user = await User.findOne({ razorpayMerchantId });

    // if (!user) {
    //     return res.status(404).json({ error: 'Shopkeeper not found' });
    // }

    // Process only successful payments
    if (status === "captured") {
      const earningData = {
        dailyIncome: amount / 100, // Convert from paise to INR
        earningType: "Online",
        latestSpecialDay: "Normal",
        // shopkeeperEmail: email, // Keep track of customer emails
      };

      // Send earningData to your backend API
      const API_URL = process.env.BACKEND_URL;
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      // Make a POST request to the backend API
      const { data } = await axios.post(
        `${API_URL}/api/v2/newIncome`, // The backend API endpoint
        earningData,
        config
      );

      console.log("Response from /newIncome API:", data);
      console.log("After saving================");
      console.log("Earning Data for Shopkeeper:", user.email, earningData);

      // Save to DB or push to frontend via WebSocket
      return res.json({ status: "success", message: "Payment processed" });
    }

    res.status(400).json({ error: "Unhandled event type" });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
   return res.json({ status: 'success', message: 'Payment processed' });
   
});
