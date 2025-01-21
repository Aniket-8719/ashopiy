import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../Layouts/MetaData";
import { Link } from "react-router-dom";
import defaultUserImg from "../assests/default-user-profile-img.png";
import { getCompleteData } from "../../actions/earningAction";
import ExcelJS from "exceljs";
import Loader from "../Layouts/Loader";
import { HiDownload } from "react-icons/hi";
import SubscriptionDaysLeft from "../Payment/SubscriptionDaysLeft";
import { MdEdit } from "react-icons/md";

const Profile = () => {
  const dispatch = useDispatch();
  // Local state to track if download is triggered by the user
  const [isDownloadTriggered, setIsDownloadTriggered] = useState(false);
  // Get user data from Redux store
  const { user } = useSelector((state) => state.user);
  const {loading, FullData } = useSelector((state) => state.completeData);

// Download Excel Data
const downloadExcel = useCallback(() => {
  try {
    // Ensure data is valid and contains expected values
    if (!FullData || !Array.isArray(FullData)) {
      throw new Error("Invalid data for Excel export.");
    }

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Full Income Data");

    // Add header row with bold style
    const headerRow = worksheet.addRow([
      "S.No",
      "Date",
      "Day",
      "Latest Special Day",
      "Month",
      "Start Time",
      "End Time",
      "Total Customers",
      "Total Income (Rs)",
      "Total Online Amount",
      "Total Return Amount",
      "Total Return Customers",
    ]);
    headerRow.font = { bold: true }; // Make the header bold

    // Define column settings and center-align header
    worksheet.columns = [
      { header: "S.No", key: "sno", width: 15 },
      { header: "Date", key: "date", width: 18 },
      { header: "Day", key: "day", width: 20 },
      { header: "Latest Special Day", key: "latestSpecialDay", width: 30 },
      { header: "Month", key: "month", width: 12 },
      { header: "Start Time", key: "startTime", width: 15 },
      { header: "End Time", key: "endTime", width: 15 },
      { header: "Total Customers", key: "totalCustomers", width: 20 },
      { header: "Total Income (Rs)", key: "totalIncome", width: 30 },
      { header: "Total Online Amount", key: "totalOnlineAmount", width: 30 },
      { header: "Total Return Amount", key: "totalReturnAmount", width: 30 },
      { header: "Total Return Customers", key: "totalReturnCustomers", width: 20 }
    ];

    // Set alignment for all cells in each column
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    });

    // Variable to calculate total income
    let totalCustomers = 0;
    let totalIncome = 0;
    let totalOnlineAmount = 0;
    let totalReturnAmount = 0;
    let totalReturnCustomers = 0;

    // Add the data rows and calculate subtotal
    FullData.forEach((row, index) => {
      totalCustomers += row.totalCustomers || 0; // Add income to the total
      totalIncome += row.totalIncome || 0; // Add income to the total
      totalOnlineAmount += row.totalOnlineAmount || 0; // Add Online Amount to the total
      totalReturnAmount += row.totalReturnAmount || 0; // Add Return Amount to the total
      totalReturnCustomers += row.totalReturnCustomers || 0; // Add Return Customers to the total

    const dataRow =  worksheet.addRow({
        sno: index + 1,
        date: new Date(row.date).toLocaleDateString("en-GB"),
        day: row.day || "N/A",
        latestSpecialDay: row.latestSpecialDay || "N/A",
        month: row.month || "N/A",
        startTime: row.time[0] || "N/A",
        endTime: row.time[1] || "N/A",
        totalCustomers: row.totalCustomers || 0,
        totalIncome: `₹${new Intl.NumberFormat("en-IN").format(row.totalIncome || 0)}`,
        totalOnlineAmount: `₹${new Intl.NumberFormat("en-IN").format(row.totalOnlineAmount || 0)}`,
        totalReturnAmount: `₹${new Intl.NumberFormat("en-IN").format(row.totalReturnAmount || 0)}`,
        totalReturnCustomers: row.totalReturnCustomers || 0,
      });
       // Center-align each cell in the data row
     dataRow.eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });
    });

    // Add subtotal row
    const subtotalRow = worksheet.addRow([
      "Subtotal",
      "",
      "",
      "",
      "",
      "",
      "",
      `₹${new Intl.NumberFormat("en-IN").format(totalCustomers)}`,
      `₹${new Intl.NumberFormat("en-IN").format(totalIncome)}`,
      `₹${new Intl.NumberFormat("en-IN").format(totalOnlineAmount)}`,
     `₹${new Intl.NumberFormat("en-IN").format(totalReturnAmount)}`,
      `₹${new Intl.NumberFormat("en-IN").format(totalReturnCustomers)}`,
    ]);
    subtotalRow.font = { bold: true }; // Make the subtotal row bold

    // Set alignment for subtotal row
    subtotalRow.eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" }; // Center align subtotal row
    });

    // Adjust column widths for better visibility (optional step)
    worksheet.columns.forEach((col) => {
      let maxLength = 0;
      col.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 0;
        maxLength = Math.max(maxLength, length);
      });
      col.width = Math.max(col.width, maxLength + 2); // Add padding
    });

    // Generate the Excel file and trigger download
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `full_income_data_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      link.click();

      // Clean up URL to release memory
      URL.revokeObjectURL(url);
    });
  } catch (err) {
    console.error("Error generating Excel:", err);
  }
},[FullData]);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDownloadTriggered(true); // Mark that the user has triggered the download
    dispatch(getCompleteData()); // Fetch the data, loading state will be set in Redux
  };

 // Trigger downloadExcel when data is loaded and the user has triggered the download
 useEffect(() => {
  if (!loading && FullData && FullData.length > 0 && isDownloadTriggered) { 
    downloadExcel(); // Trigger download when FullData is ready
    setIsDownloadTriggered(false); // Reset after downloading to avoid multiple downloads
  }
}, [loading, FullData, isDownloadTriggered, downloadExcel]); // Watch isDownloadTriggered state


  return (
    <>
      <MetaData title={"PROFILE"} /> 
      <section className="mt-14 md:mt-10  md:ml-72 ">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full rounded-lg">
            <div className="text-center">
              {/* User Profile Photo */}
              <div className="mb-4">
                <img
                  src={user?.avatar?.url || defaultUserImg}
                  alt="User Profile"
                  className="w-32 h-32 rounded-full mx-auto object-cover"
                />
              </div>
              {/* User Info */}
              <h2 className="text-2xl font-semibold text-gray-800">
                {user?.shopOwnerName}
              </h2>
              <p className="text-gray-600">
                {user?.shopName} (
                {user?.shopType === "Other"
                  ? user?.customShopType
                  : user?.shopType}
                )
              </p>
            </div>

            <div className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="text-gray-800 font-semibold">{user?.email}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Mobile No.</p>
                  <p className="text-gray-800 font-semibold">
                    {user?.mobileNo}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Whatsapp No.</p>
                  <p className="text-gray-800 font-semibold">
                    {user?.whatsappNo}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow">
                 
                  <p className="text-gray-600 text-sm">GST No.</p>
                  <p className="text-gray-800 font-semibold">{user?.gstNo}</p>
                </div>
               

                <div className="bg-gray-50 p-4 rounded-lg shadow">
                <div className="flex gap-2 items-center">
                 <p className="text-gray-600 text-sm">MerchantID </p>
                 <Link to="/user/merchantID" className="p-1 rounded-full bg-blue-500 text-white items-center flex justify-center"><MdEdit/></Link>
                 </div>
                 <p className="text-gray-800 font-semibold">{user?.merchantID}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Address</p>
                  <p className="text-gray-800 font-semibold">
                    {user?.address}, {user?.landmark}, {user?.area},{" "}
                    {user?.city}, {user?.state} - {user?.pincode}, {user?.country}
                  </p>
                </div>

                {/* <div className="bg-gray-50 p-4 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Country</p>
                  <p className="text-gray-800 font-semibold">{user?.country}</p>
                </div> */}
              </div>
            </div>
          <div className="flex flex-col md:flex-row  md:gap-8 items-center w-full">
          <div >
          <SubscriptionDaysLeft/>
          </div>
            {/* Action Buttons */}
            <div className="mt-8 flex flex-col justify-between gap-4 w-full  p-4">

             <div className="flex flex-col md:flex-row gap-4 w-full">
            
             <Link
                to="/me/update"
                className="flex justify-center text-sm items-center w-full  bg-blue-600 text-white  px-4 py-2 md:px-6 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Edit Profile
              </Link>

              <Link
                to="/password/update"
                className="flex justify-center text-sm items-center w-full  bg-yellow-500 text-white px-4 py-2 md:px-6 rounded-md hover:bg-yellow-600 focus:outline-none"
              >
                Change Password
              </Link>
             </div>

             <div className="flex flex-col md:flex-row gap-4 w-full">
             <Link
                to="/lock-feature"
                className="flex justify-center text-sm items-center w-full  bg-purple-600 text-white px-4 py-2 md:px-6 rounded-md hover:bg-purple-700 focus:outline-none"
              >
                App Lock 
              </Link>

              <button
               onClick={handleSubmit}
               disabled={loading}
               className="flex justify-center text-sm items-center w-full gap-2 bg-green-600 text-white px-4 py-2 md:px-6 rounded-md hover:bg-green-700 focus:outline-none">
              {loading ? <Loader/> : "  Download Complete Data"} <div className="text-lg"><HiDownload/></div>
              </button>

             </div>
            </div>
        
          </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
