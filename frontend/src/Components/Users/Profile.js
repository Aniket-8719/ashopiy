import React from "react";
import { useSelector } from "react-redux";
import MetaData from "../Layouts/MetaData";
import { Link } from "react-router-dom";
import defaultUserImg from "../assests/default-user-profile-img.png";

const Profile = () => {
  // Get user data from Redux store
  const { user } = useSelector((state) => state.user);

  return (
    <>
      <MetaData title={"PROFILE"} />
      <section className="mt-14 md:mt-20  md:ml-72 ">
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
                {user?.shopName} ({user?.shopType === "Other" ? user?.customShopType : user?.shopType})
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
                  <p className="text-gray-800 font-semibold">{user?.mobileNo}</p>
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
                    {user?.address}, {user?.landmark}, {user?.area}, {user?.city}, {user?.state} -{" "}
                    {user?.pincode}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow">
                  <p className="text-gray-600 text-sm">Country</p>
                  <p className="text-gray-800 font-semibold">{user?.country}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-between gap-4">
              <Link to="/me/update" className="flex justify-center text-sm items-center w-full  bg-blue-600 text-white py-1 px-4 md:py-2 md:px-4 rounded-md hover:bg-blue-700 focus:outline-none">
                Edit Profile
              </Link>
              <Link to="/password/update"  className="flex justify-center  text-sm items-center w-full  bg-yellow-500 text-white py-1 px-4 md:py-2 md:px-4 rounded-md hover:bg-yellow-600 focus:outline-none">
                Change Password
              </Link>
              <button className="flex justify-center text-sm items-center w-full  bg-green-600 text-white py-1 px-4 md:py-2 md:px-4 rounded-md hover:bg-green-700 focus:outline-none">
                Download Complete Data
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
