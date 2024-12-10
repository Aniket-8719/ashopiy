import React, { useEffect, useRef, useState } from "react";
import { MdDelete, MdModeEdit, MdOutlineFolderSpecial } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors } from "../../actions/earningAction";
import MetaData from "../Layouts/MetaData";
import Loader from "../Layouts/Loader";
import { toast } from "react-toastify";
import {
  addInvestment,
  deleteInvestment,
  getInvestment,
  updateInvestment,
} from "../../actions/investmentAction";
import {
  ADD_INVESTMENT_RESET,
  DELETE_INVESTMENT_RESET,
  UPDATE_INVESTMENT_RESET,
} from "../../constants/investmentConstants";
import ExcelJS from "exceljs";
import { HiDownload } from "react-icons/hi";

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

  const { investments, error, loading } = useSelector(
    (state) => state.investmentData
  );
  const { isAdded } = useSelector((state) => state.currentInvestment);
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

  useEffect(() => {
    // Fetch today's earnings when the component mounts and after successful add, update, or delete
    dispatch(getInvestment());

    if (isAdded || isUpdated || isDeleted) {
      dispatch(getInvestment()); // Re-fetch after add, update, or delete
    }
  }, [dispatch, isAdded, isUpdated, isDeleted]);

  useEffect(() => {
    // Handle error and success messages
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
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
  }, [dispatch, error, deleteError, isAdded, isUpdated, isDeleted, message]);

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

  // Donwload Excel
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

      // Add the data rows
      investments.forEach((dataKey, index) => {
        worksheet.addRow([
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
          `${new Intl.NumberFormat("en-IN").format(
            (dataKey.totalEarnings || 0) -
              (dataKey.investment.investmentIncome || 0)
          )}`,
        ]);
      });

      // Center align all the data rows
      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber !== 1) {
          // Skip the header row
          row.alignment = { horizontal: "center", vertical: "middle" };
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
      subtotalRow.alignment = { horizontal: "center", vertical: "middle" }; // Center align subtotal

      // Adjust column widths for better visibility
      worksheet.columns.forEach((col) => {
        let maxLength = 0;
        col.eachCell({ includeEmpty: true }, (cell) => {
          const length = cell.value ? cell.value.toString().length : 0;
          maxLength = Math.max(maxLength, length);
        });
        col.width = maxLength + 2;
      });

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

  return (
    <>
      <MetaData title="INVESTMENT" />
      <section className="mt-14 md:mt-20 md:ml-72 h-screen">
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-2">
            {/* Add money */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col w-full gap-6 p-4 border md:border-slate-300 rounded-lg md:shadow-sm"
            >
              <div className="flex flex-col justify-center items-center w-full gap-4">
                <div className="flex w-full gap-2">
                  <div className="relative flex justify-center items-center w-full focus-within:border-blue-500 focus-within:ring-0.5 focus-within:ring-blue-500">
                    <span className="absolute top-[35%] left-2">
                      <FaIndianRupeeSign className="text-black focus-within:text-blue-500 opacity-65" />
                    </span>
                    <input
                      type="text"
                      id="investmentIncomeByUser"
                      name="investmentIncomeByUser"
                      required
                      value={formData.investmentIncomeByUser}
                      onChange={handleChange}
                      className="py-3 ps-8 w-full text-gray-700 leading-normal border md:border-2 border-slate-300 rounded-sm focus-within:outline-none focus-within:ring-0.5 focus-within:ring-blue-500 focus-within:border-blue-500"
                      placeholder="Enter amount....."
                    />
                  </div>
                  <div className="flex  justify-center items-center w-full border md:border-2 border-slate-300  relative focus-within:border-blue-500 focus-within:ring-0.5 focus-within:ring-blue-500 rounded-sm">
                    <input
                      type="date"
                      id="customDate"
                      name="customDate"
                      value={formData.customDate}
                      onChange={handleChange}
                      className="py-2 px-2  ps-6 w-full text-gray-700 leading-normal focus:outline-none focus:bg-white focus:border-blue-500 rounded-sm"
                    />
                  </div>
                </div>
                <div className="flex  justify-center items-center w-full border md:border-2 border-slate-300  relative focus-within:border-blue-500 focus-within:ring-0.5 focus-within:ring-blue-500 rounded-sm">
                  <span className="absolute top-[35%] left-2">
                    <MdOutlineFolderSpecial className="text-black focus-within:text-blue-500 opacity-65" />
                  </span>
                  <input
                    type="text"
                    id="typeOfInvestmentByUser"
                    name="typeOfInvestmentByUser"
                    value={formData.typeOfInvestmentByUser}
                    onChange={handleChange}
                    className="py-3  ps-8 w-full text-gray-700 leading-normal focus:outline-none focus:bg-white focus:border-blue-500 rounded-sm"
                    placeholder="Discription.."
                  />
                </div>
              </div>
              <button
                type="submit"
                className={`${
                  editCheck ? "bg-orange-600" : "bg-blue-600 "
                } py-3 flex items-center justify-center   text-white text-center rounded-sm `}
                disabled={loading}
              >
                {editCheck ? "Update Investment" : "Add Investment"}
              </button>
            </form>

            {/* Total amount display */}
            <div className="flex flex-col w-full gap-4  p-4 md:px-8 justify-center items-center border md:border-slate-300 rounded-lg md:shadow-sm ">
              {/* Box-1 */}
              <h1 className="text-xl md:text-2xl font-bold text-gray-700 md:mb-2">
                Overall Amount
              </h1>
              <div className="flex flex-col  w-full justify-between  mx-2 gap-4 md:gap-8 md:mx-16 ">
                <div className="flex justify-center items-center">
                  <div className="">
                    <h1 className="text-sm md:text-md">Total Investing:</h1>
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <h1 className="text-xl md:text-2xl text-green-500 font-bold">
                        +
                        {new Intl.NumberFormat("en-IN").format(
                          investingMoney || 0
                        )}
                      </h1>
                    )}
                  </div>
                </div>
                <div className="flex justify-between ">
                  <div className="">
                    <h1 className="text-sm md:text-md">Total Earning:</h1>
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <h1 className="text-xl md:text-2xl font-bold text-purple-500">
                        +
                        {new Intl.NumberFormat("en-IN").format(
                          earningMoney || 0
                        )}
                      </h1>
                    )}
                  </div>
                  <div className="">
                    <h1 className="text-sm md:text-md">Profit/Loss:</h1>
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <h1 className="text-xl md:text-2xl font-bold text-purple-500">
                        {(() => {
                          const investing = investingMoney || 0; // Default to 0 if investingMoney is falsy
                          const earning = earningMoney || 0; // Default to 0 if earningMoney is falsy
                          const result = earning - investing; // Calculate the result

                          return (
                            <span
                              className={`${
                                result > 0
                                  ? "text-green-500 font-bold"
                                  : "text-red-500 font-bold"
                              }`}
                            >
                              {result > 0
                                ? `+${new Intl.NumberFormat("en-IN").format(
                                    result
                                  )}`
                                : new Intl.NumberFormat("en-IN").format(result)}
                            </span>
                          );
                        })()}
                      </h1>
                    )}
                  </div>
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
                    {investments?.length > 0 ? (
                      investments?.map((dataKey, index) => (
                        <tr key={dataKey.investment?.objectId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {index + 1}.
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {dataKey?.investment?.date || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {dataKey?.investment?.day || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {dataKey?.investment?.time || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {dataKey?.investment?.typeOfInvestment || "Normal"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ₹
                            {new Intl.NumberFormat("en-IN").format(
                              dataKey?.investment?.investmentIncome || 0
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ₹
                            {new Intl.NumberFormat("en-IN").format(
                              dataKey?.totalEarnings || 0
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {(() => {
                              const result =
                                (dataKey?.totalEarnings || 0) -
                                (dataKey?.investment?.investmentIncome || 0);

                              return (
                                <span
                                  className={`${
                                    result > 0
                                      ? "text-green-500 font-bold"
                                      : "text-red-500 font-bold"
                                  }`}
                                >
                                  {result > 0
                                    ? `+${new Intl.NumberFormat("en-IN").format(
                                        result || 0
                                      )}`
                                    : `${new Intl.NumberFormat("en-IN").format(
                                        result || 0
                                      )}`}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap flex space-x-2 justify-center items-center">
                            <button
                              onClick={() => {
                                updateIncomeHandler(dataKey.investment?._id);
                              }}
                              className="rounded-full bg-blue-600 w-[30px] h-[30px] flex items-center justify-center"
                            >
                              <div>
                                <MdModeEdit className="text-white cursor-pointer" />
                              </div>
                            </button>
                            <button
                              onClick={() =>
                                deleteIncomeHandler(dataKey.investment?._id)
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
                        <td
                          colSpan={columns.length}
                          className="px-6 py-4 text-center"
                        >
                          No income data available
                          {/* <span> ( {InvestmentMoney.date})</span> */}
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Download investment */}
          {investments?.length > 0 && (
            <div className="mt-4 flex gap-4 justify-end mr-4">
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
        </>
      </section>
    </>
  );
};

export default Investment;
