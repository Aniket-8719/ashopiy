import React, { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {  getYearlyData } from "../../../actions/earningAction";
import Loader from "../../Layouts/Loader";
import { toast } from "react-toastify";
import ExcelJS from "exceljs";
import { HiDownload } from "react-icons/hi";

const YearlyData = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.yearly);

  useEffect(() => {
    dispatch(getYearlyData());
  }, [dispatch]);

  // useEffect(() => {
  //   if (error) {
  //     toast.error(error);
  //     dispatch(clearErrors());
  //   }
  // }, [error, dispatch]);

  // Check if data is loading or if there is an error
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  // if (!data || !data.yearlyIncome) {
  //     return <div>No data available</div>;
  // }

 // Download Excel
const downloadExcel = () => {
    try {
      // Ensure data is valid and contains the expected values
      if (!data.yearlyIncome || !Array.isArray(data.yearlyIncome)) {
        throw new Error("Invalid data for Excel export.");
      }
  
      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Yearly Income Data");
  
      // Add header row with bold style
      const headerRow = worksheet.addRow(["Year", "Total Income"]);
      headerRow.font = { bold: true }; // Make the header bold
  
      // Center align header cells
      worksheet.columns.forEach((col) => {
        col.alignment = { horizontal: "center" };
      });
  
      // Add the data rows
      data.yearlyIncome.forEach((row) => {
        worksheet.addRow([
          row.year,
          `₹${new Intl.NumberFormat("en-IN").format(row.totalIncome || 0)}`,
        ]);
      });
  
      // Calculate the subtotal of totalIncome
      const totalIncomeSubtotal = data.yearlyIncome.reduce(
        (acc, row) => acc + (row.totalIncome || 0),
        0
      );
  
      // Add a row for the subtotal
      const subtotalRow = worksheet.addRow([
        "Subtotal",
        `₹${new Intl.NumberFormat("en-IN").format(totalIncomeSubtotal)}`,
      ]);
  
      // Style the subtotal row
      subtotalRow.font = { bold: true }; // Make the subtotal row bold
      subtotalRow.alignment = { horizontal: "center" }; // Center-align the subtotal row
  
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
        link.setAttribute("download", "yearly_income_data.xlsx");
        link.click();
  
        // Clean up URL to release memory
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      toast.error(err.message || "An error occurred while downloading the Excel file.");
    }
  };
  

  return (
    <>
      <div className=" flex justify-start items-center mt-16 mb-8 md:mb-8 mx-2 md:mx-8">
        <div className="flex justify-center items-center md:mx-0">
          <h1 className="text-xl font-bold mb-4 text-gray-700 p-4">
            Yearly Data
          </h1>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="50%">
        <BarChart
          width={500}
          height={300}
          data={data.yearlyIncome}
          margin={{
            top: 0,
            right: 30,
            left: 10,
            bottom: 5,
          }}
          barSize={20}
        >
          <XAxis
            dataKey="year"
            scale="point"
            padding={{ left: 10, right: 10 }}
          />
          <YAxis />
          <Tooltip />
         <Legend verticalAlign="top" height={36}/>
          <CartesianGrid strokeDasharray="3 3" />
          <Bar
            dataKey="totalIncome"
            fill="#8884d8"
            background={{ fill: "#eee" }}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex mt-4 space-x-4 justify-end mx-4 md:mx-8 ">
        <button
          onClick={downloadExcel}
          className="flex justify-center items-center px-4 py-2 my-4 bg-blue-500 text-white rounded hover:bg-blue-600"
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

export default YearlyData;
