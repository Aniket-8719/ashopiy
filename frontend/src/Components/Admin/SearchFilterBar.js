import React, { useEffect, useState } from "react";
import { State, City } from "country-state-city";
import { shopcategory } from "../../ShopCategories.js/ShopCategories";
import moment from "moment"; // Import moment.js
import { useSelector } from "react-redux";


const SearchFilterBar = ({ handleSearch }) => {
  const {error}= useSelector((state)=>state.allUser)
  const sortedShopcategory = [...shopcategory].sort();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterData, setFilterData] = useState({
    country: "IN", // Default country
    state: "",
    city: "",
    agentID: "", // Add field for agentID
    startDate: "", // Initialize as an empty string for formatted dates
    endDate: "", // Initialize as an empty string for formatted dates
  });

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFilterData({
      ...filterData,
      [name]: moment(value).format("YYYY-MM-DD"),
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch({ searchQuery, ...filterData });
  };
 
 // country-state
  useEffect(() => {
    if (filterData.country) {
      const fetchedStates = State.getStatesOfCountry(filterData.country);
      setStates(fetchedStates || []);
      setCities([]); // Clear cities
      setFilterData((prevFormData) => ({
        ...prevFormData,
        state: "",
        city: "", // Clear city as well
      }));
    }
  }, [filterData.country]);

  // state-city
  useEffect(() => {
    if (filterData.state) {
      const fetchedCities = City.getCitiesOfState(
        filterData.country,
        filterData.state
      );
      setCities(fetchedCities || []);
      setFilterData((prevFormData) => ({ ...prevFormData, city: "" })); // Clear city when state changes
    }
  }, [filterData.state, filterData.country]);
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <form onSubmit={onSubmit} className=" bg-white rounded-lg mb-8 p-2">
      <div className="flex flex-col md:flex-row gap-4 max-w-full">
        {/* Search Section */}
        <div className="flex flex-col  gap-4 items-center w-full">
          <input
            type="text"
            name="searchQuery"
            placeholder="Search by Email, Mobile No., Shop Name, etc."
            value={searchQuery}
            onChange={handleChange}
            className="py-3 ps-8 w-full text-gray-700 leading-normal border md:border-2 border-slate-300 rounded-sm focus-within:outline-none focus-within:ring-0.5 focus-within:ring-blue-500 focus-within:border-blue-500"
          />
          <button
            type="submit"
            className="py-3 flex items-center justify-center text-center rounded-sm w-full px-6  bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
          >
            Search
          </button>
        </div>
        

        <div className="relative w-full z-20">
          {/* Dropdown Toggle */}
          <button
            className="py-3 ps-8 w-full text-gray-700 leading-normal border md:border-2 border-slate-300 rounded-sm focus-within:outline-none focus-within:ring-0.5 focus-within:ring-blue-500 focus-within:border-blue-500"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            {filterOpen ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Collapsible Filter Section */}
          {filterOpen && (
            <div className="absolute z-10 w-full bg-gray-100 md:bg-white border md:border-2 border-slate-300 rounded-sm mt-2  shadow-2xl p-4">
             
              {/* Filter Section */}
              <div className="flex flex-col w-full gap-4 ">
                
                {/* Date Filters */}
                <div className="flex w-full gap-4">
                  <div className="flex-1 w-full">
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={filterData.startDate}
                      onChange={handleDateChange}
                      className="py-2 px-2  ps-6 w-full border border-gray-300 rounded-sm focus:outline-none focus:ring focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-900"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={filterData.endDate}
                      onChange={handleDateChange}
                      className="py-2 px-2  ps-6 w-full border border-gray-300 rounded-sm focus:outline-none focus:ring focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Dropdown Filters */}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                  {/* Country */}
                  <div className="w-full">
                    <label
                      htmlFor="country"
                      className="w-full block text-sm font-medium text-gray-900"
                    >
                      Country
                    </label>
                    <select
                      name="country"
                      value={filterData.country}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring focus:ring-blue-500"
                    >
                      <option value="IN">India</option>
                    </select>
                  </div>

                  {/* State */}
                  <div className="w-full">
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-900"
                    >
                      State
                    </label>
                    <select
                      name="state"
                      value={filterData.state}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring focus:ring-blue-500"
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full">
                  {/* City */}
                  <div className="w-full">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-900"
                    >
                      City
                    </label>
                    <select
                      name="city"
                      value={filterData.city}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring focus:ring-blue-500"
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Shop Type */}
                  <div className="w-full">
                    <label
                      htmlFor="shopType"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Shop Type
                    </label>
                    <select
                      name="shopType"
                      value={filterData.shopType}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring focus:ring-blue-500"
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
                  
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
        <p className="text-red-500 mt-2">{error}</p>
    </form>
  );
};

export default SearchFilterBar;
