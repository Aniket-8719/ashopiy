import React from "react";
import MetaData from "../Layouts/MetaData";

const NotFound = () => {
  return (
    <>
      <MetaData title={"PAGE NOT FOUND"}/>
      <section className="md:ml-72 h-screen">
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-blue-600 mb-4">
              404
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-800 mb-2">
              Page Not Found
            </h2>
            <p className="text-lg md:text-xl text-gray-500 mb-6">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
