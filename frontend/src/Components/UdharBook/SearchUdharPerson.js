import React from "react";


const SearchUdharPerson = ({searchQuery, setSearchQuery, handleSearch}) => {

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg mb-8 p-2">
      <form onSubmit={handleSearch} className="flex gap-4 max-w-full">
        {/* Search Section */}
        <div className="flex flex-col md:flex-row  gap-4 items-center w-full">
          <input
            type="text"
            name="searchQuery"
            placeholder="Search by Customer Name, Mobile No., Address, etc."
            value={searchQuery}
            onChange={handleChange}
            className="py-3 ps-8 w-full text-gray-700 leading-normal border md:border-2 border-slate-300 rounded-sm focus-within:outline-none focus-within:ring-0.5 focus-within:ring-blue-500 focus-within:border-blue-500"
          />
          <button
            type="submit"
            className="py-3 flex items-center justify-center text-center rounded-sm w-full md:w-52 px-6  bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
          >
            Search
          </button>
        </div>
      </form>
        {/* <p className="text-red-500 mt-2">{error}</p> */}
    </div>
  );
};

export default SearchUdharPerson;
