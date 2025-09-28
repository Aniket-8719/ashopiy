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
import {
  MdEdit, 
  MdStore,
  MdWork,
  MdAdminPanelSettings,
  MdLock
} from "react-icons/md";
import {
  FaUser,
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaReceipt,
  FaEnvelope,
  FaMapPin,
} from "react-icons/fa";

const Profile = () => {
  const dispatch = useDispatch();
  const [isDownloadTriggered, setIsDownloadTriggered] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { loading, FullData } = useSelector((state) => state.completeData);

  // Get user role for conditional rendering
  const userRole = user?.role || ""; // Replace with actual user role from user data

  // Download Excel Data function remains the same
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
        {
          header: "Total Return Customers",
          key: "totalReturnCustomers",
          width: 20,
        },
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

        const dataRow = worksheet.addRow({
          sno: index + 1,
          date: new Date(row.date).toLocaleDateString("en-GB"),
          day: row.day || "N/A",
          latestSpecialDay: row.latestSpecialDay || "N/A",
          month: row.month || "N/A",
          startTime: row.time[0] || "N/A",
          endTime: row.time[1] || "N/A",
          totalCustomers: row.totalCustomers || 0,
          totalIncome: `₹${new Intl.NumberFormat("en-IN").format(
            row.totalIncome || 0
          )}`,
          totalOnlineAmount: `₹${new Intl.NumberFormat("en-IN").format(
            row.totalOnlineAmount || 0
          )}`,
          totalReturnAmount: `₹${new Intl.NumberFormat("en-IN").format(
            row.totalReturnAmount || 0
          )}`,
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
  }, [FullData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDownloadTriggered(true);
    dispatch(getCompleteData());
  };

  useEffect(() => {
    if (!loading && FullData && FullData.length > 0 && isDownloadTriggered) {
      downloadExcel();
      setIsDownloadTriggered(false);
    }
  }, [loading, FullData, isDownloadTriggered, downloadExcel]);

  return (
    <>
      <MetaData title={"PROFILE"} />
      <section className="mt-12 lg:mt-16 lg:ml-72 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 lg:p-8 shadow-sm mb-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                <img
                  src={user?.avatar?.url || defaultUserImg}
                  alt="Profile"
                  className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <Link
                  to="/me/update"
                  className="absolute -bottom-1 -right-1 bg-primary-600 text-white p-1.5 lg:p-2 rounded-full shadow-md hover:bg-primary-700 transition-colors"
                  aria-label="Edit profile"
                >
                  <MdEdit className="text-sm lg:text-base" />
                </Link>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-col lg:flex-row lg:items-start  gap-4 lg:gap-16 mb-4 lg:mb-6">
                  <div className="space-y-2 lg:space-y-3">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-800">
                      {user?.Name}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                      {/* Role Badge */}
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                          userRole === "shopkeeper"
                            ? "bg-secondary-100 text-secondary-800"
                            : userRole === "admin"
                            ? "bg-primary-100 text-primary-800"
                            : "bg-neutral-100 text-neutral-800"
                        }`}
                      >
                        {userRole === "shopkeeper" ? (
                          <>
                            <MdStore className="w-3 h-3 mr-1.5" />
                            Shopkeeper
                          </>
                        ) : userRole === "admin" ? (
                          <>
                            <MdAdminPanelSettings className="w-3 h-3 mr-1.5" />
                            Admin
                          </>
                        ) : (
                          <>
                            <MdWork className="w-3 h-3 mr-1.5" />
                            Worker
                          </>
                        )}
                      </span>

                      {/* Shop Name Badge (only for shopkeepers) */}
                      {userRole === "shopkeeper" || "admin" && user?.shopName && (
                        <span className="inline-flex items-center px-3 py-1.5 bg-success-100 text-success-800 rounded-full text-xs font-medium">
                          <MdStore className="w-3 h-3 mr-1.5" />
                          {user.shopName}
                        </span>
                      )}
                    </div>

                    {/* Business Type */}
                <p className="text-neutral-600 text-sm lg:text-base">
                  {userRole === "shopkeeper" || "admin" ? (
                    <>
                      {user?.shopType === "Other"
                        ? user?.customShopType
                        : user?.shopType}
                    </>
                  ) : (
                    "Service Professional"
                  )}
                </p>
                  </div>

                  {/* Subscription Status */}
                  <div className="flex justify-center lg:justify-end">
                    <SubscriptionDaysLeft />
                  </div>
                </div>

                
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Personal Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information Card */}
              <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-primary-100 rounded-lg mr-3">
                    <FaUser className="text-primary-600 text-lg" />
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-800">
                    Contact Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-4 bg-neutral-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <FaPhone className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Mobile</p>
                      <p className="font-medium text-neutral-800">
                        {user?.mobileNo || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-neutral-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <FaWhatsapp className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">WhatsApp</p>
                      <p className="font-medium text-neutral-800">
                        {user?.whatsappNo || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-neutral-50 rounded-lg md:col-span-2">
                    <div className="p-2 bg-primary-100 rounded-lg mr-3">
                      <FaEnvelope className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Email</p>
                      <p className="font-medium text-neutral-800">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {userRole === "shopkeeper" && user?.gstNo && (
                    <div className="flex items-center p-4 bg-neutral-50 rounded-lg md:col-span-2">
                      <div className="p-2 bg-warning-100 rounded-lg mr-3">
                        <FaReceipt className="text-warning-600" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600">GST Number</p>
                        <p className="font-medium text-neutral-800">
                          {user.gstNo}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information Card */}
              <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-error-100 rounded-lg mr-3">
                    <FaMapMarkerAlt className="text-error-600 text-lg" />
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-800">
                    Address Information
                  </h2>
                </div>

                <div className="bg-neutral-50 p-6 rounded-lg">
                  {user?.address || user?.city || user?.pincode ? (
                    <div className="space-y-2">
                      {user?.address && (
                        <p className="text-neutral-800 flex items-center">
                          <FaMapPin className="text-neutral-400 mr-2 text-sm" />
                          {user.address}
                        </p>
                      )}
                      {user?.landmark && (
                        <p className="text-neutral-600 text-sm">
                          Landmark: {user.landmark}
                        </p>
                      )}
                      {user?.area && (
                        <p className="text-neutral-600 text-sm">
                          Area: {user.area}
                        </p>
                      )}
                      <p className="text-neutral-600">
                        {user?.city && <>{user.city}, </>}
                        {user?.state && <>{user.state} - </>}
                        {user?.pincode && <>{user.pincode}</>}
                      </p>
                    </div>
                  ) : (
                    <p className="text-neutral-500 text-center">
                      No address information provided
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Actions and Additional Info */}
            <div className="space-y-8">
              {/* Quick Actions Card */}
              <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-neutral-800 mb-6">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  {user?.isProfileComplete ? (
                    <Link
                      to="/me/update"
                      className="flex items-center justify-between p-4 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      <span>Edit Profile</span>
                      <MdEdit className="text-primary-600" />
                    </Link>
                  ) : (
                    <Link
                      to="/complete-profile"
                      className="flex items-center justify-between p-4 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      <span>Complete your Profile</span>
                      <MdEdit className="text-primary-600" />
                    </Link>
                  )}

                  {user?.isPasswordSet ? (
                    <Link
                      to="/password/update"
                      className="flex items-center justify-between p-4 bg-warning-50 text-warning-700 rounded-lg hover:bg-warning-100 transition-colors"
                    >
                      <span>Change Password</span>
                      <MdLock className="text-warning-600" />
                    </Link>
                  ) : (
                    <Link
                      to="/password/set"
                      className="flex items-center justify-between p-4 bg-warning-50 text-warning-700 rounded-lg hover:bg-warning-100 transition-colors"
                    >
                      <span>Set Password</span>
                      <MdLock className="text-warning-600" />
                    </Link>
                  )}

                  {userRole === "shopkeeper" || "admin"
                     && (
                      <Link
                        to="/user/merchantID"
                        className="flex items-center justify-between p-4 bg-secondary-50 text-secondary-700 rounded-lg hover:bg-secondary-100 transition-colors"
                      >
                        <span>{user.merchantID}</span>
                        <MdEdit className="text-secondary-600" />
                      </Link>
                    )}

                  {userRole === "shopkeeper" ||
                    ("admin" && (
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full flex items-center justify-between p-4 bg-success-50 text-success-700 rounded-lg hover:bg-success-100 transition-colors disabled:opacity-50"
                      >
                        <span>Download Complete Data</span>
                        {loading ? (
                          <Loader size="small" />
                        ) : (
                          <HiDownload className="text-success-600" />
                        )}
                      </button>
                    ))}
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
