import React from "react";

const UdharCardLoading = () => {
  return (
    <>
      <div className="max-w-md md:max-w-[280px] w-full mx-auto shadow-sm rounded-lg  border-2 border-gray-100 md:border-gray-300 relative animate-pulse">
        <div className="flex items-center justify-end absolute top-2 right-2">
          <div className="flex items-center justify-center w-[30px] h-[30px] rounded-full border-2 border-gray-300 bg-gray-300"></div>
        </div>
        <div className="p-6">
          <div className="h-6 w-3/4 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-1/2 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-2/3 bg-gray-300 rounded mb-4"></div>
          <div className="mt-2">
            <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
            <ul className="flex justify-between items-center list-disc ml-5 mt-2">
              <p className="h-4 w-1/4 bg-gray-300 rounded"></p>
              <p className="h-4 w-1/4 bg-gray-300 rounded"></p>
            </ul>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
            <div className="rounded-full bg-gray-300 w-[30px] h-[30px]"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UdharCardLoading;
