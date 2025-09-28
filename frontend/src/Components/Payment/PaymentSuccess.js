import React, { useEffect } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
    const navigate = useNavigate();
  const searchQuery = useSearchParams()[0];
  const referenceId = searchQuery.get("reference");
  useEffect(()=>{
    if(!referenceId){
        navigate("/*");
    }
  },[navigate,referenceId]);
  return (
    <section className="lg:ml-72">
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          {/* Success Icon */}
          <div className="flex items-center justify-center text-green-500 mb-4">
            <AiOutlineCheckCircle className="w-16 h-16" />
          </div>
          {/* Heading */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Subscription Activated!
          </h1>
          {/* Message */}
          <p className="text-gray-600 mb-4">
            Your payment was successful, and your subscription is now active.
            Thank you for choosing our service!
          </p>
          {/* Reference ID */}
          <div className="bg-gray-100 text-gray-800 text-sm font-medium rounded-lg p-3 mb-6">
            <p>Reference ID:</p>
            {referenceId ?  <p className="text-blue-600 font-bold">{referenceId}</p> :  <p className="text-red-600 font-bold">Not valid</p> }
          </div>
          {/* Button */}
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={() => (window.location.href = "/earning")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;
