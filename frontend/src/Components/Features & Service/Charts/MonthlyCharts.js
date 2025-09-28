import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getMonthlyData } from "../../../actions/earningAction";
import Loader from "../../Layouts/Loader";
import ExcelJS from "exceljs";
import { HiDownload } from "react-icons/hi";

const MonthlyCharts = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.monthly);
  const startYear = 1900;
  const endYear = new Date().getFullYear();
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => endYear - i
  );
  const [selectedYear, setSelectedYear] = useState(endYear);

  useEffect(() => {
    dispatch(getMonthlyData(selectedYear));
  }, [selectedYear, dispatch]);

  // Check if data is loading or if there is an error
  if (loading) {
    return (
      <div className=" flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  // if (error) {
  //   toast.error(error);
  //   dispatch(clearErrors());
  // }

  // Excel Download Function
  const downloadExcel = () => {
    try {
      // Ensure data is valid and contains the expected values
      if (!data || !data.monthlyIncome || !Array.isArray(data.monthlyIncome)) {
        throw new Error("Invalid data for Excel export.");
      }

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Monthly Income Data");

      // Add header row with bold style
      const headerRow = worksheet.addRow(["Month", "Total Income"]);
      headerRow.font = { bold: true }; // Make the header bold

      // Center align header cells
      worksheet.columns.forEach((col) => {
        col.alignment = { horizontal: "center" };
      });

      // Add the data rows
      data.monthlyIncome.forEach((row) => {
        worksheet.addRow([
          row.month,
          `₹${new Intl.NumberFormat("en-IN").format(row.totalIncome || 0)}`,
        ]);
      });

      // Adjust column widths for better visibility
      worksheet.columns.forEach((col) => {
        let maxLength = 0;
        col.eachCell({ includeEmpty: true }, (cell) => {
          const length = cell.value ? cell.value.toString().length : 0;
          maxLength = Math.max(maxLength, length);
        });
        col.width = maxLength + 2; // Adding some padding
      });

      // Generate the Excel file and trigger download
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `monthly_income_data_${selectedYear}.xlsx`
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
      {/* Monthly Charts Section */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-lg lg:text-xl font-semibold text-neutral-800">
            Monthly Performance
          </h2>
          <div className="mt-4 md:mt-0">
            <select
              id="year"
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors cursor-pointer"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data.monthlyIncome}
            margin={{ top: 0, right: 30, left: 10, bottom: 30 }}
            barSize={20}
          >
            <XAxis
              dataKey="month"
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar
              dataKey="totalIncome"
              fill="#6366f1"
              background={{ fill: "#f3f4f6" }}
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="flex justify-end mt-4">
          <button
            onClick={downloadExcel}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Download Excel
            <HiDownload className="ml-2" />
          </button>
        </div>
      </div>
    </>
  );
};

export default MonthlyCharts;
