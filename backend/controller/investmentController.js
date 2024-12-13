const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const investmentModel = require("../models/investmentModel");
const FullDayIncome = require("../models/fullDayRevenue");

// Add daily income controller
exports.addInvestmentIncome = catchAsyncError(async (req, res, next) => {
  const { investmentIncomeByUser, typeOfInvestmentByUser, customDate } =
    req.body;

  // Check if dailyIncome is valid
  if (!investmentIncomeByUser || isNaN(investmentIncomeByUser)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid investment amount" });
  }

  // Check if dailyIncome is negative
  if (investmentIncomeByUser<=0) {
    return res
      .status(400)
      .json({ message: "Please provide a positive investment amount" });
  }

  // Use the custom date if provided, otherwise use the current date and time in Asia/Kolkata timezone
  let indiaDate;
  if (customDate) {
    indiaDate = new Date(customDate);
    if (isNaN(indiaDate.getTime())) {
      return res
        .status(400)
        .json({ message: "Please provide a valid custom date" });
    }
  } else {
    const indiaDateTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    indiaDate = new Date(indiaDateTime);
  }

  // Get the current time in the Asia/Kolkata timezone
  const indiaTime = new Date().toLocaleTimeString("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Create a new income entry
  const newInvestmentEntry = new investmentModel({
    investmentIncome: Number(investmentIncomeByUser), // Ensure it's stored as a number
    time: indiaTime,
    day: indiaDate.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "Asia/Kolkata",
    }), // Day of the week
    date: indiaDate, // Store the Date object
    typeOfInvestment: typeOfInvestmentByUser || "Cash",
    user: req.user._id,
  });

  // Save the entry to the database
  await newInvestmentEntry.save();

  // Respond with success
  res.status(201).json({
    success: true,
    message: "Investment saved successfully!",
  });
});

// Get Investment Income with calculated earnings from FullDayIncome
exports.getInvestmentIncome = catchAsyncError(async (req, res, next) => {
  const investments = await investmentModel.find({ user: req.user._id }).sort({ date: 1 }); // Sort by date ascending
  const result = [];

  for (let i = 0; i < investments.length; i++) {
    const investment = investments[i];
    const startDate = investment.date;

    // If there’s a next investment, use its date as the end date, otherwise use the current date
    const endDate = investments[i + 1] ? investments[i + 1].date : new Date();

    // Calculate earnings from `FullDayIncome` between startDate and endDate
    const earnings = await FullDayIncome.aggregate([
      {
        $match: {
          user: req.user._id,
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$totalIncome" }, // Sum total income from FullDayIncome
        },
      },
    ]);

    // Format the date to DD/MM/YY
    const formattedDate = new Date(investment.date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }
    );

    // Check if the `time` is already a string and doesn't need formatting
    let formattedTime;
    if (isNaN(new Date(`1970-01-01T${investment.time}`).getTime())) {
      // If `investment.time` is already a string, use it as is
      formattedTime = investment.time;
    } else {
      // Otherwise, parse and format the time as HH:MM AM/PM
      formattedTime = new Date(
        `1970-01-01T${investment.time}`
      ).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    // Add the investment and calculated earnings to the result
    result.push({
      investment: {
        ...investment.toObject(), // Convert mongoose document to plain object
        date: formattedDate, // Overwrite with formatted date
        time: formattedTime, // Overwrite with formatted time
      },
      totalEarnings: earnings[0]?.totalEarnings || 0, // Use totalEarnings from FullDayIncome
    });
  }

  res.status(200).json({
    success: true,
    investments: result,
  });
});

// Edit Single Investment
exports.updateInvestment = catchAsyncError(async (req, res, next) => {
  const invest = await investmentModel.findById(req.params.id);

  if (!invest) {
    return res.status(500).json({
      success: false,
      message: "Investment not found",
    });
  }

  const customDate = req.body.customDate;
  // Use the custom date if provided, otherwise use the current date and time in Asia/Kolkata timezone
  let indiaDate;
  if (customDate) {
    indiaDate = new Date(customDate);
    if (isNaN(indiaDate.getTime())) {
      return res
        .status(400)
        .json({ message: "Please provide a valid custom date" });
    }
  } else {
    const indiaDateTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    indiaDate = new Date(indiaDateTime);
  }

  // Get the current time in the Asia/Kolkata timezone
  const indiaTime = new Date().toLocaleTimeString("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  (invest.investmentIncome = req.body.investmentIncomeByUser),
    (invest.typeOfInvestment = req.body.typeOfInvestmentByUser),
    (invest.time = indiaTime),
    (invest.date = indiaDate),
    (invest.day = indiaDate.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "Asia/Kolkata",
    })), // Day of the week,
    // Save the updated income
    await invest.save();

  res.status(200).json({
    success: true,
    message: "Investment updated successfully",
  });
});

// Delete Single Investment
exports.deleteSingleInvestment = catchAsyncError(async (req, res, next) => {
  const investment = await investmentModel.findById(req.params.id);

  if (!investment) {
    return res.status(500).json({
      success: false,
      message: "Investment not found",
    });
  }
  await investment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Investment delete successfully",
  });
});
