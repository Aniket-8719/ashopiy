const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const DailyIncome = require("../models/dailyRevenue");
const moment = require("moment-timezone");


// Add daily income controller
exports.addDailyIncome = catchAsyncError(async (req, res, next) => {
  const { dailyIncome, specialDay } = req.body;

  // Check if dailyIncome is valid and can be converted to a number
  if (!dailyIncome || isNaN(Number(dailyIncome))) {
    return res
      .status(400)
      .json({ message: "Please provide a valid daily income" });
  }

  // Get the current date and time in the Asia/Kolkata timezone
  const indiaDateTime = moment.tz("Asia/Kolkata");

  // Create a new income entry
  const newIncomeEntry = new DailyIncome({
    dailyIncome: Number(dailyIncome), // Ensure it's stored as a number
    time: indiaDateTime.format("HH:mm:ss"), // Save time in 'HH:mm:ss' format
    day: indiaDateTime.format("dddd"), // Day of the week, e.g., "Monday"
    date: moment.tz("Asia/Kolkata").toDate(),// Store the Date object
    specialDay: specialDay || "Normal", // Default to "Normal" if not provided
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

// Edit Today Income
exports.updateTodayIncome = catchAsyncError(async (req, res, next) => {
  const income = await DailyIncome.findById(req.params.id);

  if (!income) {
    return res.status(500).json({
      success: false,
      message: "Income not found",
    });
  }

  income.dailyIncome = req.body.dailyIncome;
  income.specialDay = req.body.specialDay;

  // Save the updated income
  await income.save();

  res.status(200).json({
    success: true,
    message: "Income updated successfully",
  });
});

// Delete Today Income
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
    message: "Income deleted successfully",
  });
});

// Daily Income Aggregation (Indian Time)
exports.perDayIncome = catchAsyncError(async (req, res, next) => {
  const dailyIncome = await DailyIncome.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        totalIncome: { $sum: "$dailyIncome" },
        specialDay: { $first: "$specialDay" },
        customerCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Format the results with Indian timezone
  const formattedDailyIncome = dailyIncome.map((item) => {
    const dateObj = moment.tz(item._id, "Asia/Kolkata"); // Use Indian timezone
    const formattedDate = dateObj.format("DD/MM/YYYY");
    const dayOfWeek = dateObj.format("dddd");
    const monthName = dateObj.format("MMMM");

    return {
      date: formattedDate,
      month: monthName,
      day: dayOfWeek,
      totalIncome: item.totalIncome,
      specialDay: item.specialDay || null,
      customerCount: item.customerCount,
    };
  });

  res.status(200).json({
    success: true,
    dailyIncome: formattedDailyIncome,
  });
});

// Today Income 24 Hours (Indian Time)
exports.todayIncome = catchAsyncError(async (req, res, next) => {
  const { year, month, date } = req.query;

  if (!year || !month || month < 1 || month > 12) {
    return next(new ErrorHandler("Valid year, month and date must be provided", 400));
  }

  const queryDate = moment.tz(`${year}-${month}-${date}`, "Asia/Kolkata"); // Use Indian timezone
  const startOfDay = queryDate.startOf("day").toDate();
  const endOfDay = queryDate.endOf("day").toDate();

  const todayIncomeData = await DailyIncome.find({
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  const formattedIncome = todayIncomeData.map((item) => ({
    income: item.dailyIncome,
    time: moment.tz(item.date, "Asia/Kolkata").format("h:mm A"), // Indian time
    specialDay: item.specialDay || "Normal",
    objectId: item._id,
  }));

  const totalCustomerCount = todayIncomeData.length;
  const totalIncome = todayIncomeData.reduce((sum, item) => sum + item.dailyIncome, 0);

  let latestSpecialDay = "Normal";
  const specialDays = todayIncomeData.map((item) => item.specialDay).filter((day) => day && day !== "Normal");
  if (specialDays.length > 0) {
    latestSpecialDay = specialDays[specialDays.length - 1];
  }

  if (todayIncomeData.length === 0) {
    return res.status(200).json({
      success: true,
      date: queryDate.format("DD/MM/YYYY"),
      month: queryDate.format("MMMM"),
      day: queryDate.format("dddd"),
      latestSpecialDay: "Normal",
      totalCustomerCount: 0,
      totalIncome: 0,
      todayIncome: [],
    });
  }

  res.status(200).json({
    success: true,
    date: queryDate.format("DD/MM/YYYY"),
    month: queryDate.format("MMMM"),
    day: queryDate.format("dddd"),
    latestSpecialDay,
    totalCustomerCount,
    totalIncome,
    todayIncome: formattedIncome,
  });
});

// Per Month Data (Indian Time)
// Per Month Data (Indian Time)
exports.perMonthIncome = catchAsyncError(async (req, res, next) => {
  const { year, month } = req.query;

  const queryYear = parseInt(year, 10);
  const queryMonth = parseInt(month, 10);

  if (!queryYear || !queryMonth || queryMonth < 1 || queryMonth > 12) {
    return next(new ErrorHandler("Valid year and month must be provided", 400));
  }

  const daysInMonth = moment.tz({ year: queryYear, month: queryMonth - 1 }, "Asia/Kolkata").daysInMonth();
  const startDate = moment.tz(`${queryYear}-${queryMonth}-01`, "Asia/Kolkata").startOf("day").toDate();
  const endDate = moment.tz(`${queryYear}-${queryMonth}-${daysInMonth}`, "Asia/Kolkata").endOf("day").toDate();

  // Aggregate income data with proper timezone handling
  const dailyIncome = await DailyIncome.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate }, // Match records within the correct month range
      },
    },
    {
      $addFields: {
        // Convert UTC date to Indian Standard Time (IST)
        day: {
          $dayOfMonth: {
            $dateFromParts: {
              year: { $year: { date: "$date", timezone: "Asia/Kolkata" } },
              month: { $month: { date: "$date", timezone: "Asia/Kolkata" } },
              day: { $dayOfMonth: { date: "$date", timezone: "Asia/Kolkata" } },
            },
          },
        },
      },
    },
    {
      $group: {
        _id: { day: "$day" }, // Group by adjusted day
        totalIncome: { $sum: "$dailyIncome" }, // Sum income per day
        customerCount: { $sum: 1 }, // Count entries per day
      },
    },
    { $sort: { "_id.day": 1 } }, // Sort by day
  ]);

  console.log("Aggregated Daily Income:", dailyIncome);

  const formattedDailyIncome = Array.from({ length: daysInMonth }, (_, idx) => {
    const day = idx + 1;
    const foundDay = dailyIncome.find((item) => item._id.day === day);

    return {
      date: moment.tz({ year: queryYear, month: queryMonth - 1, day }, "Asia/Kolkata").format("DD/MM/YYYY"),
      totalIncome: foundDay ? foundDay.totalIncome : 0,
      customerCount: foundDay ? foundDay.customerCount : 0,
    };
  });

  res.status(200).json({
    success: true,
    perDayIncome: formattedDailyIncome,
  });
});



// Monthly Income Aggregation (Indian Time)
exports.getMonthlyIncome = catchAsyncError(async (req, res, next) => {
  const { year } = req.query;

  if (!year || isNaN(year) || year.length !== 4) {
    return res.status(400).json({
      success: false,
      message: "Invalid year. Please provide a valid four-digit year.",
    });
  }

  const yearInt = parseInt(year, 10);

  const monthlyIncome = await DailyIncome.aggregate([
    { $match: { date: { $gte: new Date(`${yearInt}-01-01`), $lt: new Date(`${yearInt + 1}-01-01`) } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, totalIncome: { $sum: "$dailyIncome" } } },
    { $sort: { _id: 1 } },
  ]);

  const allMonths = Array.from({ length: 12 }, (v, i) => ({
    month: moment.tz({ month: i }, "Asia/Kolkata").format("MMMM"),
    totalIncome: 0,
  }));

  monthlyIncome.forEach((item) => {
    const [aggYear, aggMonth] = item._id.split("-");
    const monthIndex = parseInt(aggMonth, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      allMonths[monthIndex].totalIncome = item.totalIncome;
    }
  });

  res.status(200).json({
    success: true,
    monthlyIncome: allMonths,
  });
});

// Yearly Income Aggregation (Indian Time)
exports.getYearlyIncome = catchAsyncError(async (req, res, next) => {
  const yearlyIncome = await DailyIncome.aggregate([
    { $group: { _id: { $dateToString: { format: "%Y", date: "$date" } }, totalIncome: { $sum: "$dailyIncome" } } },
    { $sort: { _id: 1 } },
  ]);

  const formattedYearlyIncome = yearlyIncome.map((item) => ({
    year: item._id,
    totalIncome: item.totalIncome,
  }));

  res.status(200).json({
    success: true,
    yearlyIncome: formattedYearlyIncome,
  });
});
