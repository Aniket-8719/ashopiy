import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, resetPassword } from "../../actions/userAction";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa6";
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
        <MetaData title={"RESET PASSWORD"}/>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center ">
        <div className="w-full max-w-md bg-white shadow-lg rounded-sm p-8">

          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Reset Password
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Field */}
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