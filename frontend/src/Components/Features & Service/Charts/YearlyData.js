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
import { clearErrors, getYearlyData } from "../../../actions/earningAction";
import Loader from "../../Layouts/Loader";
import { toast } from "react-toastify";
import ExcelJS from 'exceljs';

const YearlyData = () => {
    const dispatch = useDispatch();
    const { data, error, loading } = useSelector((state) => state.yearly);
    useEffect(() => {
        dispatch(getYearlyData());
      }, [ dispatch]);
    
      // Check if data is loading or if there is an error
      if (loading) {
        return <div className="absolute inset-0 flex justify-center items-center"><Loader/></div>;
      }
    
      if (error) {
        toast.error(error);
        dispatch(clearErrors());
      }
    
      const downloadExcel = () => {
        try {
          // Ensure data is valid and contains the expected values
          if (!data || !data.yearlyIncome || !Array.isArray(data.yearlyIncome)) {
            throw new Error("Invalid data for Excel export.");
          }
      
          // Create a new workbook and worksheet
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Yearly Income Data');
      
          // Add header row with bold style
          const headerRow = worksheet.addRow(['Year', 'Total Income', 'Customer Count']);
          headerRow.font = { bold: true }; // Make the header bold
      
          // Center align header cells
          worksheet.columns.forEach((col) => {
            col.alignment = { horizontal: 'center' };
          });
      
          // Add the data rows
          data.yearlyIncome.forEach((row) => {
            worksheet.addRow([row.year, row.totalIncome, row.customerCount]);
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
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'yearly_income_data.xlsx');
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
      <div className=" flex justify-between items-center mt-24 mb-16 mx-8">
        <div className="flex justify-center items-center">
          <h1 className="text-3xl font-bold text-gray-900">Yearly Data</h1>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="50%">
        <BarChart
          width={500}
          height={300}
          data={data.yearlyIncome}
          margin={{
            top: 5,
            right: 30,
            left: 20,
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
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="totalIncome" fill="#8884d8" background={{ fill: "#eee" }} />
          {/* <Bar dataKey="pv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} /> */}
        </BarChart>
      </ResponsiveContainer>

      <div className="flex mt-4 space-x-4 justify-end mx-4 md:mx-8 ">
        <button onClick={downloadExcel}  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Download CSV
        </button>
      </div>
    </>
  );
};

export default YearlyData;
