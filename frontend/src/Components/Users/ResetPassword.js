import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, resetPassword } from "../../actions/userAction";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa6";
import MetaData from "../Layouts/MetaData";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // password visibility
  const [passwordVisibility, setPasswordVisibility] = useState({
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
    const myForm = new FormData();

    myForm.set("password", newPassword);
    myForm.set("confirmPassword", confirmPassword);
    dispatch(resetPassword(token, myForm));
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (success) {
      toast.success("Password Reset successfully");
      navigate("/login");
    }
  }, [dispatch, error, navigate, success]);
  return (
    <>
      <>
        <MetaData title={"RESET PASSWORD"} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center ">
          <div className="w-full max-w-md bg-white shadow-lg rounded-sm p-8">
            {/* Title */}
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Reset Password
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Field */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  id="password"
                  type={passwordVisibility.newPassword ? "text" : "password"}
                  name="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
                />
                {/* Eye icon for toggling password visibility */}
                <span
                  className="absolute top-6 inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => handleTogglePassword("newPassword")} // Toggle for old password
                >
                  {passwordVisibility.newPassword ? (
                    <FaEye className="text-gray-500 text-xl" />
                  ) : (
                    <FaEyeSlash className="text-gray-500 text-xl" />
                  )}
                </span>
              </div>
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="password"
                  type={passwordVisibility.confirmPassword ? "text" : "password"}
                  name="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your confirm password"
                  required
                  className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
                />
                {/* Eye icon for toggling password visibility */}
                <span
                  className="absolute top-6 inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => handleTogglePassword("confirmPassword")} // Toggle for old password
                >
                  {passwordVisibility.confirmPassword ? (
                    <FaEye className="text-gray-500 text-xl" />
                  ) : (
                    <FaEyeSlash className="text-gray-500 text-xl" />
                  )}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? (
                  <div className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Updating...
                  </div>
                ) : (
                  "Update"
                )}
              </button>
            </form>
          </div>
        </div>
      </>
    </>
  );
};

export default ResetPassword;
