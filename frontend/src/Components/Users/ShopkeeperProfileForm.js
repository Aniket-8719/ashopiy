// components/ShopkeeperProfileForm.js
import React, { useEffect, useState } from "react";
import { State, City } from "country-state-city";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  completeProfile,
  loadUser,
} from "../../actions/userAction";
import { shopcategory } from "../../ShopCategories/ShopCategories";
import Loader from "../Layouts/Loader";
import { COMPLETE_PROFILE_RESET } from "../../constants/userConstants";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa"; // Import close icon

const ShopkeeperProfileForm = ({ user, onComplete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, profileCompleted } = useSelector(
    (state) => state.user
  );

  const sortedShopcategory = [...shopcategory].sort();
  const [formData, setFormData] = useState({
    shopName: user.shopName || "",
    shopType: user.shopType || "",
    customShopType: user.customShopType || "",
    whatsappNo: user.whatsappNo || "",
    mobileNo: user.mobileNo || "",
    gstNo: user.gstNo || "",
    state: user.state || "",
    city: user.city || "",
    pincode: user.pincode || "",
    address: user.address || "",
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchedStates = State.getStatesOfCountry("IN");
    setStates(fetchedStates || []);
  }, []);

  useEffect(() => {
    if (formData.state) {
      const fetchedCities = City.getCitiesOfState("IN", formData.state);
      setCities(fetchedCities || []);
    }
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that at least one number is provided
    if (!formData.whatsappNo && !formData.mobileNo) {
      toast.error("Please provide at least one contact number");
      return;
    }

    dispatch(completeProfile(formData));
  };

  const handleSkip = () => {
    // You can add any additional logic here before redirecting
    toast.info("You can complete your profile later from settings");
    navigate("/"); // Redirect to homepage
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }

    if (profileCompleted) {
      toast.success("Profile completed successfully");
      dispatch(loadUser());
      navigate("/profile");
      dispatch({
        type: COMPLETE_PROFILE_RESET,
      });
    }
  }, [dispatch, error, profileCompleted, navigate]);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-8 shadow-sm relative">
      {/* Skip button at top right */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 text-neutral-500 hover:text-neutral-700 transition-colors p-1 rounded-md hover:bg-neutral-100"
        title="Skip for now"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-semibold text-neutral-800 mb-3">
          Complete Your Profile
        </h2>
        <p className="text-neutral-600 text-sm">
          Complete your profile to access all features. You can skip and
          complete it later.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shop Name */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <input
            type="text"
            required
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            placeholder="Enter your shop name"
            className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
          />
        </div>

        {/* Shop Type */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <select
            name="shopType"
            required
            value={formData.shopType}
            onChange={handleChange}
            className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm appearance-none bg-white"
          >
            <option value="">Select Shop Type</option>
            {sortedShopcategory.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Custom Shop Type (conditionally rendered) */}
        {formData.shopType === "Other" && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <input
              type="text"
              name="customShopType"
              value={formData.customShopType}
              onChange={handleChange}
              placeholder="Enter your shop category"
              className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              required
            />
          </div>
        )}

        {/* Contact Numbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* WhatsApp Number */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-success-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <input
              type="text"
              name="whatsappNo"
              value={formData.whatsappNo}
              onChange={handleChange}
              placeholder="WhatsApp number"
              className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            />
          </div>

          {/* Mobile Number */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <input
              type="text"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              placeholder="Mobile number"
              className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            />
          </div>
        </div>

        {/* Error message if both fields are empty */}
        {!formData.whatsappNo && !formData.mobileNo && (
          <p className="text-error-600 text-sm flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Please provide at least one contact number
          </p>
        )}

        {/* GST Number */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <input
            type="text"
            name="gstNo"
            value={formData.gstNo}
            onChange={handleChange}
            placeholder="GST Number (optional)"
            className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
          />
        </div>

        {/* Location Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* State */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <select
              name="state"
              required
              value={formData.state}
              onChange={handleChange}
              className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm appearance-none bg-white"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <select
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm appearance-none bg-white"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pincode */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
            </div>
            <input
              type="number"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              required
              className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            />
          </div>
        </div>

        {/* Address */}
        <div className="relative">
          <div className="absolute top-3 left-3">
            <svg
              className="h-5 w-5 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <textarea
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            rows={3}
            className="pl-10 w-full py-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-3 flex items-center justify-center text-white font-medium rounded-lg transition-all ${
              loading
                ? "bg-neutral-400 cursor-not-allowed"
                : "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
            } shadow-md hover:shadow-lg text-sm`}
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Complete Profile
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="flex-1 py-3 text-center border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors text-sm"
          >
            Skip for Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShopkeeperProfileForm;
