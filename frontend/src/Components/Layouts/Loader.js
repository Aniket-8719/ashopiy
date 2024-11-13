import React from "react";
import { FaSpinner } from "react-icons/fa6";

const Loader = () => {
  return (
    <>
     <div className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </div>
    </>
  );
};

export default Loader;
