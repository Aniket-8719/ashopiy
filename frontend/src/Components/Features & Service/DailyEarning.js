import React, { useEffect, useRef, useState } from "react";
import { MdDelete, MdModeEdit, MdOutlineFolderSpecial } from "react-icons/md";
import { FaEye, FaEyeSlash, FaIndianRupeeSign } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import {
  addTodayEarning,
  clearErrors,
  deleteTodayIncome,
  getTodayEarning,
  updateTodayIncome,
} from "../../actions/earningAction";
import MetaData from "../Layouts/MetaData";
import Loader from "../Layouts/Loader";
import { toast } from "react-toastify";
import {
  ADD_TODAY_EARNING_RESET,
  DELETE_TODAY_EARNING_RESET,
  UPDATE_TODAY_EARNING_RESET,
} from "../../constants/earningConstants";
import moment from "moment-timezone";
import getHolidayName from "../../Holiday Library/holidays";
import ExcelJS from "exceljs";
import { HiDownload } from "react-icons/hi";
import LineSkelton from "../Skelton/LineSkelton";
import { lockList, unLockFeature } from "../../actions/appLockAction";
import { UNLOCK_FEATURE_RESET } from "../../constants/appLockConstant";
import { useNavigate } from "react-router-dom";
import QRCodeGenerator from "./QRCodeGenerator";

const DailyEarning = () => {
  const columns = [
    { header: "Customers", key: "id" },
    { header: "Earning", key: "earning" },
    { header: "Time", key: "time" },
    { header: "Date", key: "date" },
    { header: "Payment Type", key: "specialDay" },
    { header: "Actions", key: "actions" },
  ];

  // Create a reference for the form section
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [holiday, setHoliday] = useState("Normal");
  const [editCheck, setEditCheck] = useState(false);
  const [updateId, setUpdatedID] = useState("");
  const [formData, setFormData] = useState({
    dailyIncome: "",
    earningType: "Cash",
    latestSpecialDay: holiday,
  });
  const { todayData, error, loading } = useSelector(
    (state) => state.todayEarnings
  );
  const { isAdded, error: addingError } = useSelector(
    (state) => state.currentEarning
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  const {
    error: deleteError,
    isDeleted,
    isUpdated,
    message,
  } = useSelector((state) => state.deleteUpdateEarning);

  const dispatch = useDispatch();

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const { dailyIncome, earningType } = formData;

    if (!dailyIncome || isNaN(dailyIncome)) {
      toast.error("Please enter a valid amount");
      return;
    }
    const earningData = {
      dailyIncome,
      earningType: earningType || "Cash",
      latestSpecialDay: holiday || "Normal",
    };

    if (editCheck) {
      dispatch(updateTodayIncome(updateId, earningData));
      setEditCheck(false);
    } else {
      dispatch(addTodayEarning(earningData));
    }
    setFormData({ dailyIncome: "", earningType: "Cash" });
  };

  // Handle update income
  const updateIncomeHandler = (id) => {
    formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    window.scrollBy(0, -300);
    const foundIncome = todayData.todayIncome.find(
      (item) => item.objectId === id
    );
    if (!foundIncome) {
      toast.error(`${id} not found`);
    }
    setFormData({
      dailyIncome: foundIncome.income,
      earningType: foundIncome.earningType,
    });
    // Set edit mode to true
    setEditCheck(true);
    setUpdatedID(foundIncome.objectId);
  };

  // Handle delete income
  const deleteIncomeHandler = (id) => {
    dispatch(deleteTodayIncome(id));
  };

  // Get the current date and time in Indian Standard Time (IST)
  const todayIST = moment.tz("Asia/Kolkata");
  const day = todayIST.date(); // Get the day of the month in IST
  const month = todayIST.month() + 1; // Get the month in IST (months are 0-indexed in moment.js)
  const year = todayIST.year(); // Get the year in IST

  // Get day name and month name
  const dayName = todayIST.format("dddd"); // Full day name, e.g., "Monday"
  const monthName = todayIST.format("MMMM"); // Full month name, e.g., "December"

  // Call the getHolidayName function
  const holidayName = getHolidayName(day, month, year, "IN");

  // Fetch today's earnings
  useEffect(() => {
    setHoliday(holidayName);
    dispatch(getTodayEarning(day, month, year));
    if (isAdded || isUpdated || isDeleted) {
      dispatch(getTodayEarning(day, month, year)); // Re-fetch after add, update, or delete
    }
  }, [dispatch, isAdded, isUpdated, isDeleted, day, month, year, holidayName]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      if (
        error ===
        "You do not have an active subscription. Please subscribe to access this resource."
      ) {
        navigate("/pricing");
      }
      dispatch(clearErrors());
    }
    if (addingError) {
      toast.error(addingError);
      if (
        addingError ===
        "You do not have an active subscription. Please subscribe to access this resource."
      ) {
        navigate("/pricing");
      }
      dispatch(clearErrors());
    }
    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }
    if (isAdded) {
      toast.success("Income Added");
      dispatch({ type: ADD_TODAY_EARNING_RESET });
    }

    if (isUpdated) {
      toast.success(message);
      dispatch({ type: UPDATE_TODAY_EARNING_RESET });
    }
    if (isDeleted) {
      toast.success(message);
      dispatch({ type: DELETE_TODAY_EARNING_RESET });
    }
  }, [
    dispatch,
    navigate,
    error,
    addingError,
    deleteError,
    isAdded,
    isDeleted,
    isUpdated,
    message,
  ]);

  // Download Excel Data
  const downloadExcel = () => {
    try {
      // Ensure data is valid and contains expected values
      if (
        !todayData ||
        !todayData.todayIncome ||
        !Array.isArray(todayData.todayIncome)
      ) {
        throw new Error("Invalid data for Excel export.");
      }

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Today Income Data");

      // Add header row with bold style
      const headerRow = worksheet.addRow([
        "S.No",
        "Income (Rs)",
        "Time",
        "Date",
        "Earning Type",
      ]);
      headerRow.font = { bold: true }; // Make the header bold

      // Center-align the header cells
      worksheet.columns = [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Income (Rs)", key: "income", width: 15 },
        { header: "Time", key: "time", width: 12 },
        { header: "Date", key: "date", width: 15 },
        { header: "Earning Type", key: "earningType", width: 15 },
      ];

      // Set alignment for all cells in each column
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          cell.alignment = { horizontal: "center" }; // Center align all cells
        });
      });

      // Variable to calculate total income
      let totalIncome = 0;

      // Add the data rows and calculate subtotal
      todayData.todayIncome.forEach((row, index) => {
        totalIncome += row.income || 0; // Add income to the total

        worksheet.addRow({
          sno: index + 1,
          income: `₹${new Intl.NumberFormat("en-IN").format(row.income || 0)}`,
          time: row.time || "N/A",
          date: todayData.date || "N/A",
          earningType: row.earningType || "N/A",
        });
      });
      // Center align all the data rows
      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber !== 1) {
          // Skip the header row
          row.alignment = { horizontal: "center", vertical: "middle" };
        }
      });

      // Add subtotal row
      const subtotalRow = worksheet.addRow([
        "Total",
        `₹${new Intl.NumberFormat("en-IN").format(totalIncome)}`,
        "",
        "",
        "",
      ]);
      subtotalRow.font = { bold: true }; // Make the subtotal row bold

      // Set alignment for subtotal row
      subtotalRow.eachCell((cell) => {
        cell.alignment = { horizontal: "center" }; // Center align subtotal row
      });

      // Adjust column widths for better visibility (optional step)
      worksheet.columns.forEach((col) => {
        let maxLength = 0;
        col.eachCell({ includeEmpty: true }, (cell) => {
          const length = cell.value ? cell.value.toString().length : 0;
          maxLength = Math.max(maxLength, length);
        });
        col.width = Math.max(col.width, maxLength + 2); // Add padding
      });

      // Generate the Excel file and trigger download
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `today_income_data_${new Date().toISOString().slice(0, 10)}.xlsx`
        );
        link.click();

        // Clean up URL to release memory
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      console.error("Error generating Excel:", err);
    }
  };

  // Lock List
  const { LockList } = useSelector((state) => state.lockUnlockList);

  const {
    loading: unLockPasswordLoading,
    isUnlock,
    error: unLockError,
  } = useSelector((state) => state.unLockFeature);

  // The feature to check
  const checkLockFeature = "Earning"; // You can dynamically change this value as needed

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
    if (unLockError) {
      toast.error(unLockError);
      dispatch(clearErrors());
    }
    if (isUnlock) {
      toast.success("Earning Unlock");
      dispatch({ type: UNLOCK_FEATURE_RESET });
      dispatch(lockList());
    }
  }, [unLockError, isUnlock, isFeatureLocked, dispatch]);

  const [showPassword, setShowPassword] = useState(false);
  // Toggle function for showing/hiding Set Password
  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  return (
    <>
      <MetaData title="EARNING" />
      <section className="mt-14 md:mt-20  md:ml-72">
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
                    className="flex justify-center items-center ml-2 mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-sm focus:outline-none  focus:border-green-500"
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
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                {/* Add money */}
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="flex flex-col w-full gap-6 p-4 border md:border-slate-300 rounded-lg md:shadow-sm"
                >
                  <div className="flex justify-center items-center w-full gap-4">
                    <div className="relative flex justify-center items-center w-full focus-within:border-blue-500 focus-within:ring-0.5 focus-within:ring-blue-500">
                      <span className="absolute top-[35%] left-2">
                        <FaIndianRupeeSign className="text-green-600 focus-within:text-blue-500 opacity-65" />
                      </span>
                      <input
                        type="number"
                        id="dailyIncome"
                        name="dailyIncome"
                        required
                        value={formData.dailyIncome}
                        onChange={handleChange}
                        className="py-3 ps-8 w-full text-gray-700 leading-normal border md:border-2 border-slate-300 rounded-sm focus-within:outline-none focus-within:ring-0.5 focus-within:ring-blue-500 focus-within:border-blue-500"
                        placeholder="Enter amount....."
                      />
                    </div>
                    <div className="flex  justify-center items-center w-full border md:border-2 border-slate-300  relative focus-within:border-blue-500 focus-within:ring-0.5 focus-within:ring-blue-500 rounded-sm">
                      <span className="absolute top-[35%] left-2">
                        <MdOutlineFolderSpecial className="text-black focus-within:text-blue-500 opacity-65" />
                      </span>
                      <select
                        id="earningType"
                        name="earningType"
                        value={formData.earningType}
                        onChange={handleChange}
                        className="py-3 ps-8 w-full bg-white text-gray-700 leading-normal focus:outline-none focus:bg-white focus:border-blue-500 rounded-sm"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Online">Online</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={`${
                      editCheck ? "bg-orange-600" : "bg-blue-600 "
                    } py-3 flex items-center justify-center   text-white text-center rounded-sm `}
                    disabled={loading}
                  >
                    {loading ? <Loader /> : editCheck ? "Update" : "Add"}
                  </button>
                </form>

                {/* Total amount display */}
                <div className="flex w-full  mx-auto gap-4  p-4 justify-between items-center border md:border-slate-300 rounded-lg md:shadow-sm ">
                  {/* Box-1 */}
                  <div className="flex flex-col  w-full  gap-2 md:gap-2 md:justify-center ">
                    <div className="">
                      <h1 className="text-sm md:text-md">Total Income:</h1>
                      {loading ? (
                        <LineSkelton />
                      ) : (
                        <h1
                          className={`text-xl md:text-2xl font-bold ${
                            (todayData?.totalIncome || 0) >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {isAuthenticated &&
                            (todayData?.totalIncome >= 0 ? "+" : "-")}
                          {new Intl.NumberFormat("en-IN").format(
                            Math.abs(todayData?.totalIncome || 0)
                          )}
                        </h1>
                      )}
                    </div>
                    <div className="">
                      <h1 className="text-sm md:text-md">Customers:</h1>
                      {loading ? (
                        <LineSkelton />
                      ) : (
                        <h1 className="text-xl md:text-2xl font-bold text-purple-500">
                          {isAuthenticated
                            ? `+${todayData?.totalCustomerCount || 0} `
                            : 0}
                        </h1>
                      )}
                    </div>
                  </div>

                  {/* Box-2 */}
                  <div className="flex flex-col  w-full  gap-4 md:gap-4  md:justify-center ">
                    <div className="">
                      <h1 className="text-sm md:text-md">Day:</h1>
                      <h1 className="text-md md:text-lg">{dayName}</h1>
                    </div>
                    <div className="">
                      <h1 className="text-sm md:text-md">Month:</h1>
                      <h1 className="text-md md:text-lg">{monthName}</h1>
                    </div>
                  </div>

                  {/* Box-3 */}
                  <div className="flex flex-col  w-full  gap-4 md:gap-4  md:justify-center ">
                    <div className="">
                      <h1 className="text-sm md:text-md">Shop Status:</h1>
                      {todayData?.totalCustomerCount > 0 ? (
                        <h1 className="text-md md:text-lg text-green-600">
                          Open
                        </h1>
                      ) : (
                        <h1 className="text-md md:text-lg text-red-600">
                          Close
                        </h1>
                      )}
                    </div>
                    <div className="">
                      <h1 className="text-sm md:text-md">Special Day:</h1>
                      <h1 className="text-md md:text-lg text-purple-600">
                        {holiday}
                      </h1>
                    </div>
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
                        <td colSpan={columns.length} className="relative h-32">
                          <div className="absolute inset-0 flex justify-center items-center">
                            <Loader />
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {todayData?.todayIncome?.length > 0 ? (
                          todayData.todayIncome.map((dataKey, index) => (
                            <tr key={dataKey.objectId}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {index + 1}.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                ₹
                                {new Intl.NumberFormat("en-IN").format(
                                  dataKey?.income || "N/A"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {dataKey?.time || "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {todayData?.date || "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {dataKey?.earningType || "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap flex space-x-2 justify-center items-center">
                                <button
                                  onClick={() => {
                                    updateIncomeHandler(dataKey.objectId);
                                  }}
                                  className="rounded-full bg-blue-600 w-[30px] h-[30px] flex items-center justify-center"
                                >
                                  <div>
                                    <MdModeEdit className="text-white cursor-pointer" />
                                  </div>
                                </button>
                                <button
                                  onClick={() =>
                                    deleteIncomeHandler(dataKey.objectId)
                                  }
                                  className="rounded-full bg-red-600 w-[30px] h-[30px] flex items-center justify-center"
                                >
                                  <button>
                                    <MdDelete className="flex text-30 text-white cursor-pointer" />
                                  </button>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 text-center">
                              No income data available
                              <span> ( {`${day}/${month}/${year}`})</span>
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
              {todayData?.todayIncome?.length > 0 && (
                <div className="flex mt-4 space-x-4 justify-end mx-4 md:mx-8 pb-4">
                  <button
                    onClick={downloadExcel}
                    className="flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Download Excel
                    <span className="font-bold text-md ml-2">
                      <HiDownload />
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* <QRCodeGenerator/> */}
      </section>
    </>
  );
};

export default DailyEarning;
