import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchUdharPerson = ({ searchQuery, setSearchQuery, handleSearch }) => {
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm mb-8">
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-4 md:items-end"
      >
        <div className="w-full">
          <label
            htmlFor="searchQuery"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Search Customers
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-neutral-400" />
            </div>
            <input
              type="text"
              id="searchQuery"
              name="searchQuery"
              placeholder="Search by name, phone, address, etc."
              value={searchQuery}
              onChange={handleChange}
              required
              className="pl-10 w-full py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
        </div>
        <button
          type="submit"
          className=" py-2.5 px-6 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchUdharPerson;
