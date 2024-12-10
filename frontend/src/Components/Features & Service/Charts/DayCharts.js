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
  const { data, error,loading } = useSelector((state) => state.perDay);
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
      <div className="flex justify-between items-start mb-8 md:mb-16 mx-2 md:mx-8 mt-24">
        <div className="flex flex-col">
          <h1 className=" text-2xl md:text-3xl font-bold text-gray-900">
            Per Day Data
          </h1>
          <p className="mt-2 text-xs md:text-md text-left font-bold text-yellow-600">{`${indianDate} Income Updated Soon...`}</p>
        </div>
        <input
          className="md:text-lg  bg-white p-2 border border-black outline-none cursor-pointer"
          type="month"
          id="monthYear"
          name="monthYear"
          value={selectedMonthYear}
          onChange={(e) => setSelectedMonthYear(e.target.value)}
        />
      </div>
      <ResponsiveContainer
        width="100%"
        height={300}
        className="md:w-3/4 lg:w-1/2 "
        ref={chartRef}
      >
        <BarChart
          data={data.perDayIncome} // Ensure this is the correct path to your data
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="totalIncome"
            fill="#8884d8"
            background={{ fill: "#eee" }}
          />
          {/* <Bar yAxisId="right" dataKey="totalCustomers" fill="#82ca9d" background={{ fill: "#eee" }} /> */}
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer
        width="100%"
        height={300}
        className="sm:w-full md:w-3/4 lg:w-1/2 "
        ref={chartRef}
      >
        <BarChart
          data={data.perDayIncome} // Ensure this is the correct path to your data
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="totalCustomers"
            fill="#82ca9d"
            background={{ fill: "#eee" }}
          />
          {/* <Bar yAxisId="right" dataKey="totalCustomers" fill="#82ca9d" background={{ fill: "#eee" }} /> */}
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

export default DayCharts;
