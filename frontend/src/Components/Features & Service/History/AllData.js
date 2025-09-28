import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Layouts/Loader";
import { toast } from "react-toastify";
import { clearErrors, getMonthlyHistory } from "../../../actions/earningAction";
import ExcelJS from "exceljs";
import moment from "moment-timezone";
import { HiDownload } from "react-icons/hi";
import MetaData from "../../Layouts/MetaData";
import LineSkelton from "../../Skelton/LineSkelton";
import {
  FaCalendarCheck,
  FaChartLine,
  FaCreditCard,
  FaIndianRupeeSign,
  FaMoneyBill,
  FaUsers,
} from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const AllData = () => {
  const columns = [
    { header: "Date", key: "date" },
    { header: "Day", key: "day" },
    { header: "Special Day", key: "specialDay" },
    { header: "Open Time", key: "openTime" },
    { header: "Close Time", key: "closeTime" },
    { header: "Total Income", key: "totoalIncome" },
    { header: "Cash Amount", key: "cashAmount" },
    { header: "Online Amount", key: "OnlineAmount" },
    { header: "Customers", key: "totalCustomer" },
  ];
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const { monthlyHistoryData, error, loading } = useSelector(
    (state) => state.monthlyHistory
  );
  const today = new Date();
  const defaultMonthYear = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;
  const [selectedMonthYear, setSelectedMonthYear] = useState(defaultMonthYear);

  if (error) {
    toast.error(error);
    dispatch(clearErrors());
  }

  // Download Excel
  const downloadExcel = () => {
    try {
      // Ensure data is valid and contains expected values
      if (!monthlyHistoryData || !Array.isArray(monthlyHistoryData.data)) {
        throw new Error("Invalid data for Excel export.");
      }

      // Get today's date to skip it
      const today = new Date().toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
      // Get the current month and year to include in the file name
      let dataMonthName = "";
      let dataYear = "";

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Monthly Statement");

      // Define columns with proper headers and key mappings
      worksheet.columns = [
        { header: "Date", key: "date", width: 15 },
        { header: "Day", key: "day", width: 12 },
        { header: "Open Time", key: "openTime", width: 12 },
        { header: "Close Time", key: "closeTime", width: 12 },
        { header: "Total Income", key: "totalIncome", width: 15 },
        { header: "Cash Amount", key: "cashAmount", width: 15 }, // Cash amount column
        { header: "Online Amount", key: "totalOnlineAmount", width: 18 },
        { header: "Customer Count", key: "totalCustomers", width: 18 },
      ];

      // Add header row with bold style and center alignment
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true }; // Make the header bold
      headerRow.alignment = { horizontal: "center", vertical: "middle" }; // Center align header

      let totalIncomeSum = 0;
      let totalCustomersSum = 0;
      let totalOnlineAmountSum = 0;

      // Add the data rows
      monthlyHistoryData.data.forEach((row) => {
        // Skip today's data
        if (row.date === today) {
          return;
        }

        // Parse the date and format it to get the month name
        dataMonthName = moment(row?.date, "DD/MM/YYYY").format("MMMM");
        dataYear = moment(row?.date, "DD/MM/YYYY").format("YYYY");

        // Convert open and close times to AM/PM format using moment.js, or display "Close" if empty
        const formattedOpenTime = row.time[0]
          ? moment(row.time[0], "HH:mm:ss").format("hh:mm A")
          : "Close"; // If no open time, display "Close"

        const formattedCloseTime = row.time[1]
          ? moment(row.time[1], "HH:mm:ss").format("hh:mm A")
          : "Close"; // If no close time, display "Close"

        const cashAmount = row.totalIncome - row.totalOnlineAmount;

        // Add data row with calculated cash amount
        const rowData = {
          date: row.date,
          day: row.dayOfWeek, // Day of the week
          openTime: formattedOpenTime, // Open time
          closeTime: formattedCloseTime, // Close time
          totalIncome: row.totalIncome || 0,
          cashAmount: cashAmount, // Cash Amount (Total Income - Total Online Amount)
          totalOnlineAmount: row.totalOnlineAmount || 0,
          totalCustomers: row.totalCustomers || 0,
          totalReturnCustomers: row.totalReturnCustomers || 0,
          totalReturnAmount: row.totalReturnAmount || 0,
        };
        worksheet.addRow(rowData);

        // Update totals for subtotal
        totalIncomeSum += row.totalIncome || 0;
        totalCustomersSum += row.totalCustomers || 0;
        totalOnlineAmountSum += row.totalOnlineAmount || 0;
      });

      // Center align all the data rows
      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber !== 1) {
          // Skip the header row
          row.alignment = { horizontal: "center", vertical: "middle" };
        }
      });

      // Add subtotal row
      worksheet.addRow([
        "Subtotal",
        "", // Empty for "Day"
        "", // Empty for "Open Time"
        "", // Empty for "Close Time"
        `₹${new Intl.NumberFormat("en-IN").format(totalIncomeSum)} `, // Subtotal for Total Income
        `₹${new Intl.NumberFormat("en-IN").format(
          totalIncomeSum - totalOnlineAmountSum
        )}`,
        `₹${new Intl.NumberFormat("en-IN").format(totalOnlineAmountSum)} `, // Subtotal for Online Amount
        totalCustomersSum, // Subtotal for Customer Count
      ]);
      const subtotalRow = worksheet.getRow(worksheet.rowCount);
      subtotalRow.font = { bold: true }; // Make subtotal bold
      subtotalRow.alignment = { horizontal: "center", vertical: "middle" }; // Center align subtotal

      // Adjust column widths for better visibility
      worksheet.columns.forEach((col) => {
        let maxLength = 0;
        col.eachCell({ includeEmpty: true }, (cell) => {
          const length = cell.value ? cell.value.toString().length : 0;
          maxLength = Math.max(maxLength, length);
        });
        col.width = maxLength + 2; // Adding some padding for readability
      });

      // Generate the Excel file and trigger download
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        if (!dataMonthName || !dataYear) {
          throw new Error("Unable to determine month and year from data.");
        }

        // Use current month and year in the file name
        link.setAttribute(
          "download",
          `${dataMonthName}_${dataYear}_statement.xlsx`
        );
        link.click();

        // Clean up URL to release memory
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      console.error("Error generating Excel:", err);
    }
  };

  // fillerted data in Display Box
  const todayFormatted = moment(today).format("DD/MM/YYYY");

  // Filter out today's data from monthlyHistoryData
  const filteredData = monthlyHistoryData?.data?.filter(
    (data) => data.date !== todayFormatted
  );

  useEffect(() => {
    const [year, month] = selectedMonthYear.split("-");
    // Call getPerDayData with month and year as integers
    dispatch(getMonthlyHistory(parseInt(month, 10), parseInt(year, 10)));
  }, [dispatch, selectedMonthYear]);
  return (
    <>
      <MetaData title={"MONTHLY HISTORY"} />
      <section className="mt-20 lg:ml-72 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto mb-8">
          {/* Stats Overview Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 lg:p-7 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row lg:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg lg:text-xl font-semibold text-neutral-800">
                Monthly Overview
              </h2>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="monthYear"
                  className="text-sm font-medium text-neutral-700"
                >
                  Select Month:
                </label>
                <input
                  className="text-sm bg-white px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors cursor-pointer"
                  type="month"
                  id="monthYear"
                  name="monthYear"
                  value={selectedMonthYear}
                  onChange={(e) => setSelectedMonthYear(e.target.value)}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Total Income */}
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100 hover:shadow-sm transition-shadow">
                <div className="flex flex-col items-center">
                  <div className="p-2 bg-primary-100 rounded-lg mb-2">
                    <FaIndianRupeeSign className="text-primary-600 text-lg" />
                  </div>
                  <p className="text-xs text-neutral-600 mb-1">Total Income</p>
                  {loading ? (
                    <LineSkelton />
                  ) : (
                    <p className="text-lg font-semibold text-success-600">
                      +
                      {new Intl.NumberFormat("en-IN").format(
                        filteredData?.reduce(
                          (acc, data) => acc + (data.totalIncome || 0),
                          0
                        ) || 0
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Cash Amount */}
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100 hover:shadow-sm transition-shadow">
                <div className="flex flex-col items-center">
                  <div className="p-2 bg-violet-100 rounded-lg mb-2">
                    <FaMoneyBill className="text-violet-600 text-lg" />
                  </div>
                  <p className="text-xs text-neutral-600 mb-1">Cash Amount</p>
                  {loading ? (
                    <LineSkelton />
                  ) : (
                    <p className="text-lg font-semibold text-violet-600">
                      +
                      {new Intl.NumberFormat("en-IN").format(
                        filteredData?.reduce(
                          (acc, data) =>
                            acc +
                            (data.totalIncome || 0) -
                            (data.totalOnlineAmount || 0),
                          0
                        ) || 0
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Online Amount */}
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100 hover:shadow-sm transition-shadow">
                <div className="flex flex-col items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mb-2">
                    <FaCreditCard className="text-blue-600 text-lg" />
                  </div>
                  <p className="text-xs text-neutral-600 mb-1">Online Amount</p>
                  {loading ? (
                    <LineSkelton />
                  ) : (
                    <p className="text-lg font-semibold text-blue-600">
                      +
                      {new Intl.NumberFormat("en-IN").format(
                        filteredData?.reduce(
                          (acc, data) => acc + (data.totalOnlineAmount || 0),
                          0
                        ) || 0
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Customers */}
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100 hover:shadow-sm transition-shadow">
                <div className="flex flex-col items-center">
                  <div className="p-2 bg-secondary-100 rounded-lg mb-2">
                    <FaUsers className="text-secondary-600 text-lg" />
                  </div>
                  <p className="text-xs text-neutral-600 mb-1">Customers</p>
                  {loading ? (
                    <LineSkelton />
                  ) : (
                    <p className="text-lg font-semibold text-secondary-600">
                      +
                      {new Intl.NumberFormat("en-IN").format(
                        filteredData?.reduce(
                          (acc, data) => acc + (data.totalCustomers || 0),
                          0
                        ) || 0
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Active Days */}
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100 hover:shadow-sm transition-shadow">
                <div className="flex flex-col items-center">
                  <div className="p-2 bg-success-100 rounded-lg mb-2">
                    <FaCalendarCheck className="text-success-600 text-lg" />
                  </div>
                  <p className="text-xs text-neutral-600 mb-1">Active Days</p>
                  {loading ? (
                    <LineSkelton />
                  ) : (
                    <p className="text-lg font-semibold text-success-600">
                      +
                      {
                        filteredData?.filter((data) => data.totalCustomers > 0)
                          .length
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200 flex  justify-between items-start sm:items-center gap-3">
              <h2 className="text-lg lg:text-xl font-semibold text-neutral-800">
                Daily Transactions
              </h2>
              <div className="flex items-center space-x-2">
                {monthlyHistoryData?.data?.length > 0 && (
                  <button
                    onClick={downloadExcel}
                    className="inline-flex items-center px-3 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-sm"
                  >
                    Download Excel
                    <HiDownload className="ml-1 text-sm" />
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-neutral-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-4 py-8 text-center"
                      >
                        <div className="flex justify-center items-center">
                          <Loader />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {/* ✅ Show banner if user is new (joined today) */}
                      {user?.createdAt &&
                        moment(user.createdAt).isSame(moment(), "day") && (
                          <tr>
                            <td
                              colSpan={columns.length}
                              className="px-4 py-4 text-center"
                            >
                              <div className="flex flex-col items-center justify-center p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700">
                                <FaInfoCircle className="mb-2 text-amber-600 text-lg" />
                                <p className="font-medium text-amber-800">
                                  Welcome! 🎉 You’re visiting for the first
                                  time.
                                </p>
                                <p className="text-sm mt-1 text-amber-700">
                                  Any income generated today will be reflected
                                  from tomorrow.
                                </p>
                                <p className="text-sm mt-2 text-amber-700">
                                  This section always displays your income
                                  history <strong>till yesterday’s date</strong>
                                  , whether or not you actively used the system
                                  on that day.
                                </p>
                                <p className="text-sm mt-3 text-amber-700">
                                  To get started, please{" "}
                                  <Link
                                    to="/earning"
                                    className="font-medium text-amber-800 underline hover:text-amber-900"
                                  >
                                    Earning Section
                                  </Link>{" "}
                                  and add your daily income.
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}

                      {/* ✅ Your actual income history rows */}
                      {monthlyHistoryData?.data?.length > 0 ? (
                        monthlyHistoryData.data.map((dataKey, index) => {
                          const isToday = moment(
                            dataKey.date,
                            "DD/MM/YYYY"
                          ).isSame(moment(), "day");

                          if (isToday) {
                            return (
                              <tr key={index} className="bg-amber-50">
                                <td
                                  colSpan={columns.length}
                                  className="px-4 py-4 text-center"
                                >
                                  <div className="flex flex-col items-center justify-center text-amber-700">
                                    <FaInfoCircle className="mb-1 text-amber-600" />
                                    <span className="font-medium">
                                      {dataKey.date} - Income Updated Soon...
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          }

                          return (
                            <tr
                              key={index}
                              className="hover:bg-neutral-50 transition-colors"
                            >
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-900">
                                {dataKey.date}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                                {dataKey.dayOfWeek || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    dataKey.latestSpecialDay === "Normal"
                                      ? "bg-neutral-100 text-neutral-800"
                                      : "bg-primary-100 text-primary-800"
                                  }`}
                                >
                                  {dataKey.latestSpecialDay || "Normal"}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                                {dataKey.time?.[0] &&
                                moment(dataKey.time[0], "HH:mm").isValid() ? (
                                  moment(dataKey.time[0], "HH:mm").format(
                                    "hh:mm A"
                                  )
                                ) : (
                                  <span className="text-error-600">Closed</span>
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                                {dataKey.time?.[1] &&
                                moment(dataKey.time[1], "HH:mm").isValid() ? (
                                  moment(dataKey.time[1], "HH:mm").format(
                                    "hh:mm A"
                                  )
                                ) : (
                                  <span className="text-error-600">Closed</span>
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-success-600">
                                ₹
                                {new Intl.NumberFormat("en-IN").format(
                                  dataKey.totalIncome || 0
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-violet-600">
                                ₹
                                {new Intl.NumberFormat("en-IN").format(
                                  (dataKey.totalIncome || 0) -
                                    (dataKey.totalOnlineAmount || 0)
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">
                                ₹
                                {new Intl.NumberFormat("en-IN").format(
                                  dataKey.totalOnlineAmount || 0
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-secondary-600">
                                {dataKey.totalCustomers || 0}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={columns.length}
                            className="px-4 py-10 text-center"
                          >
                            <div className="flex flex-col items-center justify-center text-neutral-500">
                              <FaChartLine className="w-10 h-10 mb-2 opacity-50" />
                              <p className="font-medium text-sm">
                                {isAuthenticated
                                  ? "No income data available for the selected month"
                                  : "Please login to view your data"}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AllData;
