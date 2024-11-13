import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Layouts/Loader";
import { toast } from "react-toastify";
import { clearErrors, getTodayEarning } from "../../actions/earningAction";
import * as htmlToImage from "html-to-image";
import ExcelJS from 'exceljs';

const AllData = () => {
  const columns = [
    { header: "Customers", key: "id" },
    { header: "Earning", key: "earning" },
    { header: "Time", key: "time" },
    { header: "Date", key: "date" },
    { header: "Day", key: "day" },
    { header: "Month", key: "month" },
    { header: "Special Day/Customer", key: "specialDay" },
  ];
  const dispatch = useDispatch();
  const { todayData, error, loading } = useSelector(
    (state) => state.todayEarnings
  );
  const indiaDate = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  }); // Default format YYYY-MM-DD
 
  const [SelectedDate, setSelectedDate] = useState(indiaDate);
  // Handle the change in the date input
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Fetch today's earnings and handle toast notifications
  useEffect(() => {
    if (SelectedDate) {
      const dateParts = SelectedDate.split("-"); // Split the selected date (YYYY-MM-DD)
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10);
      const day = parseInt(dateParts[2], 10);

      // Dispatch the action with the selected date values
      dispatch(getTodayEarning(day, month, year));
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [SelectedDate, dispatch, error]);

  // Handle CSV Download
  const downloadExcel = () => {
    try {
      // Ensure todayData is valid and contains the expected data
      if (!todayData || !todayData.todayIncome || !Array.isArray(todayData.todayIncome)) {
        throw new Error("Invalid data for Excel export.");
      }
  
      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Income Data');
  
      // Add header row with bold style
      const headerRow = worksheet.addRow([
       'Customers', 'Earnings', 'Time', 'Date', 'Day', 'Month', 'Special Day/Customer'
      ]);
      headerRow.font = { bold: true }; // Make the header bold
  
      // Apply bold and left alignment to headers
      worksheet.columns.forEach((col) => {
        col.alignment = { horizontal: 'center' };
      });
  
      // Add the data rows
      todayData.todayIncome.forEach((dataKey, index) => {
        worksheet.addRow([
          index + 1, // Index
          `Rs.${dataKey.income || "N/A"}`, // Income
          dataKey.time || "N/A", // Time
          todayData.date || "N/A", // Date
          todayData.day || "N/A", // Day
          todayData.month || "N/A", // Month
          dataKey.specialDay || "N/A", // Special Day
        ]);
      });

      // Add subtotal row with bold and left alignment
      const subtotalRow = worksheet.addRow(
        [
        'Subtotal', // Label for subtotal
        `Rs.${todayData.totalIncome || "0"}`, // Subtotal value
        '', '', '', '', '' // Empty cells for other columns
      ]);
      subtotalRow.font = { bold: true }; // Make subtotal bold
  
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
        link.setAttribute('download', `income_data_${SelectedDate || "N/A"}.xlsx`);
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
      <section className="mt-14 md:mt-20  md:ml-72 h-screen">
        <>
          {/* Display */}
          <div className="flex flex-col w-full gap-8 p-4 justify-center items-center border md:border-slate-300 rounded-lg md:shadow-lg ">
            {/* Box-1 */}
            <div className="flex justify-center items-center gap-4">
              <label className="text-xl font-bold text-gray-700" for="date">
                Enter date:
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={SelectedDate}
                onChange={handleDateChange}
                placeholder="DD/MM/YYYY"
                pattern="\d{2}/\d{2}/\d{4}"
                className="p-1 border border-opacity-75 border-gray-600 rounded-sm bg-white"
              />
            </div>
            {/* Box-2 */}
            <div className="flex justify-center gap-8">
              <div className="">
                <h1 className="text-sm md:text-md">Total Income:</h1>
                <h1 className="text-xl md:text-2xl text-green-500 font-bold">
                  +{todayData?.totalIncome || 0}
                </h1>
              </div>
              <div className="">
                <h1 className="text-sm md:text-md">Customers:</h1>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <h1 className="text-xl md:text-2xl font-bold text-purple-500">
                    +{todayData?.totalCustomerCount || 0}{" "}
                  </h1>
                )}
              </div>
              <div className="">
                <h1 className="text-sm md:text-md">Shop Status:</h1>
                {todayData?.totalCustomerCount > 0 ? (
                  <h1 className="text-md md:text-lg text-green-600">Open</h1>
                ) : (
                  <h1 className="text-md md:text-lg text-red-600">Close</h1>
                )}
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
                    {todayData?.todayIncome?.length > 0 ? (
                      todayData.todayIncome.map((dataKey, index) => (
                        <tr key={dataKey.objectId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {index + 1}.
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Rs.{dataKey?.income || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {dataKey?.time || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {todayData?.date || "N/A"}
                          </td>
                          <td className="px-6 py-4 ">
                            {todayData?.day || "N/A"}
                          </td>
                          <td className="px-6 py-4 ">
                            {todayData?.month || "N/A"}
                          </td>
                          <td className="px-6 py-4 ">
                            {dataKey?.specialDay || "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className=" px-6 py-4 text-center">
                          Enter date and see available income data
                          <span> ( {todayData.date})</span>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
           {/* Download Buttons */}
        <div className="mt-4 flex gap-4 justify-end mr-4">
          <button
            onClick={downloadExcel}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Download CSV
          </button>
          {/* <button
            // onClick={downloadPDF}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Download PDF
          </button> */}
        </div>
        </>
      </section>
    </>
  );
};

export default AllData;
