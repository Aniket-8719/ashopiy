const catchAsyncError = require("../middleware/catchAsyncError");
const axios = require("axios");

exports.OnlinePaymentFlow = catchAsyncError(async (req, res) => {
  const payload = req.body;

  try {
    // Extract the Razorpay account ID from the webhook payload
    const merchantId = payload.account_id;

    // Find the shopkeeper using the merchant ID
    const shopkeeper = await User.findOne({ merchantId });

    if (!shopkeeper) {
      return res.status(404).json({ status: 'error', message: 'Merchant not found' });
    }

    // Extract payment details
    const payment = payload.payload.payment.entity;

    // Check if payment is captured
    if (payment.status === 'captured') {
      // Prepare earning data
      const earningData = {
        dailyIncome: payment.amount / 100, // Convert from paise to INR
        earningType: 'Online',
        latestSpecialDay: 'Normal',
      };

      // Save earnings via your backend API
      const API_URL = process.env.BACKEND_URL;
      const config = { headers: { 'Content-Type': 'application/json' } };

      const { data } = await axios.post(
        `${API_URL}/api/v2/newIncome`,
        earningData,
        config
      );

      console.log('Earning Data Saved:', data);

      return res.status(200).json({
        status: 'success',
        message: 'Payment processed and earnings updated',
      });
    }

    // If payment is not captured
    return res.status(200).json({
      status: 'ignored',
      message: 'Payment is not captured. No action taken.',
    });
  } catch (error) {
    console.error('Error processing webhook:', error.message);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
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