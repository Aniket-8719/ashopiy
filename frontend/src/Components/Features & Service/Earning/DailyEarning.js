import React, { useEffect, useRef, useState } from "react";
import {
  MdDelete,
  MdModeEdit,
  MdOutlineCategory,
  MdOutlineFolderSpecial,
} from "react-icons/md";
import {
  FaCalendar,
  FaCalendarDay,
  FaIndianRupeeSign,
  FaMoneyBillWave,
  FaStore,
  FaUsers,
} from "react-icons/fa6";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import {
  addTodayEarning,
  clearErrors,
  deleteTodayIncome,
  getTodayEarning,
  updateTodayIncome,
} from "../../../actions/earningAction";
import MetaData from "../../Layouts/MetaData";
import Loader from "../../Layouts/Loader";
import { toast } from "react-toastify";
import {
  ADD_TODAY_EARNING_RESET,
  DELETE_TODAY_EARNING_RESET,
  UPDATE_TODAY_EARNING_RESET,
} from "../../../constants/earningConstants";
import moment from "moment-timezone";
import getHolidayName from "../../../Holiday Library/holidays";
import ExcelJS from "exceljs";
import { HiDownload } from "react-icons/hi";
import LineSkelton from "../../Skelton/LineSkelton";
import { Link, useNavigate } from "react-router-dom";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { getAllProducts } from "../../../actions/productActions";
import { FaCalendarAlt } from "react-icons/fa";

const DailyEarning = () => {
  const columns = [
    { header: "Customers", key: "id" },
    { header: "Earning", key: "earning" },
    { header: "Category", key: "category" },
    { header: "Time", key: "time" },
    { header: "Date", key: "date" },
    { header: "Payment Type", key: "specialDay" },
    { header: "Actions", key: "actions" },
  ];

  // Create a reference for the form section
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [showStats, setShowStats] = useState(true);
  const [holiday, setHoliday] = useState("Normal");
  const [editCheck, setEditCheck] = useState(false);
  const [updateId, setUpdatedID] = useState("");
  const [formData, setFormData] = useState({
    dailyIncome: "",
    earningType: "Cash",
    latestSpecialDay: holiday,
    productCategory: "",
  });

  const { categories } = useSelector((state) => state.allProducts);

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

  // Handle category selection
  const handleCategoryChange = (e) => {
    const selectedCategoryName = e.target.value;
    const selectedCategory = categories.find(
      (cat) => cat.name === selectedCategoryName
    );

    setFormData((prevData) => ({
      ...prevData,
      productCategory: selectedCategoryName,
      dailyIncome: selectedCategory
        ? selectedCategory.price
        : prevData.dailyIncome,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const { dailyIncome, earningType, productCategory } = formData;

    if (!dailyIncome || isNaN(dailyIncome)) {
      toast.error("Please enter a valid amount");
      return;
    }
    const earningData = {
      dailyIncome,
      earningType: earningType || "Cash",
      latestSpecialDay: holiday || "Normal",
      productCategory: productCategory || undefined,
    };

    if (editCheck) {
      dispatch(updateTodayIncome(updateId, earningData));
      setEditCheck(false);
    } else {
      dispatch(addTodayEarning(earningData));
    }
    setFormData({ dailyIncome: "", earningType: "Cash", productCategory: "" });
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
      productCategory: foundIncome.productCategory || "",
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
    dispatch(getAllProducts());
  }, [dispatch]);

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

  return (
    <>
      <MetaData title="EARNING" />
      <section className="mt-20 lg:ml-72 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Add Earning Form */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h2 className="text-lg lg:text-xl font-semibold text-neutral-800 mb-5">
                {editCheck ? "Update Earning" : "Add New Earning"}
              </h2>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIndianRupeeSign className="text-primary-600 text-sm" />
                    </div>
                    <input
                      type="number"
                      id="dailyIncome"
                      name="dailyIncome"
                      required
                      value={formData.dailyIncome}
                      onChange={handleChange}
                      className="pl-10 w-full py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                      placeholder="Enter amount"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdOutlineFolderSpecial className="text-primary-600 text-sm" />
                    </div>
                    <select
                      id="earningType"
                      name="earningType"
                      value={formData.earningType}
                      onChange={handleChange}
                      className="pl-10 w-full py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm appearance-none bg-white"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                </div>

                {categories?.length > 0 && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdOutlineCategory className="text-primary-600 text-sm" />
                    </div>
                    <select
                      id="productCategory"
                      name="productCategory"
                      value={formData.productCategory}
                      onChange={handleCategoryChange}
                      className="pl-10 w-full py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm appearance-none bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories?.map((cat) => (
                        <option key={cat?.name} value={cat?.name}>
                          {cat?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full py-3 flex items-center justify-center text-white font-medium rounded-lg transition-all ${
                    editCheck
                      ? "bg-warning-600 hover:bg-warning-700"
                      : "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                  } shadow-md hover:shadow-lg text-sm`}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader />
                  ) : editCheck ? (
                    "Update Earning"
                  ) : (
                    "Add Earning"
                  )}
                </button>
              </form>
            </div>

            {/* Stats Overview */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg lg:text-xl font-semibold text-neutral-800">
          Today's Overview
        </h2>
        <button
          onClick={() => setShowStats(!showStats)}
          className="flex items-center text-sm text-neutral-600 hover:text-neutral-800 transition"
        >
          {showStats ? (
            <>
              <FiEyeOff className="mr-1" /> Hide
            </>
          ) : (
            <>
              <FiEye className="mr-1" /> Show
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Income */}
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg mr-3">
              <FaIndianRupeeSign className="text-primary-600 text-base" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Total Income</p>
              {loading ? (
                <LineSkelton />
              ) : (
                <p className="text-lg font-semibold text-primary-600">
                  {showStats
                    ? `${isAuthenticated && (todayData?.totalIncome >= 0 ? "+" : "")}₹${new Intl.NumberFormat(
                        "en-IN"
                      ).format(Math.abs(todayData?.totalIncome || 0))}`
                    : "****"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
          <div className="flex items-center">
            <div className="p-2 bg-secondary-100 rounded-lg mr-3">
              <FaUsers className="text-secondary-600 text-base" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Customers</p>
              {loading ? (
                <LineSkelton />
              ) : (
                <p className="text-lg font-semibold text-secondary-600">
                  {showStats
                    ? `+${isAuthenticated ? todayData?.totalCustomerCount || 0 : 0}`
                    : "****"}
                </p>
              )}
            </div>
          </div>
        </div>

       <div className="grid grid-cols-2 w-full gap-4 sm:col-span-2 ">
         {/* Shop Status */}
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg mr-3">
              <FaStore className="text-success-600 text-base" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Shop Status</p>
              {loading ? (
                <LineSkelton />
              ) : (
                <p
                  className={`text-lg font-semibold ${
                    todayData?.totalCustomerCount > 0
                      ? "text-success-600"
                      : "text-error-600"
                  }`}
                >
                  {todayData?.totalCustomerCount > 0 ? "Open" : "Closed"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Special Day */}
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <FaCalendarDay className="text-purple-600 text-base" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Special Day</p>
              {loading ? (
                <LineSkelton />
              ) : (
                <p className="text-lg font-semibold text-purple-600">
                  {holiday || "Regular Day"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Day */}
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <FaCalendar className="text-blue-600 text-base" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Day</p>
              <p className="text-lg font-semibold text-blue-600">{dayName}</p>
            </div>
          </div>
        </div>

        {/* Month */}
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <FaCalendarAlt className="text-purple-600 text-base" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Month</p>
              <p className="text-lg font-semibold text-purple-600">{monthName}</p>
            </div>
          </div>
        </div>
       </div>
      </div>
    </div>
  
          </div>

          {/* Earning Table */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm pb-8">
            <div className="px-6 py-4 border-b border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-lg lg:text-xl font-semibold text-neutral-800">
                Today's Earnings ({`${day}/${month}/${year}`})
              </h2>
              <div className="flex items-center space-x-2">
                {todayData?.todayIncome?.length > 0 && (
                  <>
                    <Link
                      to={"/earning-chart"}
                      className="inline-flex items-center px-3 py-2 text-primary-600 hover:text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors text-sm"
                    >
                      See Performance
                      <LiaExternalLinkAltSolid className="ml-1 text-xs" />
                    </Link>
                    <button
                      onClick={downloadExcel}
                      className="inline-flex items-center px-3 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      Download Excel
                      <HiDownload className="ml-1 text-xs" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    {columns.map(
                      (col) =>
                        // Hide category column if no categories exist
                        !(
                          col.key === "category" && categories?.length === 0
                        ) && (
                          <th
                            key={col.key}
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                          >
                            {col.header}
                          </th>
                        )
                    )}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-neutral-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={
                          columns.length - (categories?.length === 0 ? 1 : 0)
                        }
                        className="px-4 py-8 text-center"
                      >
                        <div className="flex justify-center items-center">
                          <Loader />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {todayData?.todayIncome?.length > 0 ? (
                        todayData.todayIncome.map((dataKey, index) => (
                          <tr
                            key={dataKey.objectId}
                            className="hover:bg-neutral-50 transition-colors"
                          >
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary-600">
                              ₹
                              {new Intl.NumberFormat("en-IN").format(
                                dataKey?.income || 0
                              )}
                            </td>
                            {/* Only show category cell if categories exist */}
                            {categories?.length > 0 && (
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                                {dataKey?.productCategory || "N/A"}
                              </td>
                            )}
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                              {dataKey?.time || "N/A"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                              {todayData?.date || "N/A"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  dataKey?.earningType === "Online"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {dataKey?.earningType || "N/A"}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() =>
                                    updateIncomeHandler(dataKey.objectId)
                                  }
                                  className="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50 transition-colors"
                                  title="Edit"
                                >
                                  <MdModeEdit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    deleteIncomeHandler(dataKey.objectId)
                                  }
                                  className="text-error-600 hover:text-error-900 p-1 rounded-md hover:bg-error-50 transition-colors"
                                  title="Delete"
                                >
                                  <MdDelete className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={
                              columns.length -
                              (categories?.length === 0 ? 1 : 0)
                            }
                            className="px-4 py-10 text-center"
                          >
                            <div className="flex flex-col items-center justify-center text-neutral-500">
                              <FaMoneyBillWave className="w-10 h-10 mb-2 opacity-50" />
                              <p className="font-medium text-sm">
                                No earning records found for today
                              </p>
                              <p className="text-xs mt-1">
                                Add your first earning using the form above
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

export default DailyEarning;
