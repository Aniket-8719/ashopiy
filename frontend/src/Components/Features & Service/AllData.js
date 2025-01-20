import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Layouts/Loader";
import { toast } from "react-toastify";
import { clearErrors, getMonthlyHistory } from "../../actions/earningAction";
import ExcelJS from "exceljs";
import moment from "moment-timezone";
import { HiDownload } from "react-icons/hi";
import MetaData from "../Layouts/MetaData";
import LineSkelton from "../Skelton/LineSkelton";
import { lockList, unLockFeature } from "../../actions/appLockAction";
import { UNLOCK_FEATURE_RESET } from "../../constants/appLockConstant";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

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
    { header: "Item Return Customers", key: "totalReturnCustomers" },
    { header: "Loss Amount", key: "totalReturnAmount" },
  ];
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
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
        {
          header: "Item Return Customers",
          key: "totalReturnCustomers",
          width: 20,
        },
        { header: "Loss Amount", key: "totalReturnAmount", width: 15 },
      ];

      // Add header row with bold style and center alignment
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true }; // Make the header bold
      headerRow.alignment = { horizontal: "center", vertical: "middle" }; // Center align header

      let totalIncomeSum = 0;
      let totalCustomersSum = 0;
      let totalOnlineAmountSum = 0;
      let totalReturnCustomersSum = 0;
      let totalReturnAmountSum = 0;
      

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
        totalReturnCustomersSum += row.totalReturnCustomers || 0;
        totalReturnAmountSum += row.totalReturnAmount || 0;
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
        totalReturnCustomersSum, // Subtotal for Item Return Customers
        `₹${new Intl.NumberFormat("en-IN").format(totalReturnAmountSum)} `, // Subtotal for Loss Amount
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

  // Lock/Unlock
  // Lock List
  const { LockList } = useSelector((state) => state.lockUnlockList);

  const {
    loading: unLockPasswordLoading,
    isUnlock,
    error: unLockError,
  } = useSelector((state) => state.unLockFeature);

  // The feature to check
  const checkLockFeature = "History"; // You can dynamically change this value as needed

  // State to manage password pop-up visibility and input
  const [isLocked, setIsLocked] = useState(false);
  const [password, setPassword] = useState("");

  // Assuming LockList is always a single document, as per your description
  const lockedFeatures = LockList[0]?.lockedFeatures || {};

  // Check if the selected feature is locked
  const isFeatureLocked = lockedFeatures[checkLockFeature];

  const handleUnlockClick = () => {
    setIsLocked(true);
  };

  const handlePasswordSubmit = () => {
    // e.preventDefault();
    const addData = {
      featureName: checkLockFeature,
      setPassword: password,
    };
    // Add your logic here to verify the password
    dispatch(unLockFeature(addData));
    setIsLocked(false); // After successful verification, you can unlock the screen
  };

  useEffect(() => {
    dispatch(lockList());
  }, [dispatch]);

  useEffect(() => {
    if (unLockError) {
      toast.error(unLockError);
      console.log("error a gai");
      dispatch(clearErrors());
    }
    if (isUnlock) {
      toast.success("History Unlock");
      dispatch({ type: UNLOCK_FEATURE_RESET });
      dispatch(lockList());
    }
    // Fetch history data only when the feature is unlocked
    if (!isFeatureLocked && selectedMonthYear) {
      // Split selectedMonthYear into year and month
      const [year, month] = selectedMonthYear.split("-");
      // Call getPerDayData with month and year as integers
      dispatch(getMonthlyHistory(parseInt(month, 10), parseInt(year, 10)));
    }
  }, [unLockError, isUnlock, isFeatureLocked, selectedMonthYear, dispatch]);

  const [showPassword, setShowPassword] = useState(false);
  // Toggle function for showing/hiding Set Password
const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <>
      <MetaData title={"MONTHLY HISTORY"} />
      <section className="mt-14 md:mt-20  md:ml-72">
        <>
          <div className="">
            {isFeatureLocked ? (
              <div className="flex flex-col items-center justify-center mt-20">
                <p className="text-xl mb-4">This feature is locked.</p>
                <button
                  onClick={handleUnlockClick}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Unlock Feature
                </button>
                {isLocked && (
                  <div className="flex justify-center items-center mt-4  ">
                     <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
                      />
                      {/* Eye icon for toggling password visibility */}
                      <span
                        className="absolute top-2 inset-y-0 right-3 flex items-center cursor-pointer"
                        onClick={handleTogglePassword} // Toggle for old password
                      >
                        {showPassword ? (
                          <FaEye className="text-gray-500 text-xl" />
                        ) : (
                          <FaEyeSlash className="text-gray-500 text-xl" />
                        )}
                      </span>
                    </div>
                    <button
                      onClick={handlePasswordSubmit}
                      disabled={unLockPasswordLoading}
                      className="flex justify-center items-center ml-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-sm focus:outline-none  focus:border-green-500"
                    >
                      {unLockPasswordLoading ? <Loader /> : "Submit"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // <p>Dikh rha h </p>
              // Feature is Unlcok
              <div>
                {/* Display */}
                <div className="flex flex-col w-full  justify-center items-center border md:border-slate-300 rounded-lg md:shadow-lg ">
                  {/* Box-1 */}
                  <div className="flex justify-center items-center gap-4 p-4 mt-4">
                    <label
                      className="text-xl font-bold text-gray-700"
                      for="date"
                    >
                      Enter Month & Year:
                    </label>
                    <input
                      className="md:text-lg  bg-white p-2 border border-black outline-none cursor-pointer"
                      type="month"
                      id="monthYear"
                      name="monthYear"
                      value={selectedMonthYear}
                      onChange={(e) => setSelectedMonthYear(e.target.value)}
                    />
                  </div>

                  {/* Box-2 */}
                  <div className="flex w-full flex-row md:flex-col md:gap-8 p-4 md:px-20 justify-between  border border-b-0 md:border-slate-300 rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between  w-full  gap-4 md:justify-between">
                      <div className="">
                        <h1 className="text-sm md:text-md">Total Income:</h1>
                        {loading ? (
                          <LineSkelton />
                        ) : (
                          <h1 className="text-xl md:text-2xl text-green-500 font-bold">
                            +
                            {new Intl.NumberFormat("en-IN").format(
                              filteredData?.reduce(
                                (acc, data) => acc + (data.totalIncome || 0),
                                0
                              ) || 0
                            )}
                          </h1>
                        )}
                      </div>
                      <div className="">
                        <h1 className="text-sm md:text-md">Cash Amount:</h1>
                        {loading ? (
                          <LineSkelton />
                        ) : (
                          <h1 className="text-xl md:text-2xl text-violet-700 font-bold">
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
                          </h1>
                        )}
                      </div>
                      <div className=" md:pr-12">
                        <h1 className="text-sm md:text-md">Online Amount:</h1>
                        {loading ? (
                          <LineSkelton />
                        ) : (
                          <h1 className="text-xl md:text-2xl text-blue-500 font-bold">
                            +
                            {new Intl.NumberFormat("en-IN").format(
                              filteredData?.reduce(
                                (acc, data) =>
                                  acc + (data.totalOnlineAmount || 0),
                                0
                              ) || 0
                            )}
                          </h1>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row  w-full justify-between   gap-4 md:justify-between ">
                      <div className="">
                        <h1 className="text-sm md:text-md">Customers:</h1>
                        {loading ? (
                          <LineSkelton />
                        ) : (
                          <h1 className="text-xl md:text-2xl font-bold text-purple-500">
                            +
                            {new Intl.NumberFormat("en-IN").format(
                              filteredData?.reduce(
                                (acc, data) => acc + (data.totalCustomers || 0),
                                0
                              ) || 0
                            )}
                          </h1>
                        )}
                      </div>
                      <div className="">
                        <h1 className="text-sm md:text-md">Active Days</h1>
                        {loading ? (
                          <LineSkelton />
                        ) : (
                          <h1 className="text-xl md:text-2xl font-bold text-green-600">
                            +
                            {
                              filteredData?.filter(
                                (data) => data.totalCustomers > 0
                              ).length
                            }{" "}
                          </h1>
                        )}
                      </div>
                      <div className="">
                        <h1 className="text-sm md:text-md">
                          Item Return Customers:
                        </h1>
                        {loading ? (
                          <LineSkelton />
                        ) : (
                          <h1 className="text-xl md:text-2xl text-yellow-500 font-bold">
                            +
                            {filteredData?.reduce(
                              (acc, data) =>
                                acc + (data.totalReturnCustomers || 0),
                              0
                            )}
                          </h1>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:mt-2 mb-2 md:mb-4 md:px-16 w-full md:justify-between">
                    <div className="pl-4">
                      <h1 className="text-sm md:text-md">Loss Amount:</h1>
                      {loading ? (
                        <LineSkelton />
                      ) : (
                        <h1 className="text-xl md:text-2xl text-red-500 font-bold">
                          +
                          {filteredData?.reduce(
                            (acc, data) => acc + (data.totalReturnAmount || 0),
                            0
                          )}
                        </h1>
                      )}
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white mt-4 overflow-x-auto relative max-h-[700px] md:max-h-[620px] overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-900 text-white sticky top-0 z-10">
                      <tr>
                        {columns.map((col) => (
                          <th
                            key={col.key}
                            scope="col"
                            className="px-6 py-3 text-center text-md font-medium uppercase tracking-wider"
                          >
                            {col.header}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200 text-center relative">
                      {/* Conditionally render the loader inside tbody */}
                      {loading ? (
                        <tr>
                          <td
                            colSpan={columns.length}
                            className="relative h-32"
                          >
                            <div className="absolute inset-0 flex justify-center items-center">
                              <Loader />
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <>
                          {monthlyHistoryData?.data?.length > 0 ? (
                            monthlyHistoryData.data.map((dataKey, index) => {
                              const isToday = moment(
                                dataKey.date,
                                "DD/MM/YYYY"
                              ).isSame(moment(), "day"); // Check if the date is today

                              // Skip rendering today's data and show a placeholder message instead
                              if (isToday) {
                                return (
                                  <tr key={index}>
                                    <td
                                      colSpan={columns.length}
                                      className="px-6 py-4 text-center text-yellow-600"
                                    >
                                      <div className="flex flex-col justify-center items-center">
                                        <span>{dataKey.date}</span>
                                        <span>Income Updated Soon...</span>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }

                              return (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {dataKey.date}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {dataKey.dayOfWeek || "N/A"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {dataKey.latestSpecialDay || "Normal"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {/* Check if open time is valid and format */}
                                    {dataKey.time?.[0] &&
                                    moment(
                                      dataKey.time[0],
                                      "HH:mm"
                                    ).isValid() ? (
                                      moment(dataKey.time[0], "HH:mm").format(
                                        "hh:mm A"
                                      )
                                    ) : (
                                      <span className="text-red-600">
                                        Close
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {/* Check if close time is valid and format */}
                                    {dataKey.time?.[1] &&
                                    moment(
                                      dataKey.time[1],
                                      "HH:mm"
                                    ).isValid() ? (
                                      moment(dataKey.time[1], "HH:mm").format(
                                        "hh:mm A"
                                      )
                                    ) : (
                                      <span className="text-red-600">
                                        Close
                                      </span>
                                    )}
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap">
                                    ₹
                                    {new Intl.NumberFormat("en-IN").format(
                                      dataKey.totalIncome || 0
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    ₹
                                    {new Intl.NumberFormat("en-IN").format(
                                      (dataKey.totalIncome || 0) -
                                        (dataKey.totalOnlineAmount || 0)
                                    )}
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap">
                                    ₹
                                    {new Intl.NumberFormat("en-IN").format(
                                      dataKey.totalOnlineAmount || 0
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {dataKey.totalCustomers || 0}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {dataKey.totalReturnCustomers || 0}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    ₹
                                    {new Intl.NumberFormat("en-IN").format(
                                      dataKey.totalReturnAmount || 0
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              {isAuthenticated ? (
                                <td
                                  colSpan={columns.length}
                                  className="px-6 py-4 text-center"
                                >
                                  No income data available for the selected
                                  month.
                                </td>
                              ) : (
                                <td
                                  colSpan={columns.length}
                                  className="px-6 py-4 text-center"
                                >
                                  Please Login.
                                </td>
                              )}
                            </tr>
                          )}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Download Buttons */}
                <div className="mt-4 flex gap-4 justify-end mr-4">
                  <button
                    onClick={downloadExcel}
                    className="flex justify-center items-center px-4 py-2 my-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Download Excel
                    <span className="font-bold text-md ml-2">
                      <HiDownload />
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      </section>
    </>
  );
};

export default AllData;
