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

const ViewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, user } = useSelector((state) => state.singleUser);

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
  }, [dispatch, id, user, error]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <section className="mt-14 md:mt-8  md:ml-72">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
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
                    <p className="text-gray-600 text-sm">Address</p>
                    <p className="text-gray-800 font-semibold">
                      {user?.address}, {user?.landmark}, {user?.area},{" "}
                      {user?.city}, {user?.state} - {user?.pincode}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg shadow">
                    <p className="text-gray-600 text-sm">Country</p>
                    <p className="text-gray-800 font-semibold">
                      {user?.country}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg shadow">
                    <p className="text-gray-600 text-sm">Agent ID</p>
                    <p className="text-gray-800 font-semibold">
                      {user?.agentID}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-between gap-4">
                <Link
                  to={`/admin/updateUser/${id}`}
                  className=" bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Edit Profile
                </Link>
                <button
                  type="button"
                  onClick={deleteUserHandler}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ViewDetails;
