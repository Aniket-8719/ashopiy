const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const DailyIncome = require("../models/dailyRevenue");
const FullDayIncome = require("../models/fullDayRevenue");
const moment = require("moment-timezone");

// Add daily income controller
exports.addDailyIncome = catchAsyncError(async (req, res, next) => {
  const { dailyIncome, earningType, latestSpecialDay } = req.body;

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
    date: moment.tz("Asia/Kolkata").toDate(), // Store the Date object
    earningType: earningType || "Cash",
    latestSpecialDay: latestSpecialDay || "Normal",
    user: req.user._id,
  });

  // Save the entry to the database
  await newIncomeEntry.save();

  // Respond with success
  res.status(201).json({
    success: true,
    message: "Daily income saved successfully!",
  });
});

// Add Full Day Income in a single document
exports.addFullDayIncome = catchAsyncError(async (req, res, next) => {
  try {
    const { date } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not found." });
    }
    console.log(req.user._id);

    if (!date) {
      return res.status(400).json({ message: "Invalid or missing date." });
    }

    const inputDate = moment.tz(date, "YYYY-MM-DD", "Asia/Kolkata");
 
    // Debugging date handling
    console.log("Received date:", date);
    console.log("Parsed date (UTC):", inputDate.utc().format());
    console.log("Parsed date (Asia/Kolkata):", inputDate.format());

    if (!inputDate.isValid()) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    const endDateUTC = inputDate.endOf("day").tz("Asia/Kolkata").toDate();

    const firstIncome = await DailyIncome.findOne({ user: req.user._id }).sort({
      date: 1,
    });
    if (!firstIncome) {
      return res.status(404).json({ message: "No income records available." });
    }

    const startDateUTC = moment(firstIncome.date)
      .tz("Asia/Kolkata")
      .startOf("day")
      .toDate();

    const existingFullDayIncome = await FullDayIncome.findOne({
      user: req.user._id,
      date: { $gte: startDateUTC, $lte: endDateUTC },
    });

    if (existingFullDayIncome) {
      return res
        .status(400)
        .json({ message: "Income already saved for this range." });
    }

    let currentDate = startDateUTC;
    const results = [];

    while (currentDate <= endDateUTC) {
      const dayStart = moment(currentDate).startOf("day");
      const dayEnd = moment(currentDate).endOf("day");

      const dayIncomes = await DailyIncome.find({
        user: req.user._id,
        date: { $gte: dayStart, $lte: dayEnd },
      }).sort({ time: 1 });

      if (!dayIncomes || dayIncomes.length === 0) {
        currentDate = moment(currentDate).add(1, "day").toDate();
        continue;
      }

      const firstTime = dayIncomes[0]?.time || "00:00:00";
      const lastTime = dayIncomes[dayIncomes.length - 1]?.time || "23:59:59";

      const totalIncome = dayIncomes.reduce(
        (sum, inc) => sum + (inc.dailyIncome || 0),
        0
      );
      const totalOnlineAmount = dayIncomes.reduce(
        (sum, inc) =>
          inc.earningType?.toLowerCase() === "online"
            ? sum + (inc.dailyIncome || 0)
            : sum,
        0
      );
      const totalReturnAmount = dayIncomes
        .filter((inc) => inc.dailyIncome < 0)
        .reduce((sum, inc) => sum + Math.abs(inc.dailyIncome), 0);

      const fullDayIncome = new FullDayIncome({
        date: dayIncomes[0].date,
        day: moment(dayStart).format("dddd"),
        month: moment(dayStart).format("MMMM"),
        time: [firstTime, lastTime],
        latestSpecialDay:
          dayIncomes[dayIncomes.length - 1]?.latestSpecialDay || "Normal",
        totalIncome,
        totalOnlineAmount,
        totalCustomers: dayIncomes.length,
        totalReturnAmount,
        totalReturnCustomers: dayIncomes.filter((inc) => inc.dailyIncome < 0)
          .length,
        user: req.user._id,
      });

      await fullDayIncome.save();
      results.push(fullDayIncome);

      const incomeIds = dayIncomes.map((inc) => inc._id).filter(Boolean);

      if (incomeIds.length > 0) {
        await DailyIncome.deleteMany({
          user: req.user._id,
          _id: { $in: incomeIds },
        });
      }

      currentDate = moment(currentDate).add(1, "day").toDate();
    }

    res.status(200).json({
      message: "Full day income records created successfully.",
      results,
    });
  } catch (error) {
    console.error("Error in /addFullDayIncome:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

// Today Income 24 Hours (Indian Time) (DailyIncome)
exports.todayIncome = catchAsyncError(async (req, res, next) => {
  const { year, month, date } = req.query;

  if (!year || !month || month < 1 || month > 12) {
    return next(
      new ErrorHandler("Valid year, month and date must be provided", 400)
    );
  }

  const queryDate = moment.tz(
    `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(
      2,
      "0"
    )}`,
    "YYYY-MM-DD",
    "Asia/Kolkata"
  ); // Use Indian timezone
  const startOfDay = queryDate.startOf("day").toDate();
  const endOfDay = queryDate.endOf("day").toDate();

  const todayIncomeData = await DailyIncome.find({
    user: req.user._id,
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  const formattedIncome = todayIncomeData.map((item) => ({
    income: item.dailyIncome,
    time: moment.tz(item.date, "Asia/Kolkata").format("h:mm A"), // Indian time
    earningType: item.earningType || "Cash",
    objectId: item._id,
  }));

  const totalCustomerCount = todayIncomeData.length;
  const totalIncome = todayIncomeData.reduce(
    (sum, item) => sum + item.dailyIncome,
    0
  );

  const latestSpecialDay =
    todayIncomeData[todayIncomeData.length - 1]?.latestSpecialDay || "Normal";

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

// Edit Today Income (DailyIncome)
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

// Delete Today Income (DailyIncome)
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

// per day month data (Indian Time)
exports.perMonthIncome = catchAsyncError(async (req, res, next) => {
  const { year, month } = req.query;

  const queryYear = parseInt(year, 10);
  const queryMonth = parseInt(month, 10);

  if (!queryYear || !queryMonth || queryMonth < 1 || queryMonth > 12) {
    return next(new ErrorHandler("Valid year and month must be provided", 400));
  }

  const daysInMonth = moment
    .tz({ year: queryYear, month: queryMonth - 1 }, "Asia/Kolkata")
    .daysInMonth();
  const startDate = moment
    .tz(`${queryYear}-${queryMonth}-01`, "Asia/Kolkata")
    .startOf("day")
    .toDate();
  const endDate = moment
    .tz(`${queryYear}-${queryMonth}-${daysInMonth}`, "Asia/Kolkata")
    .endOf("day")
    .toDate();

  // Aggregate income data with proper timezone handling for FullDayIncome
  const fullDayIncome = await FullDayIncome.aggregate([
    {
      $match: {
        user: req.user._id,
        date: { $gte: startDate, $lte: endDate }, // Match records within the correct month range
      },
    },
    {
      $addFields: {
        // Extract the day of the month from the FullDayIncome date
        day: {
          $dayOfMonth: {
            $dateFromParts: {
              year: {
                $year: { date: { $toDate: "$date" }, timezone: "Asia/Kolkata" },
              },
              month: {
                $month: {
                  date: { $toDate: "$date" },
                  timezone: "Asia/Kolkata",
                },
              },
              day: {
                $dayOfMonth: {
                  date: { $toDate: "$date" },
                  timezone: "Asia/Kolkata",
                },
              },
            },
          },
        },
      },
    },
    {
      $project: {
        // Include all the fields you need for each entry
        _id: 1,
        date: 1,
        day: 1,
        month: 1,
        time: 1,
        latestSpecialDay: 1,
        totalIncome: 1,
        totalCustomers: 1,
        totalOnlineAmount: 1,
        totalReturnCustomers: 1,
        totalReturnAmount: 1,
      },
    },
    { $sort: { "_id.day": 1 } }, // Sort by day
  ]);

  // Format daily income data
  const formattedDailyIncome = Array.from({ length: daysInMonth }, (_, idx) => {
    const day = idx + 1;
    const foundDay = fullDayIncome.find((item) => item.day === day);

    return {
      date: moment
        .tz({ year: queryYear, month: queryMonth - 1, day }, "Asia/Kolkata")
        .format("DD/MM/YYYY"),
      dayOfWeek: foundDay ? foundDay.day : null, // Day of the week (e.g., "Monday")
      totalIncome: foundDay ? foundDay.totalIncome : 0,
      totalCustomers: foundDay ? foundDay.totalCustomers : 0,
      totalOnlineAmount: foundDay ? foundDay.totalOnlineAmount : 0,
      totalReturnCustomers: foundDay ? foundDay.totalReturnCustomers : 0,
      totalReturnAmount: foundDay ? foundDay.totalReturnAmount : 0,
      latestSpecialDay: foundDay ? foundDay.latestSpecialDay : null, // Special day if any
      time: foundDay ? foundDay.time : [], // Include the time array
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

  // Validate the year
  if (!year || isNaN(year) || year.length !== 4) {
    return res.status(400).json({
      success: false,
      message: "Invalid year. Please provide a valid four-digit year.",
    });
  }

  const yearInt = parseInt(year, 10);

  // Aggregate monthly income while adjusting for timezone (IST) from FullDayIncome
  const monthlyIncome = await FullDayIncome.aggregate([
    {
      $match: {
        user: req.user._id,
        date: {
          $gte: new Date(`${yearInt}-01-01`),
          $lt: new Date(`${yearInt + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: { date: "$date", timezone: "Asia/Kolkata" } },
          month: { $month: { date: "$date", timezone: "Asia/Kolkata" } },
        },
        totalIncome: { $sum: "$totalIncome" }, // Sum of income for each month
      },
    },
    { $sort: { "_id.month": 1 } }, // Sort by month
  ]);

  // Prepare all months with 0 income by default
  const allMonths = Array.from({ length: 12 }, (_, i) => ({
    month: moment.tz({ month: i }, "Asia/Kolkata").format("MMMM"), // Get month names in IST
    totalIncome: 0, // Default to 0
  }));

  // Populate the actual income data into the correct months
  monthlyIncome.forEach((item) => {
    const monthIndex = item._id.month - 1; // Get the correct month index (0-based)
    if (monthIndex >= 0 && monthIndex < 12) {
      allMonths[monthIndex].totalIncome = item.totalIncome; // Update the income for the month
    }
  });

  res.status(200).json({
    success: true,
    monthlyIncome: allMonths,
  });
});

// Yearly Income Aggregation (Indian Time)
exports.getYearlyIncome = catchAsyncError(async (req, res, next) => {
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

  // Format the result to make it more readable
  const formattedYearlyIncome = yearlyIncome.map((item) => ({
    year: item._id, // The year from the grouped result
    totalIncome: item.totalIncome, // The total income for that year
  }));

  // Return the response
  res.status(200).json({
    success: true,
    yearlyIncome: formattedYearlyIncome,
  });
});

// Fulldayincome for entire Month data (Indian Time)
exports.monthlyHistory = catchAsyncError(async (req, res, next) => {
  const { year, month } = req.query;

  const queryYear = parseInt(year, 10);
  const queryMonth = parseInt(month, 10);

  // Check for valid year and month
  if (!queryYear || !queryMonth || queryMonth < 1 || queryMonth > 12) {
    return next(new ErrorHandler("Valid year and month must be provided", 400));
  }

  // Get today's date in the "Asia/Kolkata" timezone
  const today = moment().tz("Asia/Kolkata");
  const todayYear = today.year();
  const todayMonth = today.month() + 1; // moment() returns 0-indexed month
  const todayDay = today.date(); // Current day of the month

  // Check if the requested month/year is in the future
  if (
    queryYear > todayYear ||
    (queryYear === todayYear && queryMonth > todayMonth)
  ) {
    return next(new ErrorHandler("Cannot retrieve future data", 400));
  }

  // Ensure no future data for the current day
  const daysInMonth = moment
    .tz({ year: queryYear, month: queryMonth - 1 }, "Asia/Kolkata")
    .daysInMonth();

  let endDate;
  if (queryYear === todayYear && queryMonth === todayMonth) {
    // Limit end date to the current day and time
    endDate = today.endOf("day").toDate();
  } else {
    // For past months, include the full last day of the month
    endDate = moment
      .tz(
        { year: queryYear, month: queryMonth - 1, day: daysInMonth },
        "Asia/Kolkata"
      )
      .endOf("day")
      .toDate();
  }

  const startDate = moment
    .tz({ year: queryYear, month: queryMonth - 1, day: 1 }, "Asia/Kolkata")
    .startOf("day")
    .toDate();

  // Aggregate income data with proper timezone handling
  const fullDayIncome = await FullDayIncome.aggregate([
    {
      $match: {
        user: req.user._id,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    // Add fields for day and other required fields
    {
      $addFields: {
        day: {
          $dayOfMonth: {
            $dateFromParts: {
              year: {
                $year: { date: { $toDate: "$date" }, timezone: "Asia/Kolkata" },
              },
              month: {
                $month: {
                  date: { $toDate: "$date" },
                  timezone: "Asia/Kolkata",
                },
              },
              day: {
                $dayOfMonth: {
                  date: { $toDate: "$date" },
                  timezone: "Asia/Kolkata",
                },
              },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        date: 1,
        day: 1,
        month: 1,
        time: 1,
        latestSpecialDay: 1,
        totalIncome: 1,
        totalCustomers: 1,
        totalOnlineAmount: 1,
        totalReturnCustomers: 1,
        totalReturnAmount: 1,
      },
    },
    { $sort: { "_id.day": 1 } },
  ]);

  // Format daily income, ensuring no future data for today
  const formattedDailyIncome = Array.from({ length: daysInMonth }, (_, idx) => {
    const day = idx + 1;
    const date = moment.tz(
      { year: queryYear, month: queryMonth - 1, day },
      "Asia/Kolkata"
    );

    // Skip generating data for future dates
    if (
      queryYear === todayYear &&
      queryMonth === todayMonth &&
      day > todayDay
    ) {
      return null;
    }

    const foundDay = fullDayIncome.find((item) => item.day === day);

    return {
      date: date.format("DD/MM/YYYY"),
      dayOfWeek: date.format("dddd"),
      totalIncome: foundDay ? foundDay.totalIncome : 0,
      totalCustomers: foundDay ? foundDay.totalCustomers : 0,
      totalOnlineAmount: foundDay ? foundDay.totalOnlineAmount : 0,
      totalReturnCustomers: foundDay ? foundDay.totalReturnCustomers : 0,
      totalReturnAmount: foundDay ? foundDay.totalReturnAmount : 0,
      latestSpecialDay: foundDay ? foundDay.latestSpecialDay : null,
      time: foundDay ? foundDay.time : [],
    };
  }).filter((entry) => entry !== null); // Remove null entries

  res.status(200).json({
    success: true,
    data: formattedDailyIncome,
  });
});

// Get Complete Income from the starting (All History)
exports.getFullDayIncome = catchAsyncError(async (req, res, next) => {
  const fullDayIncome = await FullDayIncome.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    fullDayIncome,
  });
});

// Daily Income Aggregation (Indian Time)
// exports.perDayIncome = catchAsyncError(async (req, res, next) => {
//   const dailyIncome = await DailyIncome.aggregate([
//     {
//       $group: {
//         _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
//         totalIncome: { $sum: "$dailyIncome" },
//         specialDay: { $first: "$specialDay" },
//         customerCount: { $sum: 1 },
//       },
//     },
//     { $sort: { _id: 1 } },
//   ]);

//   // Format the results with Indian timezone
//   const formattedDailyIncome = dailyIncome.map((item) => {
//     const dateObj = moment.tz(item._id, "Asia/Kolkata"); // Use Indian timezone
//     const formattedDate = dateObj.format("DD/MM/YYYY");
//     const dayOfWeek = dateObj.format("dddd");
//     const monthName = dateObj.format("MMMM");

//     return {
//       date: formattedDate,
//       month: monthName,
//       day: dayOfWeek,
//       totalIncome: item.totalIncome,
//       specialDay: item.specialDay || null,
//       customerCount: item.customerCount,
//     };
//   });

//   res.status(200).json({
//     success: true,
//     dailyIncome: formattedDailyIncome,
//   });
// });

// exports.perMonthIncome = catchAsyncError(async (req, res, next) => {
//   const { year, month } = req.query;

//   const queryYear = parseInt(year, 10);
//   const queryMonth = parseInt(month, 10);

//   if (!queryYear || !queryMonth || queryMonth < 1 || queryMonth > 12) {
//     return next(new ErrorHandler("Valid year and month must be provided", 400));
//   }

//   const daysInMonth = moment
//     .tz({ year: queryYear, month: queryMonth - 1 }, "Asia/Kolkata")
//     .daysInMonth();
//   const startDate = moment
//     .tz(`${queryYear}-${queryMonth}-01`, "Asia/Kolkata")
//     .startOf("day")
//     .toDate();
//   const endDate = moment
//     .tz(`${queryYear}-${queryMonth}-${daysInMonth}`, "Asia/Kolkata")
//     .endOf("day")
//     .toDate();

//   // Aggregate income data with proper timezone handling
//   const dailyIncome = await DailyIncome.aggregate([
//     {
//       $match: {
//         date: { $gte: startDate, $lte: endDate }, // Match records within the correct month range
//       },
//     },
//     {
//       $addFields: {
//         // Convert date field to a Date object if needed
//         day: {
//           $dayOfMonth: {
//             $dateFromParts: {
//               year: {
//                 $year: { date: { $toDate: "$date" }, timezone: "Asia/Kolkata" },
//               },
//               month: {
//                 $month: {
//                   date: { $toDate: "$date" },
//                   timezone: "Asia/Kolkata",
//                 },
//               },
//               day: {
//                 $dayOfMonth: {
//                   date: { $toDate: "$date" },
//                   timezone: "Asia/Kolkata",
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//     {
//       $group: {
//         _id: { day: "$day" }, // Group by adjusted day
//         totalIncome: { $sum: "$dailyIncome" }, // Sum income per day
//         customerCount: { $sum: 1 }, // Count entries per day
//       },
//     },
//     { $sort: { "_id.day": 1 } }, // Sort by day
//   ]);

//   const formattedDailyIncome = Array.from({ length: daysInMonth }, (_, idx) => {
//     const day = idx + 1;
//     const foundDay = dailyIncome.find((item) => item._id.day === day);

//     return {
//       date: moment
//         .tz({ year: queryYear, month: queryMonth - 1, day }, "Asia/Kolkata")
//         .format("DD/MM/YYYY"),
//       totalIncome: foundDay ? foundDay.totalIncome : 0,
//       customerCount: foundDay ? foundDay.customerCount : 0,
//     };
//   });

//   res.status(200).json({
//     success: true,
//     perDayIncome: formattedDailyIncome,
//   });
// });

// Monthly Income Aggregation (Indian Time)
// exports.getMonthlyIncome = catchAsyncError(async (req, res, next) => {
//   const { year } = req.query;

//   // Validate the year
//   if (!year || isNaN(year) || year.length !== 4) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid year. Please provide a valid four-digit year.",
//     });
//   }

//   const yearInt = parseInt(year, 10);

//   // Aggregate monthly income while adjusting for timezone (IST)
//   const monthlyIncome = await DailyIncome.aggregate([
//     {
//       $match: {
//         date: {
//           $gte: new Date(`${yearInt}-01-01`),
//           $lt: new Date(`${yearInt + 1}-01-01`),
//         },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           year: { $year: { date: "$date", timezone: "Asia/Kolkata" } },
//           month: { $month: { date: "$date", timezone: "Asia/Kolkata" } },
//         },
//         totalIncome: { $sum: "$dailyIncome" }, // Sum of income for each month
//       },
//     },
//     { $sort: { "_id.month": 1 } }, // Sort by month
//   ]);

//   // Prepare all months with 0 income by default
//   const allMonths = Array.from({ length: 12 }, (_, i) => ({
//     month: moment.tz({ month: i }, "Asia/Kolkata").format("MMMM"), // Get month names in IST
//     totalIncome: 0, // Default to 0
//   }));

//   // Populate the actual income data into the correct months
//   monthlyIncome.forEach((item) => {
//     const monthIndex = item._id.month - 1; // Get the correct month index (0-based)
//     if (monthIndex >= 0 && monthIndex < 12) {
//       allMonths[monthIndex].totalIncome = item.totalIncome; // Update the income for the month
//     }
//   });

//   res.status(200).json({
//     success: true,
//     monthlyIncome: allMonths,
//   });
// });

// Yearly Income Aggregation (Indian Time)
// exports.getYearlyIncome = catchAsyncError(async (req, res, next) => {
//   // Aggregate yearly income while adjusting for timezone (IST)
//   const yearlyIncome = await DailyIncome.aggregate([
//     {
//       $group: {
//         _id: { $year: { date: "$date", timezone: "Asia/Kolkata" } }, // Group by year in IST
//         totalIncome: { $sum: "$dailyIncome" }, // Sum income for the entire year
//       },
//     },
//     { $sort: { _id: 1 } }, // Sort by year
//   ]);

//   // Format the result to make it more readable
//   const formattedYearlyIncome = yearlyIncome.map((item) => ({
//     year: item._id, // The year from the grouped result
//     totalIncome: item.totalIncome, // The total income for that year
//   }));

//   // Return the response
//   res.status(200).json({
//     success: true,
//     yearlyIncome: formattedYearlyIncome,
//   });
// });
