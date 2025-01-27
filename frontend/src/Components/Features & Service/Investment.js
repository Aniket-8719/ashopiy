import React, { useEffect, useRef, useState } from "react";
import { MdDelete, MdModeEdit, MdOutlineFolderSpecial } from "react-icons/md";
import { FaEye, FaEyeSlash, FaIndianRupeeSign } from "react-icons/fa6";
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
import LineSkelton from "../Skelton/LineSkelton";
import { lockList, unLockFeature } from "../../actions/appLockAction";
import { UNLOCK_FEATURE_RESET } from "../../constants/appLockConstant";
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

  // Lock/Unlock
  // Lock List
  const { LockList } = useSelector((state) => state.lockUnlockList);

  const {
    loading: unLockPasswordLoading,
    isUnlock,
    error: unLockError,
  } = useSelector((state) => state.unLockFeature);

  // The feature to check
  const checkLockFeature = "Investments"; // You can dynamically change this value as needed

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
      console.log("error a gai");
      dispatch(clearErrors());
    }
    if (isUnlock) {
      toast.success("Invesment Unlock");
      dispatch({ type: UNLOCK_FEATURE_RESET });
      dispatch(lockList());

      // After unlocking, fetch investment details
      dispatch(getInvestment());
    }
    // Fetch investment details if the feature is already unlocked
    if (!isFeatureLocked) {
      dispatch(getInvestment());
    }
  }, [unLockError, isUnlock, isFeatureLocked, dispatch]);

  const [showPassword, setShowPassword] = useState(false);
    // Toggle function for showing/hiding Set Password
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <>
      <MetaData title="INVESTMENT" />
      <>
        <section className="mt-14 md:mt-20 md:ml-72 ">
          <div className="">
            {isFeatureLocked ? (
              <div className="flex flex-col items-center justify-center mt-20">
                <p className="text-xl mb-4">{checkLockFeature} is locked.</p>
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
                    <div className="flex flex-col justify-center items-center w-full gap-4">
                      <div className="flex w-full gap-2">
                        <div className="relative flex justify-center items-center w-full focus-within:border-blue-500 focus-within:ring-0.5 focus-within:ring-blue-500">
                          <span className="absolute top-[35%] left-2">
                            <FaIndianRupeeSign className="text-black focus-within:text-blue-500 opacity-65" />
                          </span>
                          <input
                            type="number"
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
                      {loading ? (
                        <Loader />
                      ) : editCheck ? (
                        "Update Investment"
                      ) : (
                        "Add Investment"
                      )}
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
                          <h1 className="text-sm md:text-md">
                            Total Investing:
                          </h1>
                          {loading ? (
                            <LineSkelton />
                          ) : (
                            <h1 className="text-xl md:text-2xl text-purple-500 font-bold">
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
                            <LineSkelton />
                          ) : (
                            <h1 className="text-xl md:text-2xl font-bold text-green-500">
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
                            <LineSkelton />
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
                                      ? `+${new Intl.NumberFormat(
                                          "en-IN"
                                        ).format(result)}`
                                      : new Intl.NumberFormat("en-IN").format(
                                          result
                                        )}
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
                                <td
                                  className="px-6 py-4 whitespace-nowrap break-word"
                                  style={{
                                    wordWrap: "break-word",
                                    whiteSpace: "normal",
                                  }}
                                >
                                  {dataKey?.investment?.typeOfInvestment ||
                                    "Normal"}
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
                                      (dataKey?.investment?.investmentIncome ||
                                        0);

                                    return (
                                      <span
                                        className={`${
                                          result > 0
                                            ? "text-green-500 font-bold"
                                            : "text-red-500 font-bold"
                                        }`}
                                      >
                                        {result > 0
                                          ? `+${new Intl.NumberFormat(
                                              "en-IN"
                                            ).format(result || 0)}`
                                          : `${new Intl.NumberFormat(
                                              "en-IN"
                                            ).format(result || 0)}`}
                                      </span>
                                    );
                                  })()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap  ">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => {
                                        updateIncomeHandler(
                                          dataKey.investment?._id
                                        );
                                      }}
                                      className="rounded-full bg-blue-600 w-[30px] h-[30px] flex items-center justify-center"
                                    >
                                      <div>
                                        <MdModeEdit className="text-white cursor-pointer" />
                                      </div>
                                    </button>
                                    <button
                                      onClick={() =>
                                        deleteIncomeHandler(
                                          dataKey.investment?._id
                                        )
                                      }
                                      className="rounded-full bg-red-600 w-[30px] h-[30px] flex items-center justify-center"
                                    >
                                      <button>
                                        <MdDelete className="flex text-30 text-white cursor-pointer" />
                                      </button>
                                    </button>
                                  </div>
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
                  <div className=" mt-4 flex gap-4 justify-end items-center mr-4 mb-8">
                    <Link to={"/investment-chart"} >
                     <div className="flex justify-center items-center gap-1.5">
                      <div className="text-blue-500">
                        see line chart
                      </div>
                     <LiaExternalLinkAltSolid className="text-blue-500"/>
                     </div>
                    </Link>
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
        </section>
      </>
    </>
  );
};

export default Investment;
