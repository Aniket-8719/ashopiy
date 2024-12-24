import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import defaultUserImg from "../assests/default-user-profile-img.png";
import { State, City } from "country-state-city";
import MetaData from "../Layouts/MetaData";
import Loader from "../Layouts/Loader";
import { toast } from "react-toastify";
import {useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, register } from "../../actions/userAction";
import { shopcategory } from "../../ShopCategories.js/ShopCategories";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const sortedShopcategory = [...shopcategory].sort();
  const [formData, setFormData] = useState({
    avatar: null,
    email: "",
    password: "",
    shopName: "",
    shopType: "",
    customShopType: "",
    shopOwnerName: "",
    whatsappNo: "",
    mobileNo: "",
    gstNo: "",
    country: "IN", // Default to India
    state: "",
    city: "",
    pincode: "",
    landmark: "",
    address: "",
    agentID: "",
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(defaultUserImg);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();

    // Append avatar only if it's selected
    if (formData.avatar) {
      formDataToSubmit.append("file", formData.avatar);
    }

    // Append other fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "avatar") {
        formDataToSubmit.append(key, value);
      }
    });

    // Dispatch action
    try {
      dispatch(register(formDataToSubmit));
    } catch (err) {
      console.error("Error in form submission:", err);
    }
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];

      // Check file size (10MB in bytes)
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_SIZE) {
        toast.error("File size must be less than 10MB");
        return;
      }

      // Update `formData` with the file
      setFormData((prevFormData) => ({
        ...prevFormData,
        avatar: file, // Ensure raw file object is stored
      }));

      // For preview
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result); // Update the avatar preview
        }
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.name]: e.target.value,
      }));
    }
  };

  useEffect(() => {
    if (formData.country) {
      const fetchedStates = State.getStatesOfCountry(formData.country);
      setStates(fetchedStates || []);
      setCities([]); // Clear cities
      setFormData((prevFormData) => ({
        ...prevFormData,
        state: "",
        city: "", // Clear city as well
      }));
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      const fetchedCities = City.getCitiesOfState(
        formData.country,
        formData.state
      );
      setCities(fetchedCities || []);
      setFormData((prevFormData) => ({ ...prevFormData, city: "" })); // Clear city when state changes
    }
  }, [formData.state,formData.country]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (isAuthenticated) {
      toast.success("Register Succesfully");
      navigate("/profile");
    }
  }, [dispatch, error, navigate, isAuthenticated]);

  return (
    <>
    <MetaData title={"REGISTRATION"}/>
      <div className="min-h-screen bg-gray-300 flex items-center justify-center">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-sm p-8 mt-14 md:mt-20 ">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Registration Form
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo */}
            <div className="md:mb-8 bg-white flex items-center justify-center">
              <div className="relative h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center shadow-lg">
                <img
                  src={avatarPreview || defaultUserImg}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border border-gray-300 shadow-md"
                />
                <label
                  htmlFor="avatarUpload"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-700 transition duration-300"
                >
                  <FaCamera className="text-lg" />
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

            {/* Two Column Layout for Email and Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
                />
              </div>
            </div>

            {/* Single Column Inputs */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shop Name
              </label>
              <input
                type="text"
                required
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                placeholder="Enter your shop name"
                className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
              />
            </div>

            {/* Shop Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shop Type
              </label>
              <select
                name="shopType"
                required
                value={formData.shopType}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500"
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

            {formData.shopType === "Other" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Custom Shop Type
                </label>
                <input
                  type="text"
                  name="customShopType"
                  value={formData.customShopType}
                  onChange={handleChange}
                  placeholder="Enter your shop category"
                  className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shop Owner Name
              </label>
              <input
                type="text"
                required
                name="shopOwnerName"
                value={formData.shopOwnerName}
                onChange={handleChange}
                placeholder="Enter owner name"
                className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
              />
            </div>

            {/* Two Column Layout for WhatsApp and Mobile No */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  required
                  name="whatsappNo"
                  value={formData.whatsappNo}
                  onChange={handleChange}
                  placeholder="Enter WhatsApp number"
                  className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="text"
                  required
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
                />
              </div>
            </div>

            {/* GST No */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                GST Number <span>(optional)</span>
              </label>
              <input
                type="text"
                name="gstNo"
                value={formData.gstNo}
                onChange={handleChange}
                placeholder="Enter GST number"
                className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
              />
            </div>

            {/* Address Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <select
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500"
                >
                  <option className="" value="IN">
                    India
                  </option>
                  {/* Add more countries here if needed */}
                </select>
              </div>

              {/* State Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <select
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <select
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500"
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
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pincode
                </label>
                <input
                  type="number"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  required
                  className="mt-2 w-full px-4 py-2  text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Landmark<span>(optional)</span>
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="E.g. near apollo hospital"
                className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address (<span>Flat, House no., Street, Sector, Village</span>)
              </label>
              <textarea
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
              ></textarea>
            </div>

            {/* Agent Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Agent Code<span>(optional)</span>
              </label>
              <input
                type="text"
                name="agentID"
                value={formData.agentID}
                onChange={handleChange}
                placeholder="E.g. 24AGTXXXX"
                className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              className=" flex items-center justify-center   w-full py-3 px-4 text-center  bg-blue-600 text-white font-semibold rounded-sm hover:bg-blue-700 focus:ring-2  focus:ring-offset-2"
              type="submit"
              disabled={loading}
            >
              {loading ? <Loader /> : "Register"}
            </button>
          </form>

          {/* Register Redirect */}
          <p className="mt-6 text-sm text-gray-500 text-center">
            if you have already an account?{" "}
            <a
              href="/login"
              className="text-blue-600 font-medium hover:underline focus:outline-none underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
