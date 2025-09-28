import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { register, googleRegister, clearError } from "../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MetaData from "../Layouts/MetaData";
import { FaEye, FaEyeSlash, FaCamera, FaExclamationCircle } from "react-icons/fa";
import { FaEnvelope, FaLock, FaSpinner, FaUser, FaUserPlus, FaUserTie } from "react-icons/fa6";
import defaultImage from "../assests/default-user-profile-img.png";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [roleError, setRoleError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const { error, loading, isAuthenticated, user } = useSelector(
    (state) => state.user
  );

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });

  // Handle file upload
  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setRegisterData({ ...registerData, avatar: e.target.files[0] });
        }
      };

      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
      }
    } else {
      setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    }
  };

  // Google register success
  const handleGoogleSuccess = async (credentialResponse) => {
    if (!selectedRole) {
      setRoleError("Please select your account type");
      return;
    }

    try {
      dispatch(
        googleRegister(credentialResponse.credential, selectedRole)
      );
    } catch (err) {
      console.error("Google registration error:", err);
    }
  };

  const handleGoogleFailure = () => {
    toast.error("Google registration failed");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (!selectedRole) {
      setRoleError("Please select your account type");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append("name", registerData.name);
    formData.append("email", registerData.email);
    formData.append("password", registerData.password);
    formData.append("role", selectedRole);

    if (registerData.avatar) {
      formData.append("avatar", registerData.avatar);
    }

    dispatch(register(formData));
  };

  const handleRoleSelect = (e) => {
    setSelectedRole(e.target.value);
    if (roleError) setRoleError("");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (isAuthenticated && user) {
      if (!user.isProfileComplete) {
        navigate("/complete-profile");
      } else {
        navigate("/");
      }
    }
  }, [dispatch, error, isAuthenticated, navigate, user]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <>
      <MetaData title={"REGISTER"} />
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-xl border border-neutral-200 p-6 lg:p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-semibold text-neutral-800 mb-2">
              Create Account
            </h2>
            <p className="text-neutral-600 text-sm">
              Join us to get started with your business management
            </p>
          </div>

          {/* Profile Photo Upload */}
          <div className="mb-6 flex justify-center">
            <div className="relative h-28 w-28 rounded-full bg-neutral-100 flex items-center justify-center shadow-lg border-2 border-neutral-200">
              <img
                src={avatarPreview ? avatarPreview : defaultImage} 
                alt="Profile Preview"
                className="w-full h-full rounded-full object-cover"
              />
              <label
                htmlFor="avatarUpload"
                className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-primary-700 transition-colors"
              >
                <FaCamera className="text-sm" />
              </label>
              <input
                id="avatarUpload"
                type="file"
                name="avatar"
                accept="image/*"
                onChange={registerDataChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                <FaUser className="text-neutral-400 text-sm" />
              </div>
              <input
                id="name"
                type="text"
                name="name"
                value={registerData.name}
                onChange={registerDataChange}
                placeholder="Enter your full name"
                required
                className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                <FaEnvelope className="text-neutral-400 text-sm" />
              </div>
              <input
                id="email"
                type="email"
                name="email"
                value={registerData.email}
                onChange={registerDataChange}
                placeholder="Enter your email"
                required
                className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                <FaLock className="text-neutral-400 text-sm" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={registerData.password}
                onChange={registerDataChange}
                placeholder="Create a password"
                required
                className="pl-10 pr-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer "
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEye className="text-neutral-500 text-sm" />
                ) : (
                  <FaEyeSlash className="text-neutral-500 text-sm" />
                )}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                <FaLock className="text-neutral-400 text-sm" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={registerDataChange}
                placeholder="Confirm your password"
                required
                className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>

            {/* Role Selection */}
            <div className="relative">
              <div className="absolute mt-4 left-0 pl-3 flex items-center pointer-events-none">
                <FaUserTie className="text-neutral-400 text-sm" />
              </div>
              <select
                id="role"
                value={selectedRole}
                onChange={handleRoleSelect}
                className={`pl-10 w-full py-3 text-neutral-700 border ${
                  roleError ? "border-error-500" : "border-neutral-300"
                } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm appearance-none bg-white`}
                required
              >
                <option value="">Select your role</option>
                <option value="shopkeeper">Shopkeeper</option>
                <option value="worker">Worker</option>
              </select>
              {roleError && (
                <p className="mt-2 text-error-600 text-sm flex items-center">
                  <FaExclamationCircle className="mr-1 text-sm" />
                  {roleError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 flex items-center justify-center text-white font-medium rounded-lg transition-all ${
                loading
                  ? "bg-neutral-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
              } shadow-md hover:shadow-lg text-sm`}
            >
              {loading ? (
                <div className="flex items-center">
                  <FaSpinner className="animate-spin mr-2 text-sm" />
                  Creating Account...
                </div>
              ) : (
                <>
                  <FaUserPlus className="mr-2 text-sm" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-neutral-300"></div>
            <span className="mx-4 text-neutral-500 text-sm">OR</span>
            <div className="flex-grow border-t border-neutral-300"></div>
          </div>

          {/* Google Register Section */}
          <div className="space-y-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              shape="rectangular"
              size="large"
              width="100%"
              text="signup_with"
            />
          </div>

          {/* Login Link */}
          <p className="text-center mt-6 text-neutral-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
