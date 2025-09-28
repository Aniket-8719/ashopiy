import React, { useEffect, useState } from "react";
import { State, City } from "country-state-city";
import { shopcategory } from "../../ShopCategories/ShopCategories";
import moment from "moment"; // Import moment.js
import { useSelector } from "react-redux";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const SearchFilterBar = ({ handleSearch }) => {
  const { error } = useSelector((state) => state.allUser);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch({ searchQuery, ...filterData });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, filterData]);

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
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm mb-6">
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-primary-600 text-sm" />
          </div>
          <input
            type="text"
            name="searchQuery"
            placeholder="Search by Email, Mobile No., Shop Name, etc."
            value={searchQuery}
            onChange={handleChange}
            className="pl-10 w-full py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
          />
        </div>

        {/* Filter Toggle */}
        <button
          type="button"
          onClick={() => setFilterOpen(!filterOpen)}
          className="w-full py-2.5 flex items-center justify-center text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm"
        >
          {filterOpen ? "Hide Filters" : "Show Filters"}
          {filterOpen ? (
            <FaChevronUp className="ml-2 text-xs" />
          ) : (
            <FaChevronDown className="ml-2 text-xs" />
          )}
        </button>

        {/* Filter Section */}
        {filterOpen && (
          <div className="border border-neutral-200 rounded-lg p-4 space-y-4">
            {/* Date Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filterData.startDate}
                  onChange={handleDateChange}
                  className="w-full py-2.5 px-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filterData.endDate}
                  onChange={handleDateChange}
                  className="w-full py-2.5 px-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Location Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={filterData.country}
                  onChange={handleFilterChange}
                  className="w-full py-2.5 px-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm appearance-none bg-white"
                >
                  <option value="IN">India</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  State
                </label>
                <select
                  name="state"
                  value={filterData.state}
                  onChange={handleFilterChange}
                  className="w-full py-2.5 px-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm appearance-none bg-white"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  City
                </label>
                <select
                  name="city"
                  value={filterData.city}
                  onChange={handleFilterChange}
                  className="w-full py-2.5 px-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm appearance-none bg-white"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shop Type Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Shop Type
              </label>
              <select
                name="shopType"
                value={filterData.shopType}
                onChange={handleFilterChange}
                className="w-full py-2.5 px-3 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm appearance-none bg-white"
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
        )}

        {/* Search Button */}
        <button
          type="submit"
          className="w-full py-3 flex items-center justify-center bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all shadow-md hover:shadow-lg text-sm"
        >
          <FaSearch className="mr-2 text-xs" />
          Search Users
        </button>

        {error && (
          <p className="text-error-600 text-sm mt-2 text-center">{error}</p>
        )}
      </form>
    </div>
  );
};

export default SearchFilterBar;
