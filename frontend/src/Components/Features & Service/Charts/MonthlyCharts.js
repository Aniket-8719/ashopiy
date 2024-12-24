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
import { clearErrors, getMonthlyData } from "../../../actions/earningAction";
import Loader from "../../Layouts/Loader";
import { toast } from "react-toastify";
import ExcelJS from "exceljs";
import { HiDownload } from "react-icons/hi";

const MonthlyCharts = () => {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector((state) => state.monthly);
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
      <div className="flex justify-between items-center  mb-8 md:mb-8 mr-2 md:mx-8 ">
        <div className="flex justify-center items-center mx-2 md:mx-0">
          <h1 className=" text-2xl md:text-3xl font-bold text-gray-900">
            Monthly Data
          </h1>
        </div>

        <div className="flex items-center justify-center text-xl border border-black  outline-none rounded-sm focus-within:border-blue-500 ">
          <select
            id="year"
            className="border-none outline-none focus:outline-none focus:ring-0 bg-white px-4 py-1 cursor-pointer"
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
      <ResponsiveContainer width="100%" height="50%">
        <BarChart
          width={500}
          height={300}
          data={data.monthlyIncome}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={20}
        >
          <XAxis
            dataKey="month"
            scale="point"
            padding={{ left: 10, right: 10 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar
            dataKey="totalIncome"
            fill="#8884d8"
            background={{ fill: "#eee" }}
          />
          {/* <Bar dataKey="pv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} /> */}
        </BarChart>
      </ResponsiveContainer>
      <div className="flex mt-4 space-x-4 justify-end mx-4 md:mx-8 ">
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
    </>
  );
};

export default MonthlyCharts;
