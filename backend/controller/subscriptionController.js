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
  const checkRole = req.user;
  if (checkRole?.role === "worker") {
    return res.status(401).json({ message: "You cannot buy as a worker." });
  }
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
  // Save order details in Payment model with 'unpaid' status
  const payment = await Payment.create({
    userId,
    planName,
    razorpayOrderId: order.id,
    amount: req.body.amount,
    status: "unpaid",
    createdAt: moment().utc().add(5, "hours").add(30, "minutes"),
  });

  res.status(200).json({
    success: true,
    order,
    payment,
  });
});

const updateSubscription = async (user) => {
  if (user.role === "worker") {
    return res
      .status(401)
      .json({ message: "You cannot update subscription as a worker." });
  }
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
    // Delete all unpaid payments for the same user
    await Payment.deleteMany({
      userId: payment.userId, // Assuming payments are associated with a user
      status: "unpaid", // Condition to match unpaid payments
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
      message: `Hi ${user.Name},\n\nYour subscription has been activated successfully. Thank you for choosing ashopiy!`,
      htmlMessage: `
      <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f1f5f9;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <tr>
            <td style="padding: 0; background: linear-gradient(to right, #4f46e5, #9333ea);">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td style="padding: 24px 32px; text-align: center;">
                            <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">ashopiy</h1>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
            <td style="padding: 32px;">
                <h2 style="color: #4f46e5; margin-top: 0;">Subscription Activated Successfully!</h2>
                <p>Dear ${user.Name},</p>
                <p>We are thrilled to inform you that your subscription has been successfully activated. Thank you for choosing ashopiy!</p>
                
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0; background-color: #f8fafc; border-radius: 8px; padding: 16px;">
                    <tr>
                        <td colspan="2">
                            <h3 style="color: #4f46e5; margin-top: 0;">Subscription Details</h3>
                        </td>
                    </tr>
                    <tr>
                        <td width="40%" style="padding: 8px 0; color: #64748b; font-weight: bold;">Subscription Plan</td>
                        <td style="padding: 8px 0;">${payment.planName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Amount Paid</td>
                        <td style="padding: 8px 0;">₹${payment.amount}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Payment ID</td>
                        <td style="padding: 8px 0;">${razorpay_payment_id}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Payment Date</td>
                        <td style="padding: 8px 0;">${moment(
                          payment.createdAt
                        ).format("DD/MM/YYYY")}</td>
                    </tr>
                </table>
                
                <div style="text-align: center; margin: 28px 0;">
    <a href="${process.env.FRONTEND_URL}/paymentHistory" 
       style="display: inline-flex; 
              align-items: center;
              justify-content: center;
              background: linear-gradient(to right, #4f46e5, #9333ea); 
              color: white; 
              padding: 14px 28px 14px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 8px rgba(79, 70, 229, 0.25);
              gap: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16L12 4M12 16L8 12M12 16L16 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 20H20" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Download Invoice
    </a>
</div>
                <p>If you have any questions or need support, feel free to reach out to our team at <a href="mailto:info.ashopiy@gmail.com" style="color: #4f46e5;">info.ashopiy@gmail.com</a>.</p>
                
                <p>Best regards,<br>The ashopiy Team</p>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; text-align: center; color: #64748b; font-size: 14px;">
               <p style="margin: 0 0 16px 0;">© ${new Date().getFullYear()} ashopiy. All rights reserved.</p>
                <p style="margin: 0 0 8px 0;"><a href="${
                  process.env.FRONTEND_URL
                }/privacy-policy" style="color: #4f46e5; text-decoration: none;">Privacy Policy</a> | <a href="${
        process.env.FRONTEND_URL
      }/terms-conditions" style="color: #4f46e5; text-decoration: none;">Terms of Service</a></p>
                <p style="margin: 0;">You're receiving this email because you have an account with ashopiy.</p>
            </td>
        </tr>
    </table>
</body>
</html>
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
      ? `Dear ${user.Name}, your ${subscriptionType} subscription will expire on ${formattedDate}. Please renew it to continue enjoying our services.`
      : `Dear ${user.Name}, your ${subscriptionType} subscription expired on ${formattedDate}. Please renew it to regain access to our services.`;

  const htmlMessage = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
        ${state === "expiring" ? "Subscription Notice" : "Subscription Expired"}
      </h1>
      <div style="margin-top: 15px;">
        <div style="background-color: ${
          state === "expiring" ? "#f59e0b" : "#dc2626"
        }; color: #ffffff; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 14px; font-weight: 600;">
          ${state === "expiring" ? "Expiring Soon" : "Expired"}
        </div>
      </div>
    </div>

    <!-- Body -->
    <div style="padding: 35px 30px;">
      <!-- Greeting -->
      <div style="margin-bottom: 25px;">
        <p style="color: #374151; margin: 0 0 8px 0; font-size: 16px;">Dear</p>
        <h2 style="color: #6366f1; margin: 0; font-size: 20px; font-weight: 700;">${
          user.Name
        }</h2>
      </div>

      <!-- Message -->
      <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
        <p style="color: #4b5563; margin: 0; font-size: 15px; line-height: 1.6;">
          ${
            state === "expiring"
              ? `Your <strong style="color: #6366f1;">${subscriptionType}</strong> subscription will expire on <strong style="color: #dc2626;">${formattedDate}</strong>. Please renew it to continue enjoying our services without interruption.`
              : `We would like to inform you that your <strong style="color: #6366f1;">${subscriptionType}</strong> subscription expired on <strong style="color: #dc2626;">${formattedDate}</strong>.<br><br>To continue enjoying uninterrupted access to our services, we kindly request you to renew your subscription at your earliest convenience.`
          }
        </p>
      </div>

      <!-- Subscription Details -->
      <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e0f2fe;">
          <span style="color: #0369a1; font-weight: 600;">Subscription Type:</span>
          <span style="color: #6366f1; font-weight: 600;">${subscriptionType}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #0369a1; font-weight: 600;">Status:</span>
          <span style="color: ${
            state === "expiring" ? "#f59e0b" : "#dc2626"
          }; font-weight: 600;">
            ${state === "expiring" ? "Expiring Soon" : "Expired"}
          </span>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}/pricing" 
           style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); 
                  color: #ffffff; 
                  padding: 14px 32px; 
                  text-decoration: none; 
                  border-radius: 8px; 
                  font-weight: 600; 
                  font-size: 16px; 
                  display: inline-block; 
                  transition: all 0.3s;
                  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);">
          Renew Subscription
        </a>
        <p style="color: #6b7280; font-size: 14px; margin: 15px 0 0 0;">
          Don't lose access to your premium features
        </p>
      </div>
    </div>

    <!-- Support Section -->
    <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 25px 30px; text-align: center;">
      <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">Need Assistance?</h3>
      <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px;">
        Our support team is here to help you
      </p>
      <a href="mailto:info.ashopiy@gmail.com" 
         style="color: #6366f1; text-decoration: none; font-weight: 600; font-size: 14px;">
        info.ashopiy@gmail.com
      </a>
    </div>

    <!-- Footer -->
    <div style="background-color: #1f2937; padding: 25px 30px; text-align: center;">
      <div style="margin-bottom: 12px;">
        <span style="color: #6366f1; font-size: 18px; font-weight: 700;">ashopiy</span>
      </div>
      <p style="color: #9ca3af; margin: 0 0 8px 0; font-size: 13px;">
        Empowering businesses with smart solutions
      </p>
      <p style="color: #6b7280; margin: 0; font-size: 12px;">
        © ${new Date().getFullYear()} ashopiy. All rights reserved.
      </p>
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
    const userId = req.user._id;
    if (req.user.role === "worker") {
      return res
        .status(401)
        .json({ message: "You are not recognized by any owner." });
    }
    // Fetch payment history for the authenticated user
    const payments = await Payment.find({ userId }).sort({ createdAt: -1 });

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
//           user.Name
//         }, your Basic subscription will expire on ${moment(
//           user.subscription.basic.endDate
//         )
//           .tz("Asia/Kolkata")
//           .format(
//             "DD MMM YYYY"
//           )}. Please renew it to continue enjoying our services.`,
//         htmlMessage: `<p>Dear ${user.Name},</p>
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
//           user.Name
//         }, your Premium subscription will expire on ${moment(
//           user.subscription.premium.endDate
//         )
//           .tz("Asia/Kolkata")
//           .format(
//             "DD MMM YYYY"
//           )}. Please renew it to continue enjoying premium features.`,
//         htmlMessage: `<p>Dear ${user.Name},</p>
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
//           user.Name
//         }, your Basic subscription expired on ${moment(
//           user.subscription.basic.endDate
//         ).format(
//           "DD MMM YYYY"
//         )}. Please renew it to regain access to our services.`,
//         htmlMessage: `<p>Dear ${user.Name},</p>
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
//           user.Name
//         }, your Premium subscription expired on ${moment(
//           user.subscription.premium.endDate
//         ).format(
//           "DD MMM YYYY"
//         )}. Please renew it to regain access to premium features.`,
//         htmlMessage: `<p>Dear ${user.Name},</p>
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
