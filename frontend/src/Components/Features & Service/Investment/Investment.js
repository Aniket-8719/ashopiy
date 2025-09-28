import React, { useEffect, useRef, useState } from "react";
import { MdDelete, MdModeEdit, MdOutlineFolderSpecial } from "react-icons/md";
import {
  FaCalendar,
  FaChartLine,
  FaIndianRupeeSign,
  FaMoneyBillTrendUp,
  FaPiggyBank,
  FaWallet,
} from "react-icons/fa6";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors } from "../../../actions/earningAction";
import MetaData from "../../Layouts/MetaData";
import Loader from "../../Layouts/Loader";
import { toast } from "react-toastify";
import {
  addInvestment,
  deleteInvestment,
  getInvestment,
  updateInvestment,
} from "../../../actions/investmentAction";
import {
  ADD_INVESTMENT_RESET,
  DELETE_INVESTMENT_RESET,
  UPDATE_INVESTMENT_RESET,
} from "../../../constants/investmentConstants";
import ExcelJS from "exceljs";
import { HiDownload } from "react-icons/hi";
import LineSkelton from "../../Skelton/LineSkelton";
import { Link, useNavigate } from "react-router-dom";
import { LiaExternalLinkAltSolid } from "react-icons/lia";

const Investment = () => {
  const columns = [
    { header: "S.R.", key: "s.r." },
    { header: "Date", key: "date" },
    { header: "Day", key: "day" },
    { header: "Time", key: "time" },
    { header: "Investment type", key: "investment type" },
    { header: "Investment amt", key: "investment" },
    { header: "Earning amt", key: "earning amt" },
    { header: "Profit/Loss", key: "profit" },
    { header: "Actions", key: "actions" },
  ];

  // Create a reference for the form section
  const formRef = useRef(null);
  const [editCheck, setEditCheck] = useState(false);
  const [updateId, setUpdatedID] = useState("");
  const [showStats, setShowStats] = useState(true);
  // Set default date to today's date in YYYY-MM-DD format
  // Set default date to the current India date

  const indiaDate = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  }); // Default format YYYY-MM-DD

  const [formData, setFormData] = useState({
    investmentIncomeByUser: "",
    typeOfInvestmentByUser: "",
    customDate: indiaDate,
  });

  // Investment Data
  const { investments, error, loading } = useSelector(
    (state) => state.investmentData
  );

  const { error: addingError, isAdded } = useSelector(
    (state) => state.currentInvestment
  );

  // Delete/Update Investment
  const {
    error: deleteError,
    isDeleted,
    isUpdated,
    message,
  } = useSelector((state) => state.deleteUpdateInvestment);

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
    const { investmentIncomeByUser, typeOfInvestmentByUser, customDate } =
      formData;

    // Validate income input
    if (!investmentIncomeByUser || isNaN(investmentIncomeByUser)) {
      toast.error("Please enter a valid amount");
      return;
    }
    // Validate income input
    if (investmentIncomeByUser <= 0) {
      toast.error("Please enter a positive amount");
      return;
    }

    const earningData = {
      investmentIncomeByUser,
      typeOfInvestmentByUser: typeOfInvestmentByUser || "Normal",
      customDate,
    };
    if (editCheck) {
      dispatch(updateInvestment(updateId, earningData));
      setEditCheck(false);
    } else {
      dispatch(addInvestment(earningData));
    }
    setFormData({ investmentIncomeByUser: "", typeOfInvestmentByUser: "" });
  };

  //   // Handle update income
  const updateIncomeHandler = (id) => {
    formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    window.scrollBy(0, -300);
    const foundIncome = investments.find((item) => item.investment._id === id);
    if (!foundIncome) {
      toast.error(`${id} not found`);
      return;
    }

    // Extract the date in DD/MM/YY format and convert it to YYYY-MM-DD
    const [day, month, year] = foundIncome.investment.date.split("/");
    const formattedDate = `20${year}-${month}-${day}`; // Converts to YYYY-MM-DD format
    setFormData({
      investmentIncomeByUser: foundIncome.investment.investmentIncome,
      typeOfInvestmentByUser: foundIncome.investment.typeOfInvestment,
      customDate: formattedDate,
    });
    // Set edit mode to true
    setEditCheck(true);
    setUpdatedID(foundIncome.investment._id);
  };

  // Handle delete income
  const deleteIncomeHandler = (id) => {
    dispatch(deleteInvestment(id));
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (isAdded || isUpdated || isDeleted) {
      dispatch(getInvestment()); // Re-fetch after add, update, or delete
    }
  }, [dispatch, isAdded, isUpdated, isDeleted]);

  useEffect(() => {
    // Handle error and success messages
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

    if (deleteError) {
      toast.error(deleteError);
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
    if (isAdded) {
      toast.success("Investment Added");
      dispatch({ type: ADD_INVESTMENT_RESET });
    }

    if (isUpdated) {
      toast.success(message);
      dispatch({ type: UPDATE_INVESTMENT_RESET });
    }

    if (isDeleted) {
      toast.success(message);
      dispatch({ type: DELETE_INVESTMENT_RESET });
    }
  }, [
    dispatch,
    navigate,
    error,
    deleteError,
    addingError,
    isAdded,
    isUpdated,
    isDeleted,
    message,
  ]);

  // Calculate totals dynamically when rendering (optional)
  const investingMoney = investments?.reduce(
    (acc, dataKey) => acc + (dataKey?.investment?.investmentIncome || 0),
    0
  );
  const earningMoney = investments?.reduce(
    (acc, dataKey) => acc + (dataKey?.totalEarnings || 0),
    0
  );

  const totalProfitLoss = earningMoney - investingMoney;

  // Download Excel
  const downloadExcel = () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Investment Data");

      // Add header row with bold style
      const headerRow = worksheet.addRow([
        "S.R.",
        "Date",
        "Day",
        "Time",
        "Investment Type",
        "Investment Amount",
        "Earning Amount",
        "Profit/Loss",
      ]);
      headerRow.font = { bold: true };

      // Center align the header row
      headerRow.eachCell((cell) => {
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
      });

      // Add the data rows
      investments.forEach((dataKey, index) => {
        const profitLoss =
          (dataKey.totalEarnings || 0) -
          (dataKey.investment.investmentIncome || 0);
        const isNegative = profitLoss < 0;

        const profitLossFormatted = isNegative
          ? `-${new Intl.NumberFormat("en-IN").format(Math.abs(profitLoss))}`
          : `${new Intl.NumberFormat("en-IN").format(profitLoss)}`;

        const row = worksheet.addRow([
          index + 1,
          dataKey.investment.date || "N/A",
          dataKey.investment.day || "N/A",
          dataKey.investment.time || "N/A",
          dataKey.investment.typeOfInvestment || "Normal",
          `${new Intl.NumberFormat("en-IN").format(
            dataKey.investment.investmentIncome || 0
          )}`,
          `${new Intl.NumberFormat("en-IN").format(
            dataKey.totalEarnings || 0
          )}`,
          profitLossFormatted,
        ]);

        // Center align all data in the row
        row.eachCell((cell) => {
          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };
        });

        // Apply red color if profit/loss is negative
        if (isNegative) {
          row.getCell(8).font = { color: { argb: "FF0000" } }; // Red color for loss
        }
      });

      // Center align all the data rows
      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber !== 1) {
          // Skip the header row
          row.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          }; // Added wrapText: true
        }
      });

      // Add subtotal row with bold style
      const subtotalRow = worksheet.addRow([
        "Subtotal",
        "",
        "",
        "",
        "",
        `₹${new Intl.NumberFormat("en-IN").format(investingMoney || 0)}`,
        `₹${new Intl.NumberFormat("en-IN").format(earningMoney || 0)}`,
        `₹${new Intl.NumberFormat("en-IN").format(totalProfitLoss || 0)}`,
      ]);
      subtotalRow.font = { bold: true }; // Make subtotal bold
      subtotalRow.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      }; // Center align subtotal with text wrap

      // Adjust column widths for better visibility based on the content
      worksheet.columns = [
        { width: 10 }, // S.R.
        { width: 15 }, // Date
        { width: 15 }, // Day
        { width: 10 }, // Time
        { width: 40 }, // Investment Type (set wider to fit long text)
        { width: 30 }, // Investment Amount
        { width: 30 }, // Earning Amount
        { width: 30 }, // Profit/Loss
      ];

      // Generate the Excel file and trigger download
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `investment_data.xlsx`);
        link.click();

        // Clean up URL to release memory
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      console.error("Error generating Excel:", err);
    }
  };

  useEffect(() => {
    dispatch(getInvestment());
  }, [dispatch]);

  return (
    <>
      <MetaData title="INVESTMENT" />
      <>
        <section className="mt-20  lg:ml-72 px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Add Investment Form */}
              <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
                <h2 className="text-lg lg:text-xl font-semibold text-neutral-800 mb-5">
                  {editCheck ? "Update Investment" : "Add New Investment"}
                </h2>
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaIndianRupeeSign className="text-primary-600 text-sm" />
                      </div>
                      <input
                        type="number"
                        id="investmentIncomeByUser"
                        name="investmentIncomeByUser"
                        required
                        value={formData.investmentIncomeByUser}
                        onChange={handleChange}
                        className="pl-10 w-full py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                        placeholder="Investment amount"
                      />
                    </div>

                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendar className="text-primary-600 text-base" />
                      </div>
                      <input
                        type="date"
                        id="customDate"
                        name="customDate"
                        value={formData.customDate}
                        onChange={handleChange}
                        className="pl-10 pr-3 w-full py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm appearance-none"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdOutlineFolderSpecial className="text-primary-600 text-sm" />
                    </div>
                    <input
                      type="text"
                      id="typeOfInvestmentByUser"
                      name="typeOfInvestmentByUser"
                      value={formData.typeOfInvestmentByUser}
                      onChange={handleChange}
                      className="pl-10 w-full py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                      placeholder="Investment description"
                    />
                  </div>

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
                      "Update Investment"
                    ) : (
                      "Add Investment"
                    )}
                  </button>
                </form>
              </div>

              {/* Investment Overview */}
              <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg lg:text-xl font-semibold text-neutral-800">
                    Investment Overview
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

                <div className="space-y-5">
                  {/* Total Investing */}
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 bg-primary-100 rounded-lg mr-3">
                          <FaWallet className="text-primary-600 text-base" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600">
                            Total Investing
                          </p>
                          {loading ? (
                            <LineSkelton />
                          ) : (
                            <p className="text-lg font-semibold text-primary-600">
                              {showStats
                                ? `+₹${new Intl.NumberFormat("en-IN").format(
                                    investingMoney || 0
                                  )}`
                                : "****"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Earnings */}
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 bg-success-100 rounded-lg mr-3">
                          <FaChartLine className="text-success-600 text-base" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600">
                            Total Earnings
                          </p>
                          {loading ? (
                            <LineSkelton />
                          ) : (
                            <p className="text-lg font-semibold text-success-600">
                              {showStats
                                ? `+₹${new Intl.NumberFormat("en-IN").format(
                                    earningMoney || 0
                                  )}`
                                : "****"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profit/Loss */}
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                          <FaMoneyBillTrendUp className="text-purple-600 text-base" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600">
                            Net Profit/Loss
                          </p>
                          {loading ? (
                            <LineSkelton />
                          ) : (
                            <p
                              className={`text-lg font-semibold ${
                                (earningMoney || 0) - (investingMoney || 0) > 0
                                  ? "text-success-600"
                                  : "text-error-600"
                              }`}
                            >
                              {showStats
                                ? `${
                                    (earningMoney || 0) -
                                      (investingMoney || 0) >
                                    0
                                      ? "+"
                                      : ""
                                  }₹${new Intl.NumberFormat("en-IN").format(
                                    (earningMoney || 0) - (investingMoney || 0)
                                  )}`
                                : "****"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Table */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm pb-8">
              <div className="px-6 py-4 border-b border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-lg lg:text-xl font-semibold text-neutral-800">
                  Investment History
                </h2>
                <div className="flex items-center space-x-2">
                  {investments?.length > 0 && (
                    <>
                      <Link
                        to={"/investment-chart"}
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
                        {investments?.length > 0 ? (
                          investments?.map((dataKey, index) => (
                            <tr
                              key={dataKey.investment?.objectId}
                              className="hover:bg-neutral-50 transition-colors"
                            >
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-900">
                                {dataKey?.investment?.date || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                                {dataKey?.investment?.day || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                                {dataKey?.investment?.time || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-normal text-sm text-neutral-600 max-w-xs">
                                {dataKey?.investment?.typeOfInvestment ||
                                  "Normal"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary-600">
                                ₹
                                {new Intl.NumberFormat("en-IN").format(
                                  dataKey?.investment?.investmentIncome || 0
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-success-600">
                                ₹
                                {new Intl.NumberFormat("en-IN").format(
                                  dataKey?.totalEarnings || 0
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                <span
                                  className={`${
                                    (dataKey?.totalEarnings || 0) -
                                      (dataKey?.investment?.investmentIncome ||
                                        0) >
                                    0
                                      ? "text-success-600"
                                      : "text-error-600"
                                  }`}
                                >
                                  {(dataKey?.totalEarnings || 0) -
                                    (dataKey?.investment?.investmentIncome ||
                                      0) >
                                  0
                                    ? "+"
                                    : ""}
                                  ₹
                                  {new Intl.NumberFormat("en-IN").format(
                                    (dataKey?.totalEarnings || 0) -
                                      (dataKey?.investment?.investmentIncome ||
                                        0)
                                  )}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() =>
                                      updateIncomeHandler(
                                        dataKey.investment?._id
                                      )
                                    }
                                    className="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50 transition-colors"
                                    title="Edit"
                                  >
                                    <MdModeEdit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteIncomeHandler(
                                        dataKey.investment?._id
                                      )
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
                              colSpan={columns.length}
                              className="px-4 py-10 text-center"
                            >
                              <div className="flex flex-col items-center justify-center text-neutral-500">
                                <FaPiggyBank className="w-10 h-10 mb-2 opacity-50" />
                                <p className="font-medium text-sm">
                                  No investment records found
                                </p>
                                <p className="text-xs mt-1">
                                  Add your first investment using the form above
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
    </>
  );
};

export default Investment;
