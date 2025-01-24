import React, { useEffect, useState } from "react";
import { FaLock, FaUnlock } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  lockFeature,
  lockList,
} from "../../actions/appLockAction"; // Import your Redux action
import { toast } from "react-toastify";
import { LOCK_FEATURE_RESET } from "../../constants/appLockConstant";
import Loader from "../Layouts/Loader";
import { useNavigate } from "react-router-dom";

const LockFeature = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isLock, error } = useSelector((state) => state.lockFeature);
  const { LockList } = useSelector((state) => state.lockUnlockList);

  // Assuming LockList is always a single document
  const lockedFeatures = LockList[0]?.lockedFeatures || {};

  const [features, setFeatures] = useState({
    Earning: false,
    Charts: false,
    Investments: false,
    UdharBook: false,
    History: false,
    Profile: false,
  });
  const [setPassword, setSetPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPasswordInput, setShowLoginPasswordInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Toggle function for showing/hiding Set Password
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  // Toggle function for showing/hiding Login Password
  const handleToggleLoginPassword = () => setShowLoginPassword((prev) => !prev);

  // Handle toggle for features
  const handleFeatureToggle = (featureName) => {
    setFeatures((prev) => ({
      ...prev,
      [featureName]: !prev[featureName],
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!setPassword) {
      toast.error("Please set a password before proceeding.");
      return;
    }

    if (!showLoginPasswordInput) {
      setShowLoginPasswordInput(true); // Show login password input
    } else if (!loginPassword) {
      toast.error("Please enter your login password.");
    } else {
      // Dispatch the lockFeature action with the data
      const selectedFeatures = Object.keys(features).filter(
        (feature) => features[feature]
      );
      const addData = {
        features: selectedFeatures,
        setPassword,
        loginPassword,
      };
      //   console.log(addData);
      dispatch(lockFeature(addData));
    }
  };

  // Update the features state when LockList changes
  useEffect(() => {
    if (LockList?.length > 0) {
      setFeatures({
        Earning: lockedFeatures["Earning"] || false,
        Charts: lockedFeatures["Charts"] || false,
        Investments: lockedFeatures["Investments"] || false,
        UdharBook: lockedFeatures["UdharBook"] || false,
        History: lockedFeatures["History"] || false,
        Profile: lockedFeatures["Profile"] || false,
      });
    }
  }, [LockList]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isLock) {
      toast.success("Feature Lock Successfully");
      dispatch({ type: LOCK_FEATURE_RESET });
      navigate("/");
    }
  }, [error, isLock]);

  return (
    <section className="md:ml-72">
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-6">Lock Features</h1>
        <form
          className="bg-white shadow-md rounded-lg p-6 space-y-4 w-full max-w-lg"
          onSubmit={handleSubmit}
        >
          {/* Feature Toggles */}
          <div className="space-y-4">
            {Object.keys(features).map((feature) => (
              <div
                key={feature}
                className="flex items-center justify-between border-b pb-2"
              >
                <span className="text-lg">{feature}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  {/* Hidden Checkbox for Accessibility */}
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={features[feature]}
                    onChange={() => handleFeatureToggle(feature)}
                  />
                  {/* Actual Toggle Switch */}
                  <div
                    className={`w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 
                    transition-all duration-300 ease-in-out relative`}
                  >
                    {/* The Circle of the Toggle Switch */}
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full 
                      transition-all duration-300 ease-in-out 
                      ${features[feature] ? "transform translate-x-5" : ""}`}
                    />
                    {/* Lock/Unlock Icon */}
                    {features[feature] ? (
                      <FaLock className="absolute left-0.5 top-0.5 text-blue-600 text-xl" />
                    ) : (
                      <FaUnlock className="absolute left-0.5 top-0.5 text-gray-500 text-xl" />
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
          {/* Set Password */}
          <div className="space-y-4">
            {/* Set Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Set Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Toggle between text and password type
                  value={setPassword}
                  onChange={(e) => setSetPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
                  required
                />
                {/* Eye icon */}
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={handleTogglePassword} // Toggle password visibility
                >
                  {showPassword ? (
                    <FaEye className="text-gray-500 text-xl" />
                  ) : (
                    <FaEyeSlash className="text-gray-500 text-xl" />
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Login Password Field (only shows after setting password) */}
          {showLoginPasswordInput && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm with Login Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"} // Toggle between text and password type for login password
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
                  required
                />
                {/* Eye Icon for Login Password */}
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={handleToggleLoginPassword}
                >
                  {showLoginPassword ? (
                    <FaEye className="text-gray-500 text-xl" />
                  ) : (
                    <FaEyeSlash className="text-gray-500 text-xl" />
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
            disabled={loading} // Disable the button while loading
          >
            {loading ? (
              <Loader /> // Show loading spinner
            ) : (
              <span>
                {showLoginPasswordInput
                  ? "Confirm & Lock Features"
                  : "Set Password"}
              </span>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default LockFeature;
