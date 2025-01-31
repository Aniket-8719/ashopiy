const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const investmentModel = require("../models/investmentModel");
const FullDayIncome = require("../models/fullDayRevenue");
const moment = require("moment-timezone");

// Add daily income controller
exports.addInvestmentIncome = catchAsyncError(async (req, res, next) => {
  const { investmentIncomeByUser, typeOfInvestmentByUser, customDate } =
    req.body;

  // Check if dailyIncome is valid
  if (!investmentIncomeByUser || isNaN(investmentIncomeByUser) || investmentIncomeByUser<=0) {
    return res
      .status(400)
      .json({ message: "Please provide a valid Investment Income" });
  }
  

  // Use the custom date if provided, otherwise use the current date and time in Asia/Kolkata timezone
  let indiaDate;
   // Handle custom date or fallback to current date/time
   if (customDate) {
    indiaDate = moment(customDate, "YYYY-MM-DD", true).tz("Asia/Kolkata");
    if (!indiaDate.isValid()) {
      return res.status(400).json({ message: "Please provide a valid custom date" });
    }
  } else {
    indiaDate = moment().tz("Asia/Kolkata");
  }

  // Get the current time in the Asia/Kolkata timezone
  const currentTimingOFindia = moment.tz("Asia/Kolkata");

  // Adjust to UTC by adding 5 hours and 30 minutes
  const utcDateTime = indiaDate.clone().add(5, "hours").add(30, "minutes");

  // Format the current time
  const indiaTime = currentTimingOFindia.format("hh:mm A"); // Format as 12-hour with AM/PM

  // Format the day
  const dayOfWeek = indiaDate.format("dddd"); // Full day name

  // Format the date for storage
  const formattedDate = utcDateTime.toDate(); // Convert moment object to JavaScript Date

  // Create a new income entry
  const newInvestmentEntry = new investmentModel({
    investmentIncome: Number(investmentIncomeByUser), // Ensure it's stored as a number
    time: indiaTime,
    day: dayOfWeek,
    date: formattedDate,
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
    const startDate = new Date(investment.date); // Convert to Date object

    // Subtract 5 hours and 30 minutes
    const adjustedStartDate = new Date(startDate.getTime() - (5 * 60 + 30) * 60 * 1000);
  
    // Determine the end date: use the next investment's date or the current date
    const endDate = investments[i + 1] ? new Date(investments[i + 1].date) : new Date();

     // Subtract 5 hours and 30 minutes
    const adjustedEndDate = new Date(endDate.getTime() - (5 * 60 + 30) * 60 * 1000);
  

    // Calculate earnings from `FullDayIncome` between startDate and endDate
    const earnings = await FullDayIncome.aggregate([
      {
        $match: { 
          user: req.user._id,
          date: {
            $gte: adjustedStartDate,
            $lt: adjustedEndDate,
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

  const { investmentIncomeByUser, typeOfInvestmentByUser, customDate } = req.body;

  // Validate investmentIncomeByUser
  if (!investmentIncomeByUser || isNaN(investmentIncomeByUser) || investmentIncomeByUser <= 0) {
    return res.status(400).json({ message: "Please provide a valid Investment Income" });
  }

  let indiaDate;
  // Handle custom date or fallback to current date/time
  if (customDate) {
    indiaDate = moment(customDate, "YYYY-MM-DD", true).tz("Asia/Kolkata");
    if (!indiaDate.isValid()) {
      return res.status(400).json({ message: "Please provide a valid custom date" });
    }
  } else {
    indiaDate = moment().tz("Asia/Kolkata");
  }

  // Get the current time in the Asia/Kolkata timezone
  const currentTimingOFindia = moment.tz("Asia/Kolkata"); 

  // Adjust to UTC by adding 5 hours and 30 minutes
  const utcDateTime = indiaDate.clone().add(5, "hours").add(30, "minutes");

  // Format the current time
  const indiaTime = currentTimingOFindia.format("hh:mm A"); // Format as 12-hour with AM/PM

  // Format the day
  const dayOfWeek = indiaDate.format("dddd"); // Full day name

  // Format the date for storage
  const formattedDate = utcDateTime.toDate(); // Convert moment object to JavaScript Date

  // Update the investment fields
  invest.investmentIncome = Number(investmentIncomeByUser); // Ensure it's stored as a number
  invest.typeOfInvestment = typeOfInvestmentByUser || "Cash";
  invest.time = indiaTime;
  invest.date = formattedDate;
  invest.day = dayOfWeek;

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

// Yearly Income Aggregation (Indian Time)
exports.getYearlyInvestments = catchAsyncError(async (req, res, next) => {
  // Aggregate yearly income while adjusting for timezone (IST) from FullDayIncome


  const yearlyIncome = await FullDayIncome.aggregate([
    {
      $match: {
        user: req.user._id, // Filter by the logged-in user's ID
      },
    },
    {
      $group: {
        _id: { $year: { date: "$date", timezone: "Asia/Kolkata" } }, // Group by year in IST
        totalIncome: { $sum: "$totalIncome" }, // Sum income for the entire year
      },
    },
    { $sort: { _id: 1 } }, // Sort by year
  ]);

  const yearlyInvestments = await investmentModel.aggregate([
    {
      $match: {
        user: req.user._id, // Filter by the logged-in user's ID
      },
    },
    {
      $group: {
        _id: { $year: { date: "$date", timezone: "Asia/Kolkata" } }, // Group by year in IST
        totalInvestment: { $sum: "$investmentIncome" }, // Sum income for the entire year
      },
    },
    { $sort: { _id: 1 } }, // Sort by year
  ]);

   // Format the result to make it more readable
   const formattedYearlyIncome = yearlyIncome.map((item) => ({
    year: item._id, // The year from the grouped result
    totalIncome: item.totalIncome, // The total income for that year
  }));

  // Format the result to make it more readable
  const formattedYearlyInvestments = yearlyInvestments.map((item) => ({
    year: item._id, // The year from the grouped result
    totalInvestment: item.totalInvestment, // The total income for that year
  }));

  // Return the response
  res.status(200).json({
    success: true,
    yearlyIncome: formattedYearlyIncome,
    yearlyInvestments: formattedYearlyInvestments,
  });
});
