import React, { useEffect, useState, useRef } from "react";
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
import { clearErrors, getPerDayData } from "../../../actions/earningAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Layouts/Loader";
import { toast } from "react-toastify";
import ExcelJS from "exceljs";
import moment from "moment-timezone";
import { HiDownload } from "react-icons/hi";

const DayCharts = () => {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector((state) => state.perDay);
  const indianDate = moment().format("DD/MM/YYYY");
  const today = new Date();
  const defaultMonthYear = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;
  const [selectedMonthYear, setSelectedMonthYear] = useState(defaultMonthYear);
  const chartRef = useRef();

  useEffect(() => {
    // Split selectedMonthYear into year and month
    const [year, month] = selectedMonthYear.split("-");
    // Call getPerDayData with month and year as integers
    dispatch(getPerDayData(parseInt(month, 10), parseInt(year, 10)));
  }, [selectedMonthYear, dispatch]);

  // Check if data is loading or if there is an error
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    toast.error(error);
    dispatch(clearErrors());
  }

  // Excel Download Function
  const downloadExcel = () => {
    try {
      // Ensure data is valid and contains expected values
      if (!data || !data.perDayIncome || !Array.isArray(data.perDayIncome)) {
        throw new Error("Invalid data for Excel export.");
      }

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Per Day Income Data");

      // Add header row with bold style
      const headerRow = worksheet.addRow([
        "Date",
        "Total Income",
        "Customer Count",
      ]);
      headerRow.font = { bold: true }; // Make the header bold

      // Center align header cells
      worksheet.columns.forEach((col) => {
        col.alignment = { horizontal: "center" };
      });

      // Add the data rows
      data.perDayIncome.forEach((row) => {
        worksheet.addRow([
          row.date,
          `₹${new Intl.NumberFormat("en-IN").format(row.totalIncome || 0)}`,
          row.totalCustomers,
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
        link.setAttribute("download", `per_day_data_${selectedMonthYear}.xlsx`);
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
      {/* Day Charts Section */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-lg lg:text-xl font-semibold text-neutral-800">
              Daily Performance
            </h2>
            <p className="text-warning-600 text-sm font-medium mt-1">
              {indianDate} - Income Updated Soon...
            </p>
          </div>
          <div className="mt-4 md:mt-0">
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

        <div className="grid grid-cols-1  gap-8 mb-6">
          {/* Daily Income Chart */}
          <div>
            <h3 className="text-md font-medium text-neutral-700 mb-4 text-center">
              Daily Income
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data.perDayIncome}
                margin={{ top: 0, right: 30, left: 10, bottom: 30 }}
                barSize={20}
              >
                <XAxis
                  dataKey="date"
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
          </div>

          {/* Daily Customers Chart */}
          <div>
            <h3 className="text-md font-medium text-neutral-700 mb-4 text-center">
              Daily Customers
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data.perDayIncome}
                margin={{ top: 0, right: 30, left: 10, bottom: 30 }}
                barSize={20}
              >
                <XAxis
                  dataKey="date"
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
                  dataKey="totalCustomers"
                  fill="#10b981"
                  background={{ fill: "#f3f4f6" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex justify-end">
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

export default DayCharts;
