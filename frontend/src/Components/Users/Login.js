import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { login, googleLogin, clearError } from "../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MetaData from "../Layouts/MetaData";
import { FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa6";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const { error, loading, isAuthenticated, user } = useSelector(
    (state) => state.user
  );

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Google login success - only for existing users
  const handleSuccess = async (credentialResponse) => {
    try {
      dispatch(googleLogin(credentialResponse.credential));
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  const handleFailure = () => {
    toast.error("Google login failed");
  };

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

    if (isAuthenticated && user) {
      if (!user.isProfileComplete) {
        navigate("/complete-profile");
      } else {
        navigate(redirect);
      }
    }
  }, [
    dispatch,
    error,
    isAuthenticated,
    navigate,
    user,
    redirect,
    location.state,
  ]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <>
      <MetaData title={"LOGIN"} />
      <div className="min-h-screen mt-4 bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-xl border border-neutral-200 shadow-lg p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <FaSignInAlt className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800">
              Welcome Back
            </h1>
            <p className="text-neutral-600 mt-2">
              Sign in to your ashopiy account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-neutral-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="Enter your email address"
                  required
                  className="pl-10 w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-neutral-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  required
                  className="pl-10 pr-10 w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-neutral-400 hover:text-neutral-600" />
                  ) : (
                    <FaEye className="text-neutral-400 hover:text-neutral-600" />
                  )}
                </button>
              </div>

              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
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
                  <FaSpinner className="animate-spin mr-2" />
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <div className="mb-6">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleFailure}
              shape="rectangular"
              size="large"
              width="100%"
              text="continue_with"
              className="w-full"
            />
            <p className="text-xs mt-2 text-neutral-500 text-center">
              Use Google to access your existing account
            </p>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-4 border-t border-neutral-100">
            <p className="text-sm text-neutral-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
