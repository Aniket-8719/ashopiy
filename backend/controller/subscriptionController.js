const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
const Payment = require("../models/paymentModel");
const moment = require("moment");

// config file
dotenv.config({ path: "../config/config.env" });

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

exports.createRazorpayOrder = catchAsyncError(async (req, res, next) => {
  const { planName } = req.body; // Get planName from request body
  const userId = req.user._id;
  if (!planName) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid plan name" });
  }
  // Save planName in the user document
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  user.planName = planName;
  await user.save();

  const options = {
    amount: Number(req.body.amount * 100), // Amount in the smallest currency unit (e.g., paise for INR)
    currency: "INR", // Change based on your currency
    receipt: crypto.randomBytes(10).toString("hex"),
    payment_capture: 1,
  };

  const order = await instance.orders.create(options);
  // Save order details in Payment model with 'pending' status
  const payment = await Payment.create({
    userId,
    planName,
    razorpayOrderId: order.id,
    amount: req.body.amount,
    status: "pending",
    createdAt: moment().utc().add(5, "hours").add(30, "minutes"),
  });

  // console.log(order);
  res.status(200).json({
    success: true,
    order,
    payment,
  });
});

// const updateSubscription = async (user) => {
//   const currentDate = moment(); // Current date using moment
//   console.log(currentDate.toDate());
//   const planName = user.planName;

//   if (!planName) throw new Error("No plan name found in user document");

//   const durationInMonths = planName.toLowerCase() === "basic" ? 1 : 12; // Basic = 1 month, Premium = 12 months
//   const subscription = user.subscription[planName.toLowerCase()];

//   if (!subscription) throw new Error("Invalid subscription plan name");

//   if (
//     subscription.isActive &&
//     subscription.endDate &&
//     moment(subscription.endDate).isAfter(currentDate)
//   ) {
//     // Extend the subscription if active
//     subscription.endDate = moment(subscription.endDate)
//       .add(durationInMonths, "months")
//       .toDate();
//   } else {
//     // Start a new subscription
//     subscription.startDate = currentDate.toDate();
//     subscription.endDate = currentDate
//       .clone()
//       .add(durationInMonths, "months")
//       .toDate();
//     subscription.isActive = true;
//   }

//   // Reset plan name after updating subscription
//   user.planName = null;

//   // Save the user document
//   await user.save();
// };

const updateSubscription = async (user) => {
  const currentDate = moment(); // Current date using moment
  console.log("Current Date:", currentDate.toDate());
  const planName = user.planName;

  if (!planName) throw new Error("No plan name found in user document");

  const durationInMonths = planName.toLowerCase() === "basic" ? 28 : 365; // Basic = 1 month, Premium = 12 months
  const subscription = user.subscription[planName.toLowerCase()];

  if (!subscription) throw new Error("Invalid subscription plan name");

  // Retrieve both subscriptions for cross-checking
  const basicSubscription = user.subscription.basic;
  const premiumSubscription = user.subscription.premium;

  // Helper to calculate the start date for a new subscription
  const calculateStartDate = (otherEndDate) => {
    const otherPlanEndDate = moment(otherEndDate);
    return otherPlanEndDate.isAfter(currentDate)
      ? otherPlanEndDate
      : currentDate;
  };

  if (planName.toLowerCase() === "basic") {
    // If Basic Plan is chosen
    if (
      premiumSubscription?.isActive &&
      premiumSubscription?.endDate &&
      !subscription.isActive
    ) {
      // Start Basic after Premium ends
      subscription.isActive = true;
      subscription.startDate = moment(premiumSubscription.endDate).toDate(); // Ensure the start date is a moment object
      subscription.endDate = moment(subscription.startDate)
        .add(durationInMonths, "days")
        .toDate(); // Wrap in moment
    } else if (subscription.isActive && subscription.endDate) {
      // Extend the Basic plan
      subscription.endDate = moment(subscription.endDate)
        .add(durationInMonths, "days")
        .toDate(); // Wrap in moment
    } else {
      // Get the current UTC time
      const currentUTC = moment.utc();

      // Add 5 hours and 30 minutes to convert to IST
      const indiaDateTimeManual = currentUTC
        .clone()
        .add(5, "hours")
        .add(30, "minutes");
      // New Premium plan
      subscription.startDate = indiaDateTimeManual.toDate();
      subscription.endDate = moment(indiaDateTimeManual)
        .add(durationInMonths, "days")
        .toDate(); // Wrap in moment
      subscription.isActive = true;

      console.log("start subscription: ", indiaDateTimeManual.toDate());
      console.log("end subscription: ", subscription.endDate);
    }
  } else if (planName.toLowerCase() === "premium") {
    // If Premium Plan is chosen
    if (
      basicSubscription?.isActive &&
      basicSubscription?.endDate &&
      !subscription.isActive
    ) {
      // Start Premium after Basic ends
      subscription.isActive = true;
      subscription.startDate = moment(basicSubscription.endDate).toDate(); // Ensure the start date is a moment object
      subscription.endDate = moment(subscription.startDate)
        .add(durationInMonths, "days")
        .toDate(); // Wrap in moment
    } else if (subscription.isActive && subscription.endDate) {
      // Extend the Premium plan
      subscription.endDate = moment(subscription.endDate)
        .add(durationInMonths, "days")
        .toDate(); // Wrap in moment
    } else {
      // Get the current UTC time
      const currentUTC = moment.utc();

      // Add 5 hours and 30 minutes to convert to IST
      const indiaDateTimeManual = currentUTC
        .clone()
        .add(5, "hours")
        .add(30, "minutes");

      // New Premium plan
      subscription.startDate = indiaDateTimeManual.toDate();
      subscription.endDate = moment(indiaDateTimeManual)
        .add(durationInMonths, "days")
        .toDate(); // Wrap in moment
      subscription.isActive = true;

      console.log("start subscription: ", indiaDateTimeManual.toDate());
      console.log("end subscription: ", subscription.endDate);
    }
  }

  // Reset plan name after updating subscription
  user.planName = null;

  // Save the updated user document
  await user.save();
};

exports.paymentSuccess = catchAsyncError(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  // Verify payment authenticity
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "completed",
        createdAt: moment().utc().add(5, "hours").add(30, "minutes"),
      },
      { new: true }
    );

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment record not found" });
    }
    // Delete all pending payments for the same user
    await Payment.deleteMany({
      userId: payment.userId, // Assuming payments are associated with a user
      status: "pending", // Condition to match pending payments
    });
    // Update user subscription
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await updateSubscription(user);

    // Send success email to the user
    const emailOptions = {
      email: user.email,
      subject: "Subscription Activated Successfully",
      message: `Hi ${user.shopOwnerName},\n\nYour subscription has been activated successfully. Thank you for choosing Ashopiy!`,
      htmlMessage: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #4CAF50;">Subscription Activated!</h2>
          <p>Dear ${user.shopOwnerName},</p>
          <p>We are thrilled to inform you that your subscription has been successfully activated.</p>
          <table style="width: 100%; margin-top: 20px; border-collapse: collapse; text-align: left;">
            <tr>
              <th style="border-bottom: 1px solid #ddd; padding: 8px;">Subscription Plan</th>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">${
                payment.planName
              }</td>
            </tr>
            <tr>
              <th style="border-bottom: 1px solid #ddd; padding: 8px;">Amount Paid</th>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">₹${
                payment.amount
              }</td>
            </tr>
            <tr>
              <th style="border-bottom: 1px solid #ddd; padding: 8px;">Payment ID</th>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">${razorpay_payment_id}</td>
            </tr>
            <tr>
              <th style="border-bottom: 1px solid #ddd; padding: 8px;">Payment Date</th>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">${moment(
                payment.createdAt
              ).format("DD/MM/YYYY")}</td>
            </tr>
          </table>
          <p style="margin-top: 20px;">If you have any questions or need support, feel free to reach out to our team at <a href="mailto:info.ashopiy@gmail.com">info.ashopiy@gmail.com</a>.</p>
          <p style="margin-top: 20px;">Thank you for choosing Ashopiy!</p>
          <p style="margin-top: 20px;">Best regards,<br>The Ashopiy Team</p>
        </div>
      `,
    };

    await sendEmail(emailOptions);

    // Redirect to frontend with success reference
    res.redirect(
      `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    // Handle failed payment
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { status: "failed" },
      { createdAt: moment().utc().add(5, "hours").add(30, "minutes") }
    );

    res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  }
});

const sendSubscriptionEmail = async ({
  user,
  subscriptionType,
  state,
  endDate,
}) => {
  const emailSubject =
    state === "expiring"
      ? `Your ${subscriptionType} Subscription is About to Expire!`
      : `Your ${subscriptionType} Subscription Has Expired`;

  const formattedDate = moment(endDate)
    .tz("Asia/Kolkata")
    .format("DD MMM YYYY");

  const emailMessage =
    state === "expiring"
      ? `Dear ${user.shopOwnerName}, your ${subscriptionType} subscription will expire on ${formattedDate}. Please renew it to continue enjoying our services.`
      : `Dear ${user.shopOwnerName}, your ${subscriptionType} subscription expired on ${formattedDate}. Please renew it to regain access to our services.`;

  const htmlMessage = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .email-header {
            background-color: #007bff;
            color: #ffffff;
            text-align: center;
            padding: 20px;
          }
          .email-header h1 {
            margin: 0;
            font-size: 24px;
          }
          .email-body {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
          }
          .email-body p {
            margin: 0 0 15px;
          }
          .email-body strong {
            color: #007bff;
          }
          .email-footer {
            text-align: center;
            background-color: #f4f4f4;
            padding: 15px;
            font-size: 12px;
            color: #888888;
          }
          .email-button {
            display: inline-block;
            margin-top: 15px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
          }
          .email-button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>${
              state === "expiring"
                ? "Subscription Notice"
                : "Subscription Expired"
            }</h1>
          </div>
          <div class="email-body">
            <p>Dear <strong>${user.shopOwnerName}</strong>,</p>
            <p>
              ${
                state === "expiring"
                  ? `Your <strong>${subscriptionType}</strong> subscription will expire on <strong>${formattedDate}</strong>. Please renew it to continue enjoying our services.`
                  : `We would like to inform you that your <strong>${subscriptionType}</strong> subscription expired on <strong>${formattedDate}</strong>.<br> To continue enjoying uninterrupted access to our services, we kindly request you to renew your subscription at your earliest convenience.<br><br> Thank you for choosing us, and we look forward to serving you again.<br><br> Best regards.`
              }
            </p>
            <a href="${
              process.env.FRONTEND_URL
            }/pricing" class="email-button">Renew Subscription</a>
          </div>
          <div class="email-footer">
            <p>
              Thank you for choosing our services. If you have any questions, feel free to contact us at
              <a href="mailto:info.ashopiy@gmail.com">info.ashopiy@gmail.com</a>.
            </p>
            <p>&copy; ${new Date().getFullYear()} Ashopiy. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
      `;

  await sendEmail({
    email: user.email,
    subject: emailSubject,
    message: emailMessage,
    htmlMessage,
  });
};

exports.checkExpiringSubscriptions = catchAsyncError(async (req, res, next) => {
  const currentDate = moment().utc().add(5, "hours").add(30, "minutes");
  const threeDaysAhead = moment(currentDate).add(3, "days");

  console.log("start date:", currentDate.toDate());
  console.log("three Days: ", threeDaysAhead.toDate());

  // Find all users with active subscriptions
  const expiringUsers = await User.find({
    $or: [
      { "subscription.basic.isActive": true },
      { "subscription.premium.isActive": true },
    ],
  });

  for (const user of expiringUsers) {
    try {
      // Check for basic subscription expiration
      if (
        user.subscription.basic.isActive &&
        moment(user.subscription.basic.endDate).isBetween(
          currentDate,
          threeDaysAhead,
          null,
          "[]"
        )
      ) {
        await sendSubscriptionEmail({
          user,
          subscriptionType: "Basic",
          state: "expiring",
          endDate: user.subscription.basic.endDate,
        });
      }

      // Check for premium subscription expiration
      if (
        user.subscription.premium.isActive &&
        moment(user.subscription.premium.endDate).isBetween(
          currentDate,
          threeDaysAhead,
          null,
          "[]"
        )
      ) {
        await sendSubscriptionEmail({
          user,
          subscriptionType: "Premium",
          state: "expiring",
          endDate: user.subscription.premium.endDate,
        });
      }
    } catch (err) {
      console.error(`Failed to process user ${user.email}:`, err);
    }
  }
});

exports.checkExpiredSubscriptions = catchAsyncError(async (req, res, next) => {
  const currentDate = moment().utc().add(5, "hours").add(30, "minutes");
 

  const expiredUsers = await User.find({
    $or: [
      {
        "subscription.basic.isActive": true,
        "subscription.basic.endDate": { $lt: currentDate.toDate() },
      },
      {
        "subscription.premium.isActive": true,
        "subscription.premium.endDate": { $lt: currentDate.toDate() },
      },
    ],
  });

  for (const user of expiredUsers) {
    try {
      let isUpdated = false;

      if (
        user.subscription.basic.isActive &&
        moment(user.subscription.basic.endDate).isBefore(currentDate)
      ) {
        const endDate = user.subscription.basic.endDate; // Save the original end date
        user.subscription.basic.isActive = false;
        user.subscription.basic.startDate = null;
        user.subscription.basic.endDate = null;
        isUpdated = true;
        await sendSubscriptionEmail({
          user,
          subscriptionType: "Basic",
          state: "expired",
          endDate,
        });
      }

      if (
        user.subscription.premium.isActive &&
        moment(user.subscription.premium.endDate).isBefore(currentDate)
      ) {
        const endDate = user.subscription.premium.endDate; // Save the original end date
        user.subscription.premium.isActive = false;
        user.subscription.premium.startDate = null;
        user.subscription.premium.endDate = null;
        isUpdated = true;
        await sendSubscriptionEmail({
          user,
          subscriptionType: "Premium",
          state: "expired",
          endDate,
        });
      }

      if (isUpdated) await user.save();
      console.log("expired wala Time:", currentDate.toDate());
    } catch (err) {
      console.error(
        `Failed to process expired subscription for user ${user.email}:`,
        err
      );
    }
  }
});

// Get Payment History Controller
exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from authenticated request (e.g., req.user is populated via middleware)

    // Fetch payment history for the authenticated user
    const payments = await Payment.find({ userId }).sort({ createdAt: -1 });

    // If no payments are found
    if (!payments.length) {
      return res.status(404).json({ message: "No payment history found." });
    }

    // Return payment data
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// exports.checkExpiringSubscriptions = catchAsyncError(async (req, res, next) => {
//   await checkExpiringSubscriptionsLogic();
//   res.status(200).json({
//     success: true,
//     message: "Expiring subscription notifications sent successfully",
//   });
// });

// exports.checkExpiredSubscriptions = catchAsyncError(async (req, res, next) => {
//   await checkExpiredSubscriptionsLogic();
//   res.status(200).json({
//     success: true,
//     message: "Expired subscription notifications sent successfully",
//   });
// });

// exports.checkExpiringSubscriptions = catchAsyncError(async (req, res, next) => {
//   const currentDate = moment();
//   const threeDaysAhead = moment().add(3, "days");

//   // Find users with expiring subscriptions in both basic and premium plans
//   const expiringUsers = await User.find({
//     $or: [
//       {
//         "subscription.basic.isActive": true,
//         "subscription.basic.endDate": {
//           $gte: currentDate.toDate(),
//           $lte: threeDaysAhead.toDate(),
//         },
//       },
//       {
//         "subscription.premium.isActive": true,
//         "subscription.premium.endDate": {
//           $gte: currentDate.toDate(),
//           $lte: threeDaysAhead.toDate(),
//         },
//       },
//     ],
//   });

//   for (const user of expiringUsers) {
//     // Notify for basic subscription
//     if (
//       user.subscription.basic.isActive &&
//       moment(user.subscription.basic.endDate).isBetween(
//         currentDate,
//         threeDaysAhead,
//         null,
//         "[]"
//       )
//     ) {
//       await sendEmail({
//         email: user.email,
//         subject: "Your Basic Subscription is About to Expire!",
//         message: `Dear ${
//           user.shopOwnerName
//         }, your Basic subscription will expire on ${moment(
//           user.subscription.basic.endDate
//         )
//           .tz("Asia/Kolkata")
//           .format(
//             "DD MMM YYYY"
//           )}. Please renew it to continue enjoying our services.`,
//         htmlMessage: `<p>Dear ${user.shopOwnerName},</p>
//                             <p>Your Basic subscription will expire on <strong>${moment(
//                               user.subscription.basic.endDate
//                             )
//                               .tz("Asia/Kolkata")
//                               .format(
//                                 "DD MMM YYYY"
//                               )}</strong>. Please renew it to continue enjoying our services.</p>
//                             <a href="${process.env.FRONTEND_URL}/pricing"}>Renew Subscription</a>`,
//       });
//     }

//     // Notify for premium subscription
//     if (
//       user.subscription.premium.isActive &&
//       moment(user.subscription.premium.endDate).isBetween(
//         currentDate,
//         threeDaysAhead,
//         null,
//         "[]"
//       )
//     ) {
//       await sendEmail({
//         email: user.email,
//         subject: "Your Premium Subscription is About to Expire!",
//         message: `Dear ${
//           user.shopOwnerName
//         }, your Premium subscription will expire on ${moment(
//           user.subscription.premium.endDate
//         )
//           .tz("Asia/Kolkata")
//           .format(
//             "DD MMM YYYY"
//           )}. Please renew it to continue enjoying premium features.`,
//         htmlMessage: `<p>Dear ${user.shopOwnerName},</p>
//                             <p>Your Premium subscription will expire on <strong>${moment(
//                               user.subscription.premium.endDate
//                             )
//                               .tz("Asia/Kolkata")
//                               .format(
//                                 "DD MMM YYYY"
//                               )}</strong>. Please renew it to continue enjoying premium features.</p>
//                             <a href="${process.env.FRONTEND_URL}/pricing"}>Renew Subscription</a>`,
//       });
//     }
//   }
// });

// exports.checkExpiredSubscriptions = catchAsyncError(async (req, res, next) => {
//   const currentDate = moment();

//   // Find users with expired subscriptions
//   const expiredUsers = await User.find({
//     $or: [
//       {
//         "subscription.basic.isActive": true,
//         "subscription.basic.endDate": { $lt: currentDate.toDate() },
//       },
//       {
//         "subscription.premium.isActive": true,
//         "subscription.premium.endDate": { $lt: currentDate.toDate() },
//       },
//     ],
//   });

//   for (const user of expiredUsers) {
//     // Mark basic subscription as inactive
//     if (
//       user.subscription.basic.endDate &&
//       moment(user.subscription.basic.endDate).isBefore(currentDate)
//     ) {
//       user.subscription.basic.isActive = false;
//       await sendEmail({
//         email: user.email,
//         subject: "Your Basic Subscription Has Expired",
//         message: `Dear ${
//           user.shopOwnerName
//         }, your Basic subscription expired on ${moment(
//           user.subscription.basic.endDate
//         ).format(
//           "DD MMM YYYY"
//         )}. Please renew it to regain access to our services.`,
//         htmlMessage: `<p>Dear ${user.shopOwnerName},</p>
//                           <p>Your Basic subscription expired on <strong>${moment(
//                             user.subscription.basic.endDate
//                           ).format(
//                             "DD MMM YYYY"
//                           )}</strong>. Please renew it to regain access to our services.</p>
//                          <a href="${process.env.FRONTEND_URL}/pricing"}>Renew Subscription</a>`,
//       });
//     }

//     // Mark premium subscription as inactive
//     if (
//       user.subscription.premium.endDate &&
//       moment(user.subscription.premium.endDate).isBefore(currentDate)
//     ) {
//       user.subscription.premium.isActive = false;
//       await sendEmail({
//         email: user.email,
//         subject: "Your Premium Subscription Has Expired",
//         message: `Dear ${
//           user.shopOwnerName
//         }, your Premium subscription expired on ${moment(
//           user.subscription.premium.endDate
//         ).format(
//           "DD MMM YYYY"
//         )}. Please renew it to regain access to premium features.`,
//         htmlMessage: `<p>Dear ${user.shopOwnerName},</p>
//                           <p>Your Premium subscription expired on <strong>${moment(
//                             user.subscription.premium.endDate
//                           ).format(
//                             "DD MMM YYYY"
//                           )}</strong>. Please renew it to regain access to premium features.</p>
//                          <a href="${process.env.FRONTEND_URL}/pricing"}>Renew Subscription</a>`,
//       });
//     }
//     await user.save();
//   }
// });
