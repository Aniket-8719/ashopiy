const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const DailyIncome = require("../models/dailyRevenue");
const moment = require("moment-timezone");

// Add daily income controller
exports.addDailyIncome = catchAsyncError(async (req, res, next) => {
  const { dailyIncome, specialDay } = req.body;

  // Check if dailyIncome is valid
  if (!dailyIncome || isNaN(dailyIncome)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid daily income" });
  }

  // Get the current date and time in the Asia/Kolkata timezone using moment-timezone
  const indiaDateTime = moment.tz("Asia/Kolkata");

  // Create a new income entry
  const newIncomeEntry = new DailyIncome({
    dailyIncome: Number(dailyIncome), // Ensure it's stored as a number
    time: indiaDateTime.format("HH:mm:ss"), // Save time in 'HH:mm:ss' format
    day: indiaDateTime.format("dddd"), // Day of the week, e.g., "Monday"
    date: indiaDateTime.toDate(), // Store the Date object
    specialDay: specialDay || "Normal",
  });

  // Save the entry to the database
  await newIncomeEntry.save();

  // Respond with success
  res.status(201).json({
    success: true,
    message: "Daily income saved successfully!",
  });
});

// Get Today Income
exports.getDailyIncome = catchAsyncError(async (req, res, next) => {
  const dailyIncome = await DailyIncome.find();

  res.status(200).json({
    success: true,
    dailyIncome,
  });
});

// Edit Today income
exports.updateTodayIncome = catchAsyncError(async (req, res, next) => {
  const income = await DailyIncome.findById(req.params.id);

  if (!income) {
    return res.status(500).json({
      success: false,
      message: "Income not found",
    });
  }
  (income.dailyIncome = req.body.dailyIncome),
    (income.specialDay = req.body.specialDay),
    // Save the updated income
    await income.save();

  res.status(200).json({
    success: true,
    message: "Income updated successfully",
  });
});

// Delete Today income
exports.deleteTodayIncome = catchAsyncError(async (req, res, next) => {
  const income = await DailyIncome.findById(req.params.id);

  if (!income) {
    return res.status(500).json({
      success: false,
      message: "Income not found",
    });
  }
  await income.deleteOne();

  res.status(200).json({
    success: true,
    message: "Income delete successfully",
  });
});

// Daily Income Aggregation
exports.perDayIncome = catchAsyncError(async (req, res, next) => {
  const dailyIncome = await DailyIncome.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        totalIncome: { $sum: "$dailyIncome" },
        specialDay: { $first: "$specialDay" }, // Fetch special day if present
        customerCount: { $sum: 1 }, // Count the number of customers per day
      },
    },
    {
      $sort: { _id: 1 }, // Sort by day
    },
  ]);

  // Format the results to include date, month, day of the week, and special day information
  const formattedDailyIncome = dailyIncome.map((item) => {
    const [year, month, day] = item._id.split("-");

    // Create a date object to extract the day of the week and month
    const dateObj = new Date(`${year}-${month}-${day}`);
    const formattedDate = [day, month, year].join("/"); // Format date as DD/MM/YYYY

    // Get the day of the week (e.g., Monday, Tuesday, etc.)
    const dayOfWeek = dateObj.toLocaleString("default", { weekday: "long" });

    // Get the month name (e.g., January, February, etc.)
    const monthName = dateObj.toLocaleString("default", { month: "long" });

    // Use the special day from DB or return null if none
    const specialDay = item.specialDay || null; // No need for placeholder '-----'

    return {
      date: formattedDate,
      month: monthName,
      day: dayOfWeek,
      totalIncome: item.totalIncome,
      specialDay: specialDay, // Returns null if no special day is present
      customerCount: item.customerCount, // Number of customers per day
    };
  });

  res.status(200).json({
    success: true,
    dailyIncome: formattedDailyIncome,
  });
});

// today income 24 hours
// Get Today's Income Data
exports.todayIncome = catchAsyncError(async (req, res, next) => {
  const { year, month, date } = req.query;

  if (!year || !month || month < 1 || month > 12) {
    return next(
      new ErrorHandler("Valid year, month and date must be provided", 400)
    );
  }

  // Construct the date from the query parameters
  const queryDate = new Date(`${year}-${month}-${date}`);

  // Format the queryDate to match the start and end of the day for MongoDB query
  const startOfDay = moment(queryDate).startOf("day").toDate();
  const endOfDay = moment(queryDate).endOf("day").toDate();

  // Fetch today's income entries based on date
  const todayIncomeData = await DailyIncome.find({
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  // Calculate total income and format response
  const formattedIncome = todayIncomeData.map((item) => ({
    income: item.dailyIncome,
    time: new Date(item.date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
    specialDay: item.specialDay || "Normal", // Get original special day from the user
    objectId: item._id, // MongoDB ObjectID for editing
  }));

  const totalCustomerCount = todayIncomeData.length;

  // Calculate total income for the day
  const totalIncome = todayIncomeData.reduce(
    (sum, item) => sum + item.dailyIncome,
    0
  );

  // Determine the latest special day for the entire day's entries
  let latestSpecialDay = "Normal"; // Default to "Normal"
  if (todayIncomeData.length > 0) {
    // Find the latest special day that is not "Normal"
    const specialDays = todayIncomeData
      .map((item) => item.specialDay)
      .filter((day) => day && day !== "Normal");

    // If there are special days other than "Normal", get the latest one
    if (specialDays.length > 0) {
      latestSpecialDay = specialDays[specialDays.length - 1]; // Get the latest one
    }
  }

  // If there is no data, return a default response
  if (todayIncomeData.length === 0) {
    return res.status(200).json({
      success: true,
      date: moment(queryDate).format("DD/MM/YYYY"),
      month: moment(queryDate).format("MMMM"),
      day: moment(queryDate).format("dddd"),
      latestSpecialDay: "Normal", // Default when no entries
      totalCustomerCount: 0,
      totalIncome: 0, // Include totalIncome in the response
      todayIncome: [],
    });
  }

  // Return the structured response
  res.status(200).json({
    success: true,
    date: moment(queryDate).format("DD/MM/YYYY"),
    month: moment(queryDate).format("MMMM"),
    day: moment(queryDate).format("dddd"),
    latestSpecialDay: latestSpecialDay, // Latest special day for the day
    totalCustomerCount: totalCustomerCount,
    totalIncome: totalIncome, // Add totalIncome to the response
    todayIncome: formattedIncome,
  });
}); 

// Per month data from 1 to 30/31
exports.perMonthIncome = catchAsyncError(async (req, res, next) => {
  const { year, month } = req.query;

  // Ensure year and month are valid integers
  const queryYear = parseInt(year, 10);
  const queryMonth = parseInt(month, 10);

  if (!queryYear || !queryMonth || queryMonth < 1 || queryMonth > 12) {
    return next(new ErrorHandler("Valid year and month must be provided", 400));
  }

  // Get the number of days in the specified month and year
  const daysInMonth = new Date(queryYear, queryMonth, 0).getDate();

  // Define the start and end date based on Asia/Kolkata timezone
  const startDate = moment
    .tz(`${queryYear}-${queryMonth}-01`, "Asia/Kolkata")
    .startOf("day")
    .toDate(); // Start of the first day of the month
  const endDate = moment
    .tz(`${queryYear}-${queryMonth}-${daysInMonth}`, "Asia/Kolkata")
    .endOf("day")
    .toDate(); // End of the last day of the month

  // Match documents between the start and end dates
  const matchQuery = {
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  // Aggregate data based on year and month
  const dailyIncome = await DailyIncome.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: { day: { $dayOfMonth: "$date" } },
        totalIncome: { $sum: "$dailyIncome" },
        customerCount: { $sum: 1 },
      },
    },
    { $sort: { "_id.day": 1 } }, // Sort by day
  ]);

  // Create an array with all days of the month
  const formattedDailyIncome = Array.from({ length: daysInMonth }, (_, idx) => {
    const day = idx + 1;

    // Find data for this specific day from aggregation result
    const foundDay = dailyIncome.find((item) => item._id.day === day);

    return {
      date: new Date(queryYear, queryMonth - 1, day).toLocaleDateString(
        "en-GB"
      ), // Format date as DD/MM/YYYY
      totalIncome: foundDay ? foundDay.totalIncome : 0, // Default to 0 if no data
      customerCount: foundDay ? foundDay.customerCount : 0, // Default to 0 if no data
    };
  });

  // Return the formatted result
  res.status(200).json({
    success: true,
    perDayIncome: formattedDailyIncome,
  });
});

// Monthly Income Aggregation
exports.getMonthlyIncome = catchAsyncError(async (req, res, next) => {
  const { year } = req.query; // Expect year from the request query params

  // Validate the year input
  if (!year || isNaN(year) || year.length !== 4) {
    return res.status(400).json({
      success: false,
      message: "Invalid year. Please provide a valid four-digit year.",
    });
  }

  // Convert year to a number to handle the date range calculation correctly
  const yearInt = parseInt(year, 10);

  // Aggregate the monthly income data for the specified year
  const monthlyIncome = await DailyIncome.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${yearInt}-01-01`), // Start of the year
          $lt: new Date(`${yearInt + 1}-01-01`), // Start of the next year
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, // Group by year and month
        totalIncome: { $sum: "$dailyIncome" },
      },
    },
    {
      $sort: { _id: 1 }, // Sort by month
    },
  ]);

  // Initialize an array for all months with zero income
  const allMonths = Array.from({ length: 12 }, (v, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "long" }),
    totalIncome: 0,
  }));

  // Map aggregated income data to the allMonths array
  monthlyIncome.forEach((item) => {
    const [aggYear, aggMonth] = item._id.split("-"); // Extract year and month from _id
    const monthIndex = parseInt(aggMonth, 10) - 1; // Convert month string to index (0-11)

    if (monthIndex >= 0 && monthIndex < 12) {
      allMonths[monthIndex].totalIncome = item.totalIncome; // Set the total income for the corresponding month
    }
  });

  res.status(200).json({
    success: true,
    monthlyIncome: allMonths,
  });
});

// Yearly Income Aggregation
exports.getYearlyIncome = catchAsyncError(async (req, res, next) => {
  const yearlyIncome = await DailyIncome.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y", date: "$date" } },
        totalIncome: { $sum: "$dailyIncome" },
      },
    },
    {
      $sort: { _id: 1 }, // Sort by year
    },
  ]);

  // Format the results for better readability
  const formattedYearlyIncome = yearlyIncome.map((item) => ({
    year: item._id,
    totalIncome: item.totalIncome,
  }));

  res.status(200).json({
    success: true,
    yearlyIncome: formattedYearlyIncome,
  });
});
