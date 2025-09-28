import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import defaultUserImg from "../assests/default-user-profile-img.png";
import { State, City } from "country-state-city";
import MetaData from "../Layouts/MetaData";
import Loader from "../Layouts/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, loadUser, updateProfile } from "../../actions/userAction";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstants";
import { shopcategory } from "../../ShopCategories/ShopCategories";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector(
    (state) => state.profileUpdateDelete
  );

  const sortedShopcategory = [...shopcategory].sort();

  // Get user role
  const userRole = user?.role || "";

  // Initialize formData
  const [formData, setFormData] = useState({
    avatar: null,
    email: "",
    shopName: "",
    shopType: "",
    customShopType: "",
    Name: "",
    whatsappNo: "",
    mobileNo: "",
    gstNo: "",
    country: "IN",
    state: "UP",
    city: "",
    pincode: "",
    landmark: "",
    address: "",
    agentID: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Update formData when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        avatar: user?.avatar?.url || null,
        email: user?.email || "",
        shopName: user?.shopName || "",
        shopType: user?.shopType || "",
        customShopType: user?.customShopType || "",
        Name: user?.Name || "",
        whatsappNo: user?.whatsappNo || "",
        mobileNo: user?.mobileNo || "",
        gstNo: user?.gstNo || "",
        country: user?.country || "IN",
        state: user?.state || "UP",
        city: user?.city || "",
        pincode: user?.pincode || "",
        landmark: user?.landmark || "",
        address: user?.address || "",
        agentID: user?.agentID || "",
      });

      // Set avatar preview if available
      if (user?.avatar?.url) {
        setAvatarPreview(user?.avatar?.url || defaultUserImg);
      }
    }
  }, [user]);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(defaultUserImg);

  // Validate form function
  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    // Name validation
    if (!formData.Name) {
      errors.Name = "Name is required";
    }

    // Phone number validation - at least one is required
    if (!formData.whatsappNo && !formData.mobileNo) {
      errors.phone = "At least one phone number is required";
    }

    // Shopkeeper specific validations
    if (userRole === "shopkeeper") {
      if (!formData.shopName) {
        errors.shopName = "Shop name is required";
      }

      if (!formData.shopType) {
        errors.shopType = "Shop type is required";
      }

      if (formData.shopType === "Other" && !formData.customShopType) {
        errors.customShopType = "Custom shop type is required";
      }
    }

    // Address validation
    if (!formData.address) {
      errors.address = "Address is required";
    }

    if (!formData.city) {
      errors.city = "City is required";
    }

    if (!formData.state) {
      errors.state = "State is required";
    }

    if (!formData.pincode) {
      errors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = "Pincode must be 6 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }

    // Special case for phone numbers
    if ((name === "whatsappNo" || name === "mobileNo") && formErrors.phone) {
      setFormErrors({
        ...formErrors,
        phone: "",
      });
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const formDataToSubmit = new FormData();

    // Append avatar only if it's selected
    if (formData.avatar && typeof formData.avatar !== "string") {
      formDataToSubmit.append("avatar", formData.avatar);
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (value && key !== "avatar") {
        formDataToSubmit.append(key, value);
      }
    });

    // Dispatch action
    try {
      dispatch(updateProfile(formDataToSubmit));
    } catch (err) {
      console.error("Error in form submission:", err);
    }
  };

  useEffect(() => {
    if (formData.country) {
      const fetchedStates = State.getStatesOfCountry(formData.country);
      setStates(fetchedStates);

      // Pre-select default state if set
      if (formData.state) {
        const defaultCities = City.getCitiesOfState(
          formData.country,
          formData.state
        );
        setCities(defaultCities);
      } else {
        setCities([]); // Reset cities if no default state
      }
    }
  }, [formData.country, formData.state]);

  // Fetch cities when the state changes
  useEffect(() => {
    if (formData.state) {
      const fetchedCities = City.getCitiesOfState(
        formData.country,
        formData.state
      );
      setCities(fetchedCities);
    }
  }, [formData.country, formData.state]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }

    if (loading) return; // Handle loading in render

    if (isUpdated) {
      toast.success("Profile updated successfully");
      dispatch(loadUser());
      navigate("/profile");
      dispatch({ type: UPDATE_PROFILE_RESET });
    }
  }, [dispatch, error, loading, isUpdated, navigate]);

  return (
    <>
      <MetaData title={"EDIT PROFILE"} />
      <section className="mt-8 lg:ml-72 px-4 lg:px-6">
        <div className="max-w-4xl mx-auto py-8">
        
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-neutral-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                    )}
                  </div>
                  <label
                    htmlFor="avatarUpload"
                    className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-primary-700 transition-colors"
                  >
                    <FaCamera className="text-sm" />
                    <input
                      id="avatarUpload"
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={registerDataChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-neutral-500">
                  Click camera icon to update photo
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address <span className="text-error-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                    formErrors.email ? "border-error-500" : ""
                  }`}
                />
                {formErrors.email && (
                  <p className="text-error-600 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Shop-related fields (only for shopkeeper) */}
              {userRole === "shopkeeper" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Shop Name <span className="text-error-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleChange}
                      placeholder="Enter your shop name"
                      className={`w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        formErrors.shopName ? "border-error-500" : ""
                      }`}
                    />
                    {formErrors.shopName && (
                      <p className="text-error-600 text-sm mt-1">
                        {formErrors.shopName}
                      </p>
                    )}
                  </div>

                  {/* Shop Type */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Business Type <span className="text-error-600">*</span>
                    </label>
                    <select
                      name="shopType"
                      value={formData.shopType}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        formErrors.shopType ? "border-error-500" : ""
                      }`}
                    >
                      <option value="">Select Business Type</option>
                      {sortedShopcategory.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.shopType && (
                      <p className="text-error-600 text-sm mt-1">
                        {formErrors.shopType}
                      </p>
                    )}
                  </div>

                  {formData.shopType === "Other" && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Custom Business Type{" "}
                        <span className="text-error-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="customShopType"
                        value={formData.customShopType}
                        onChange={handleChange}
                        placeholder="Specify your business type"
                        className={`w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                          formErrors.customShopType ? "border-error-500" : ""
                        }`}
                      />
                      {formErrors.customShopType && (
                        <p className="text-error-600 text-sm mt-1">
                          {formErrors.customShopType}
                        </p>
                      )}
                    </div>
                  )}

                  {/* GST No */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      GST Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="gstNo"
                      value={formData.gstNo}
                      onChange={handleChange}
                      placeholder="Enter GST number"
                      className="w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                  </div>
                </>
              )}

              {/* Name field */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {userRole === "shopkeeper" ? "Shop Owner Name" : "Full Name"}{" "}
                  <span className="text-error-600">*</span>
                </label>
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  placeholder={
                    userRole === "shopkeeper"
                      ? "Enter owner name"
                      : "Enter your full name"
                  }
                  className={`w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                    formErrors.Name ? "border-error-500" : ""
                  }`}
                />
                {formErrors.Name && (
                  <p className="text-error-600 text-sm mt-1">
                    {formErrors.Name}
                  </p>
                )}
              </div>

              {/* Contact Numbers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    name="whatsappNo"
                    value={formData.whatsappNo}
                    onChange={handleChange}
                    placeholder="Enter WhatsApp number"
                    className="w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    className="w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-error-600 text-sm col-span-2">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              {/* Address Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-neutral-800 border-b border-neutral-200 pb-2">
                  Address Information
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Country Selection */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Country <span className="text-error-600">*</span>
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="IN">India</option>
                    </select>
                  </div>

                  {/* State Selection */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      State <span className="text-error-600">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        formErrors.state ? "border-error-500" : ""
                      }`}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.state && (
                      <p className="text-error-600 text-sm mt-1">
                        {formErrors.state}
                      </p>
                    )}
                  </div>

                  {/* City Selection */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      City <span className="text-error-600">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        formErrors.city ? "border-error-500" : ""
                      }`}
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.city && (
                      <p className="text-error-600 text-sm mt-1">
                        {formErrors.city}
                      </p>
                    )}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Pincode <span className="text-error-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter pincode"
                      className={`w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        formErrors.pincode ? "border-error-500" : ""
                      }`}
                    />
                    {formErrors.pincode && (
                      <p className="text-error-600 text-sm mt-1">
                        {formErrors.pincode}
                      </p>
                    )}
                  </div>
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="E.g. near apollo hospital"
                    className="w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Complete Address <span className="text-error-600">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Flat, House no., Street, Sector, Village"
                    rows={3}
                    className={`w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                      formErrors.address ? "border-error-500" : ""
                    }`}
                  ></textarea>
                  {formErrors.address && (
                    <p className="text-error-600 text-sm mt-1">
                      {formErrors.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-neutral-200">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 text-white font-medium rounded-lg transition-all ${
                    loading
                      ? "bg-neutral-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                  } shadow-md hover:shadow-lg`}
                >
                  {loading ? <Loader /> : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditProfile;
