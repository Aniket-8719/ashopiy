import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, updatePassword, loadUser } from "../../actions/userAction";
import { toast } from "react-toastify";
import Loader from "../Layouts/Loader";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import MetaData from "../Layouts/MetaData";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, isUpdated, loading } = useSelector((state) => state.profileUpdateDelete);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const allPasswordData = new FormData();

    allPasswordData.set("oldPassword", oldPassword);
    allPasswordData.set("newPassword", newPassword);
    allPasswordData.set("confirmPassword", confirmPassword);
    dispatch(updatePassword(allPasswordData));
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (isUpdated) {
      toast.success("Password updated successfully");
      dispatch(loadUser());
      navigate("/profile");
      dispatch({
        type: UPDATE_PASSWORD_RESET,
      });
    }
  }, [dispatch, error, isUpdated, navigate]);
  return (
    <>
      <MetaData title={"UPDATE PASSWORD"}/>
      <section className="md:ml-72">
     <div className="min-h-screen bg-gray-100 md:bg-gray-200 flex items-center justify-center ">
        <div className="w-full max-w-md bg-white shadow-lg rounded-sm p-8 mt-14 md:mt-20  ">
          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Change Password
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
               Old Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={oldPassword}
                onChange={(e)=>setOldPassword(e.target.value)}
                placeholder="Enter your Old password"
                required
                className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={newPassword}
                onChange={(e)=>setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                placeholder="Enter your confirm password"
                required
                className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
             {loading ? (
                 <Loader/>
                ) : (
                  "Update"
                )}
            </button>
          </form>
        </div>
      </div>
      </section>
      
    </>
  )
}

export default UpdatePassword
