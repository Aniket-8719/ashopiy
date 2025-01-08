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
  const { planName, userId } = req.body; // Get planName from request body
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

  // console.log(order);
  res.status(200).json({
    success: true,
    order,
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

  const durationInMonths = planName.toLowerCase() === "basic" ? 1 : 365;// Basic = 1 month, Premium = 12 months
  const subscription = user.subscription[planName.toLowerCase()];

  if (!subscription) throw new Error("Invalid subscription plan name");

  // Retrieve both subscriptions for cross-checking
  const basicSubscription = user.subscription.basic;
  const premiumSubscription = user.subscription.premium;

  // Helper to calculate the start date for a new subscription
  const calculateStartDate = (otherEndDate) => {
    const otherPlanEndDate = moment(otherEndDate);
    return otherPlanEndDate.isAfter(currentDate) ? otherPlanEndDate : currentDate;
  };

  if (planName.toLowerCase() === "basic") {
    // If Basic Plan is chosen
    if (premiumSubscription?.isActive && premiumSubscription?.endDate) {
      // Start Basic after Premium ends
      subscription.startDate = calculateStartDate(premiumSubscription.endDate).toDate();
    } else if (subscription.isActive && subscription.endDate) {
      // Extend the Basic plan
      subscription.endDate = moment(subscription.endDate)
        .add(durationInMonths, "days")
        .toDate();
    } else {
      // New Basic plan
      subscription.startDate = currentDate.toDate();
      subscription.endDate = currentDate.clone().add(durationInMonths, "days").toDate();
      subscription.isActive = true;
    }
  } else if (planName.toLowerCase() === "premium") {
    // If Premium Plan is chosen
    if (basicSubscription?.isActive && basicSubscription?.endDate) {
      // Start Premium after Basic ends
      subscription.startDate = calculateStartDate(basicSubscription.endDate).toDate();
    } else if (subscription.isActive && subscription.endDate) {
      // Extend the Premium plan
      subscription.endDate = moment(subscription.endDate)
        .add(durationInMonths, "days")
        .toDate();
    } else {
      // New Premium plan
      subscription.startDate = currentDate.toDate();
      subscription.endDate = currentDate.clone().add(durationInMonths, "days").toDate();
      subscription.isActive = true;
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
    // 1. Update the payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        userId: req.user._id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "completed",
      },
      { new: true, upsert: true }
    );

    if (!payment) {
      return res.status(500).json({
        success: false,
        message: "Failed to create or update payment record",
      });
    }

    // 3. Update the user subscription
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await updateSubscription(user);

    // 4. Redirect to frontend with success reference
    res.redirect(
      `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    // Handle failed payment
    res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  }
});



const sendSubscriptionEmail = async ({ user, subscriptionType, state, endDate }) => {
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

  const htmlMessage =
    state === "expiring"
      ? `<p>Dear ${user.shopOwnerName},</p>
          <p>Your ${subscriptionType} subscription will expire on <strong>${formattedDate}</strong>. Please renew it to continue enjoying our services.</p>
          <a href="${process.env.FRONTEND_URL}/pricing">Renew Subscription</a>`
      : `<p>Dear ${user.shopOwnerName},</p>
          <p>Your ${subscriptionType} subscription expired on <strong>${formattedDate}</strong>. Please renew it to regain access to our services.</p>
          <a href="${process.env.FRONTEND_URL}/pricing">Renew Subscription</a>`;

  await sendEmail({
    email: user.email,
    subject: emailSubject,
    message: emailMessage,
    htmlMessage,
  });
};

exports.checkExpiringSubscriptions = catchAsyncError(async (req, res, next) => {
  const currentDate = moment();
  const threeDaysAhead = moment().add(3, "days");

  const expiringUsers = await User.find({
    $or: [
      {
        "subscription.basic.isActive": true,
        "subscription.basic.endDate": {
          $gte: currentDate.toDate(),
          $lte: threeDaysAhead.toDate(),
        },
      },
      {
        "subscription.premium.isActive": true,
        "subscription.premium.endDate": {
          $gte: currentDate.toDate(),
          $lte: threeDaysAhead.toDate(),
        },
      },
    ],
  });

  for (const user of expiringUsers) {
    try {
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
      console.error(`Failed to send email for user ${user.email}:`, err);
    }
  }
});

exports.checkExpiredSubscriptions = catchAsyncError(async (req, res, next) => {
  const currentDate = moment();

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
    } catch (err) {
      console.error(`Failed to process expired subscription for user ${user.email}:`, err);
    }
  }
});








































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
