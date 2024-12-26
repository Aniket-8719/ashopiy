import React, { useEffect, useState } from "react";
import { clearError, login } from "../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Layouts/Loader";
import MetaData from "../Layouts/MetaData";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  // Toggle function for showing/hiding Set Password
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginData.email, loginData.password));
  };

  const redirect = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (isAuthenticated) {
      navigate(redirect);
      toast.success("Login Successfully");
    }
  }, [dispatch, error, navigate, isAuthenticated, redirect]);
  return (
    <>
      <MetaData title={"LOGIN"} />
      <div className="min-h-screen bg-gray-100 md:bg-gray-300 flex items-center justify-center ">
        <div className="w-full max-w-md bg-white shadow-lg rounded-sm p-8">
          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="Enter your email"
                required
                className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
              />
            </div>

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
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="Enter your password"
                required
                className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
              />
              {/* Eye icon for toggling password visibility */}
              <span
                className="absolute top-6 inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={handleTogglePassword} // Toggle for old password
              >
                {showPassword ? (
                  <FaEye className="text-gray-500 text-xl" />
                ) : (
                  <FaEyeSlash className="text-gray-500 text-xl" />
                )}
              </span>
            </div>
            <Link
              to={"/password/forgot"}
              className="mt-2 text-sm text-blue-500"
            >
              Forgot Password
            </Link>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex items-center justify-center  w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? <Loader /> : "Login"}
            </button>
          </form>

          {/* Register Redirect */}
          <p className="mt-6 text-sm text-gray-500 text-center">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 font-medium hover:underline focus:outline-none underline"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
