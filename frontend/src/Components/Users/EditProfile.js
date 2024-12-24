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
import { shopcategory } from "../../ShopCategories.js/ShopCategories";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector(
    (state) => state.profileUpdateDelete
  );

  const sortedShopcategory = [...shopcategory].sort();

  // Initialize formData
const [formData, setFormData] = useState({
  avatar: null,
  email: "",
  shopName: "",
  shopType: "",
  customShopType: "",
  shopOwnerName: "",
  whatsappNo: "",
  mobileNo: "",
  gstNo: "",
  country: "IN",
  state: "UP",
  city: "",
  pincode: "",
  area: "",
  landmark: "",
  address: "",
  agentID: "",
});

// Update formData when user data changes
useEffect(() => {
  if (user) {
    setFormData({
      avatar: user?.avatar?.url || null,
      email: user?.email || "",
      shopName: user?.shopName || "",
      shopType: user?.shopType || "",
      customShopType: user?.customShopType || "",
      shopOwnerName: user?.shopOwnerName || "",
      whatsappNo: user?.whatsappNo || "",
      mobileNo: user?.mobileNo || "",
      gstNo: user?.gstNo || "",
      country: user?.country || "IN",
      state: user?.state || "UP",
      city: user?.city || "",
      pincode: user?.pincode || "",
      area: user?.area || "",
      landmark: user?.landmark || "",
      address: user?.address || "",
      agentID: user?.agentID || "",
    });

    // Set avatar preview if available
    if (user?.avatar?.url) {
      setAvatarPreview(user?.avatar?.url || defaultUserImg);
    }
  }
}, [user,defaultUserImg]);


  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  // setAvatarPreview
  const [avatarPreview, setAvatarPreview] = useState(defaultUserImg);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
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

    const formDataToSubmit = new FormData();

    // Append avatar only if it's selected
    if (formData.avatar) {
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
      <section className="md:ml-72">
      <div className="min-h-screen bg-gray-100 md:bg-gray-200 flex items-center justify-center ">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-sm p-8 mt-14 md:mt-18">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Update Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo */}
            <div className="md:mb-8 bg-white flex items-center justify-center">
              {/* Circular Avatar Placeholder */}
              <div className="relative h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center shadow-lg">
                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                )}

                {/* Edit/Upload Button */}
                <label
                  htmlFor="avatarUpload"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-700"
                >
                  <FaCamera />
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
                Area
              </label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="E.g. Raja Nagar"
                className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
              />
            </div>
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
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? (
                <Loader/>
              ) : (
                "Update"
              )}
            </button>
          </form>
        </div>
      </div>
      </section>
    </>
  );
};

export default EditProfile;
