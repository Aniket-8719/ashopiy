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

  // Add 5 hours and 30 minutes to adjust to UTC
  const utcDateTime = indiaDateTime.clone().add(5, "hours").add(30, "minutes");

  // Create a new income entry
  const newIncomeEntry = new DailyIncome({
    dailyIncome: Number(dailyIncome), // Ensure it's stored as a number
    time: indiaDateTime.format("HH:mm:ss"), // Save time in 'HH:mm:ss' format
    day: indiaDateTime.format("dddd"), // Day of the week, e.g., "Monday"
    date: utcDateTime.toDate(), // Store the UTC Date object after adjustment
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

    if (!date) {
      return res.status(400).json({ message: "Invalid or missing date." });
    }

    // Parse input date in IST and convert to UTC
    const inputDateIST = moment.tz(date, "YYYY-MM-DD", "Asia/Kolkata");
    if (!inputDateIST.isValid()) {
      return res.status(400).json({ message: "Invalid date format." });
    }
    console.log(inputDateIST);

    // Calculate the end of the day in IST and then convert to UTC
    const endDateUTC = inputDateIST
      .endOf("day") // End of the day in IST (23:59:59.999 in Asia/Kolkata)
      .utc()
      .add(5, "hours")
      .add(30, "minutes") // Convert to UTC
      .toDate(); // Convert to JavaScript Date object

    console.log("End Date UTC: ", endDateUTC);

    // Get the earliest income record for the user
    const firstIncome = await DailyIncome.findOne({
      $or: [
        { user: req.user._id },
        { merchantID: req.user.merchantID }, // Replace with dynamic merchant ID as needed
      ],
    }).sort({
      date: 1,
    });
    if (!firstIncome) {
      return res.status(404).json({ message: "No income records available." });
    }

    let currentDateUTC = moment(firstIncome.date).toDate();
    console.log("currentDateUTC: ", currentDateUTC);

    // Calculate dayStartUTC
    let dayStartUTC = moment.utc(currentDateUTC).startOf("day").toDate(); // Start of the day in UTC

    // Calculate dayEndUTC
    let dayEndUTC = moment.utc(dayStartUTC).endOf("day").toDate(); // End of the day in UTC

    const results = [];

    while (currentDateUTC <= endDateUTC) {
      console.log("while loop: ");
      console.log("dayStart: ", dayStartUTC);
      console.log("dayEnd: ", dayEndUTC);

      // Prepare the query based on the merchantID or user._id
      const query = {
        date: { $gte: dayStartUTC, $lte: dayEndUTC },
        $or: [],
      };

      // If merchantID exists, prioritize it
      if (req.user.merchantID) {
        query.$or.push({ merchantID: req.user.merchantID });
      }

      // Always include the user._id in the query to fall back if needed
      query.$or.push({ user: req.user._id });

      // Fetch all incomes within the UTC day range
      const dayIncomes = await DailyIncome.find(query).sort({ time: 1 });

      if (dayIncomes.length > 0) {
        // Aggregate the data
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

        // Create and save the FullDayIncome document
        const fullDayIncome = new FullDayIncome({
          date: moment(dayStartUTC).tz("Asia/Kolkata").format("YYYY-MM-DD"),
          day: moment(dayStartUTC).tz("Asia/Kolkata").format("dddd"),
          month: moment(dayStartUTC).tz("Asia/Kolkata").format("MMMM"),
          time: [
            dayIncomes[0]?.time || "00:00:00",
            dayIncomes[dayIncomes.length - 1]?.time || "23:59:59",
          ],
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
      }

      const incomeIds = dayIncomes.map((inc) => inc._id).filter(Boolean);

      if (incomeIds.length > 0) {
        await DailyIncome.deleteMany({
          $or: [{ user: req.user._id }, { merchantID: req.user.merchantID }],
          _id: { $in: incomeIds },
        });
      }

      // Calculate dayStartUTC
      dayStartUTC = moment
        .utc(dayStartUTC)
        .add(1, "day")
        .startOf("day")
        .toDate(); // Start of the day in UTC

      // Calculate dayEndUTC
      dayEndUTC = moment.utc(dayStartUTC).endOf("day").toDate(); // End of the day in UTC

      // Move to the next day
      currentDateUTC = dayStartUTC;
      if (currentDateUTC > endDateUTC) {
        console.log("condition mil gai ab toot jaiga");
        console.log("currentDateUTC", currentDateUTC);
        console.log("endDateUTC", endDateUTC);
      }
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
  );
  // console.log("queryDate: ", queryDate);

  // Use Indian timezone
  const startOfDay = moment
    .utc(queryDate)
    .add(1, "day")
    .startOf("day")
    .toDate();
  const endOfDay = moment.utc(startOfDay).endOf("day").toDate();
  // console.log("startOfDay: ", startOfDay);
  // console.log("endOfDay: ", endOfDay);

  // Prepare the query based on merchantID or user._id
  const query = {
    date: { $gte: startOfDay, $lte: endOfDay }, // Date range filter
    $or: [],
  };

  // If merchantID exists, prioritize it
  if (req.user.merchantID) {
    query.$or.push({ merchantID: req.user.merchantID });
  }

  // Always include the user._id in the query as a fallback
  query.$or.push({ user: req.user._id });

  // Fetch all incomes within the date range
  const todayIncomeData = await DailyIncome.find(query);

  const formattedIncome = todayIncomeData.map((item) => ({
    income: item.dailyIncome,
    time: moment(item.time, "HH:mm").format("hh:mm A"), // Indian time
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
  income.earningType = req.body.earningType;

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

  // Get today's date
  const today = moment().tz("Asia/Kolkata");
  const todayYear = today.year();
  const todayMonth = today.month() + 1; // month() returns 0-based index
  const todayDay = today.date();

  // Calculate the number of days in the month
  const daysInMonth = moment
    .utc(`${queryYear}-${queryMonth}`, "YYYY-MM")
    .daysInMonth();

  // Start and end dates
  const startDate = moment
    .utc(`${queryYear}-${queryMonth}-01`, "YYYY-MM-DD")
    .startOf("day")
    .toDate();
  const endDate = moment
    .utc(`${queryYear}-${queryMonth}-${daysInMonth}`, "YYYY-MM-DD")
    .endOf("day")
    .toDate();

  // Aggregate income data
  const fullDayIncome = await FullDayIncome.aggregate([
    {
      $match: {
        user: req.user._id,
        date: { $gte: startDate, $lte: endDate },
      },
    },
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
        totalIncome: 1,
        totalCustomers: 1,
        totalOnlineAmount: 1,
        totalReturnCustomers: 1,
        totalReturnAmount: 1,
        latestSpecialDay: 1,
        time: 1,
      },
    },
    { $sort: { "_id.day": 1 } },
  ]);

  // Format daily income data
  const formattedDailyIncome = Array.from({ length: daysInMonth }, (_, idx) => {
    const day = idx + 1;

    // Calculate the date for the current day in the loop
    const date = moment.utc({ year: queryYear, month: queryMonth - 1, day });

    // Skip generating data for dates before `userJoiningDate` or future dates
    if (
      queryYear === todayYear &&
      queryMonth === todayMonth &&
      day > todayDay // Skip future dates
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

  const startDate = moment
    .tz({ year: queryYear, month: queryMonth - 1, day: 1 }, "Asia/Kolkata")
    .startOf("day")
    .utc()
    .toDate();

  const endDate =
    queryYear === todayYear && queryMonth === todayMonth
      ? moment.tz(today, "Asia/Kolkata").endOf("day").utc().toDate()
      : moment
          .tz(
            { year: queryYear, month: queryMonth - 1, day: daysInMonth },
            "Asia/Kolkata"
          )
          .endOf("day")
          .utc()
          .toDate();

  console.log("startDate: ", startDate);
  console.log("endDate: ", endDate);
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
    const date = moment.utc({ year: queryYear, month: queryMonth - 1, day });

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
exports.getCompleteData = catchAsyncError(async (req, res, next) => {
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
