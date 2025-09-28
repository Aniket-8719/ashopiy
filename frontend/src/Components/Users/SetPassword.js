import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Layouts/Loader";
import MetaData from "../Layouts/MetaData";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const SetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  // Toggle password visibility
  const handleTogglePassword = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const { data } = await axios.put(
        `${API_URL}/api/v2/password/set`,
        { password },
        config
      );

      toast.success(data.message || "Password set successfully");
      setPassword("");
      setConfirmPassword("");
      navigate("/profile");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaData title="Set Password" />
      <section className="lg:ml-72">
        <div className="min-h-screen bg-gray-100 lg:bg-gray-200 flex items-center justify-center">
          <div className="w-full max-w-md bg-white shadow-lg rounded-sm p-8 mt-14 lg:mt-20">
            {/* Title */}
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Set Password
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Field */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type={passwordVisibility.password ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500"
                  required
                />
                <span
                  className="absolute top-6 inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => handleTogglePassword("password")}
                >
                  {passwordVisibility.password ? (
                    <FaEye className="text-gray-500 text-xl" />
                  ) : (
                    <FaEyeSlash className="text-gray-500 text-xl" />
                  )}
                </span>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type={passwordVisibility.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500"
                  required
                />
                <span
                  className="absolute top-6 inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => handleTogglePassword("confirmPassword")}
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
                {loading ? <Loader /> : "Set Password"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default SetPassword;
