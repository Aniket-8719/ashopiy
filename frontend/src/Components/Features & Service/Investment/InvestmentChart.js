import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getInvestment } from "../../../actions/investmentAction";
import axios from "axios";
import InvestmentBarChart from "./InvestmentBarChart";
import { toast } from "react-toastify";
import Loader from "../../Layouts/Loader";
import InvestmentLineChart from "./InvestmentLineChart";
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
  useEffect(() => {
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
  }, [error, navigate]);

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

    if (!error) {
      fetchData();
    }
  }, [dispatch, error]);

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

  return (
    <section className="mt-20 lg:ml-72 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {investments?.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 shadow-sm">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-neutral-100 rounded-full mb-4">
                <svg
                  className="w-12 h-12 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-neutral-600 text-lg mb-2">
                No Investment Data Found
              </p>
              <p className="text-neutral-500 text-sm">
                Start adding investments to see your performance charts
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {loading ? (
              <div className="bg-white rounded-xl border border-neutral-200 p-8 shadow-sm flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : (
              <div className="space-y-6">
                <InvestmentLineChart chartData={chartData} />
                <InvestmentBarChart data={data} />

                {/* Download Button */}
                {investments?.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      onClick={downloadExcel}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all shadow-md hover:shadow-lg text-sm"
                    >
                      <HiDownload className="mr-2 text-sm" />
                      Download Excel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default InvestmentChart;
