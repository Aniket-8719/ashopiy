import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserDetails,
  deleteUser,
  clearError,
} from "../../actions/userAction";
import { toast } from "react-toastify";
import Loader from "../Layouts/Loader";
import defaultUserImg from "../assests/default-user-profile-img.png";
import SubcriptionDaysOfSingleUser from "./SubcriptionDaysOfSingleUser";
import StorageUsage from "./StorageUsage";
import moment from "moment-timezone";
import { FaEnvelope, FaFileInvoice, FaGlobe, FaIdCard, FaPhone, FaTrash, FaWhatsapp } from "react-icons/fa6";
import { FaEdit, FaMapMarkerAlt } from "react-icons/fa";

const ViewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    loading,
    error,
    user,
    dailyData,
    fullDayData,
    investData,
    DataNumbers,
  } = useSelector((state) => state.singleUser);

  const deleteUserHandler = () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
      toast.success("User Deleted Successfully");
      navigate("/admin/allUsers");
    }
  };
  useEffect(() => {
    if (!user || user._id !== id) {
      dispatch(getUserDetails(id));
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }

  }, [dispatch, id, user]);

  const joiningDate = moment(user?.createdAt).format("DD/MM/YYYY");

  if (loading) {
    return (
      <div className="flex justify-center items-center  md:mt-8  md:ml-72 h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <section className="mt-20 lg:ml-72 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* User Profile Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          {/* Header with Profile Photo */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <img
                src={user?.avatar?.url || defaultUserImg}
                alt="User Profile"
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary-100 shadow-md"
              />
            </div>

            {/* User Info */}
            <h2 className="text-2xl lg:text-3xl font-semibold text-neutral-800 mb-2">
              {user?.Name}
              <span className="text-sm font-normal text-neutral-500 ml-2">
                (Joined: {joiningDate})
              </span>
            </h2>

            <p className="text-neutral-600 text-lg">
              {user?.shopName} •{" "}
              {user?.shopType === "Other"
                ? user?.customShopType
                : user?.shopType}
            </p>
          </div>

          {/* User Details Grid */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Email */}
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-primary-100 rounded-lg mr-3">
                    <FaEnvelope className="text-primary-600 text-sm" />
                  </div>
                  <p className="text-xs text-neutral-600">Email</p>
                </div>
                <p className="text-sm font-medium text-neutral-800">
                  {user?.email || "N/A"}
                </p>
              </div>

              {/* Mobile No. */}
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-primary-100 rounded-lg mr-3">
                    <FaPhone className="text-primary-600 text-sm" />
                  </div>
                  <p className="text-xs text-neutral-600">Mobile No.</p>
                </div>
                <p className="text-sm font-medium text-neutral-800">
                  {user?.mobileNo || "N/A"}
                </p>
              </div>

              {/* WhatsApp No. */}
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-success-100 rounded-lg mr-3">
                    <FaWhatsapp className="text-success-600 text-sm" />
                  </div>
                  <p className="text-xs text-neutral-600">WhatsApp No.</p>
                </div>
                <p className="text-sm font-medium text-neutral-800">
                  {user?.whatsappNo || "N/A"}
                </p>
              </div>

              {/* GST No. */}
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-warning-100 rounded-lg mr-3">
                    <FaFileInvoice className="text-warning-600 text-sm" />
                  </div>
                  <p className="text-xs text-neutral-600">GST No.</p>
                </div>
                <p className="text-sm font-medium text-neutral-800">
                  {user?.gstNo || "N/A"}
                </p>
              </div>

              {/* Address */}
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100 md:col-span-2">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-primary-100 rounded-lg mr-3">
                    <FaMapMarkerAlt className="text-primary-600 text-sm" />
                  </div>
                  <p className="text-xs text-neutral-600">Address</p>
                </div>
                <p className="text-sm font-medium text-neutral-800">
                  {user?.address || "N/A"}
                  {user?.landmark && `, ${user.landmark}`}
                  {user?.area && `, ${user.area}`}
                  {user?.city && `, ${user.city}`}
                  {user?.state && `, ${user.state}`}
                  {user?.pincode && ` - ${user.pincode}`}
                </p>
              </div>

              {/* Country */}
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-primary-100 rounded-lg mr-3">
                    <FaGlobe className="text-primary-600 text-sm" />
                  </div>
                  <p className="text-xs text-neutral-600">Country</p>
                </div>
                <p className="text-sm font-medium text-neutral-800">
                  {user?.country || "N/A"}
                </p>
              </div>

              {/* Agent ID */}
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-secondary-100 rounded-lg mr-3">
                    <FaIdCard className="text-secondary-600 text-sm" />
                  </div>
                  <p className="text-xs text-neutral-600">Agent ID</p>
                </div>
                <p className="text-sm font-medium text-neutral-800">
                  {user?.agentID || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription and Storage Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
              <SubcriptionDaysOfSingleUser user={user} />
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
              <StorageUsage
                dailyData={dailyData}
                fullDayData={fullDayData}
                investData={investData}
                DataNumbers={DataNumbers}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/admin/updateUser/${id}`}
              className="py-3 px-6 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center"
            >
              <FaEdit className="mr-2 text-sm" />
              Edit Profile
            </Link>
            <button
              type="button"
              onClick={deleteUserHandler}
              className="py-3 px-6 bg-error-600 text-white font-medium rounded-lg hover:bg-error-700 transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center"
            >
              <FaTrash className="mr-2 text-sm" />
              Delete User
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewDetails;
