import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, updatePassword, loadUser } from "../../actions/userAction";
import { toast } from "react-toastify";
import Loader from "../Layouts/Loader";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import MetaData from "../Layouts/MetaData";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, isUpdated, loading } = useSelector(
    (state) => state.profileUpdateDelete
  );

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Generalized toggle function
  const handleTogglePassword = (field) => {
    setPasswordVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field], // Toggle the specific field
    }));
  };
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
      <MetaData title={"UPDATE PASSWORD"} />
      <section className="mt-12 lg:ml-72 px-4 lg:px-6">
        <div className="max-w-md mx-auto py-8">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <FaLock className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800">
              Change Password
            </h1>
            <p className="text-neutral-600 mt-2">
              Secure your account with a new password
            </p>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Old Password Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisibility.oldPassword ? "text" : "password"}
                    name="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full px-4 py-2.5 pr-10 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => handleTogglePassword("oldPassword")}
                  >
                    {passwordVisibility.oldPassword ? (
                      <FaEyeSlash className="text-neutral-400 hover:text-neutral-600" />
                    ) : (
                      <FaEye className="text-neutral-400 hover:text-neutral-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisibility.newPassword ? "text" : "password"}
                    name="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full px-4 py-2.5 pr-10 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => handleTogglePassword("newPassword")}
                  >
                    {passwordVisibility.newPassword ? (
                      <FaEyeSlash className="text-neutral-400 hover:text-neutral-600" />
                    ) : (
                      <FaEye className="text-neutral-400 hover:text-neutral-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={
                      passwordVisibility.confirmPassword ? "text" : "password"
                    }
                    name="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full px-4 py-2.5 pr-10 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => handleTogglePassword("confirmPassword")}
                  >
                    {passwordVisibility.confirmPassword ? (
                      <FaEyeSlash className="text-neutral-400 hover:text-neutral-600" />
                    ) : (
                      <FaEye className="text-neutral-400 hover:text-neutral-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-neutral-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-neutral-700 mb-2">
                  Password Requirements:
                </h4>
                <ul className="text-xs text-neutral-600 space-y-1">
                  <li className="flex items-center">
                    <FaCheckCircle className="w-3 h-3 text-success-600 mr-2" />
                    Minimum 8 characters
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="w-3 h-3 text-success-600 mr-2" />
                    At least one uppercase letter
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="w-3 h-3 text-success-600 mr-2" />
                    At least one number
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="w-3 h-3 text-success-600 mr-2" />
                    At least one special character
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-white font-medium rounded-lg transition-all ${
                  loading
                    ? "bg-neutral-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                } shadow-md hover:shadow-lg`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader />
                    <span className="ml-2">Updating...</span>
                  </div>
                ) : (
                  "Update Password"
                )}
              </button>

              {/* Additional Help */}
              <div className="text-center">
                <p className="text-sm text-neutral-500">
                  Forgot your password?{" "}
                  <a
                    href="/forgot-password"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Reset it here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default UpdatePassword;
