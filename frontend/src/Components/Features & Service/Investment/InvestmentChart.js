import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getInvestment } from "../../../actions/investmentAction";
import axios from "axios";
import InvestmentBarChart from "./InvestmentBarChart";
import { toast } from "react-toastify";
import Loader from "../../Layouts/Loader";
import InvestmentLineChart from "./InvestmentLineChart";
import { UNLOCK_FEATURE_RESET } from "../../../constants/appLockConstant";
import { lockList, unLockFeature } from "../../../actions/appLockAction";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { HiDownload } from "react-icons/hi";
import ExcelJS from "exceljs";
import { useNavigate } from "react-router-dom";

const InvestmentChart = () => {
  const { investments, error, loading } = useSelector(
    (state) => state.investmentData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInvestment());
  }, [dispatch]);

  const [data, setData] = useState({ yearlyIncome: [], yearlyInvestments: [] });
 const navigate = useNavigate();
  useEffect(()=>{
    if (error) {
         toast.error(error);
         if (
           error ===
           "You do not have an active subscription. Please subscribe to access this resource."
         ) {
           navigate("/pricing");
         }
        //  dispatch(clearErrors());
       }
  },[error,navigate]);

  // Fetch the API data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v2/yearlyInvestments`,
          {
            withCredentials: true, // Include cookies with the request
          }
        );
        const { yearlyIncome, yearlyInvestments } = response.data;

        // Merging income and investment data by year
        const mergedData = yearlyIncome.map((income) => {
          const investment =
            yearlyInvestments.find((inv) => inv.year === income.year) || {};
          return {
            year: income.year,
            totalIncome: income.totalIncome,
            totalInvestment: investment.totalInvestment || 0,
          };
        });

        setData(mergedData);
      } catch (err) {
        console.log(err);
      }
    };

    if(!error){
      fetchData();
    }
  }, [dispatch,error]);


  // Prepare the chart data
  const chartData =
    investments?.map((item) => ({
      date: item?.investment?.date || "N/A",
      investmentIncome: item?.investment?.investmentIncome || 0,
      totalEarnings: item?.totalEarnings || 0,
    })) || [];

  // Download Excel
  const downloadExcel = () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Yearly Investment Data");

      // Add header row with bold style and center alignment
      const headerRow = worksheet.addRow([
        "Year",
        "Total Income",
        "Total Investment",
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
      data.forEach((entry) => {
        const profitLoss =
          (entry.totalIncome || 0) - (entry.totalInvestment || 0);
        const isNegative = profitLoss < 0;

        const profitLossFormatted = isNegative
          ? `-₹${new Intl.NumberFormat("en-IN").format(Math.abs(profitLoss))}`
          : `₹${new Intl.NumberFormat("en-IN").format(profitLoss)}`;

        const row = worksheet.addRow([
          entry.year,
          `₹${new Intl.NumberFormat("en-IN").format(entry.totalIncome || 0)}`,
          `₹${new Intl.NumberFormat("en-IN").format(
            entry.totalInvestment || 0
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

        // Apply red color if Profit/Loss is negative
        if (isNegative) {
          row.getCell(4).font = { color: { argb: "FF0000" } }; // Red color
        }
      });

      // Adjust column widths for better visibility
      worksheet.columns = [
        { width: 15 }, // Year
        { width: 20 }, // Total Income
        { width: 20 }, // Total Investment
        { width: 20 }, // Profit/Loss
      ];

      // Generate the Excel file and trigger download
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `yearly_investment_data.xlsx`);
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
    <section className="mt-14 md:mt-20 md:ml-72">
      <>
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
          <div>
            {loading ? (
              <div className="absolute inset-0 flex justify-center items-center">
                <Loader />
              </div>
            ) : (
              <div>
                <InvestmentLineChart chartData={chartData} />
                <InvestmentBarChart data={data} />
                {/* Download investment */}
                {investments?.length > 0 && (
                  <div className=" mt-4 flex gap-4 justify-end items-center mr-4 pb-4">
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
        )}
      </>
    </section>
  );
};

export default InvestmentChart;
