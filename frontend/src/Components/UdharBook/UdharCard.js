import React from "react";

const UdharCard = () => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800">Customer Name</h2>
        <p className="text-gray-600 text-sm mt-2">
          <strong>Phone:</strong> 1234567890
        </p>
        <p className="text-gray-600 text-sm mt-1">
          <strong>Address:</strong> 123 Main Street, City
        </p>
        <p className="text-gray-800 text-lg font-bold mt-4">
          ₹5000
        </p>
        <div className="mt-4">
          <h3 className="font-medium text-gray-700">Transactions:</h3>
          <ul className="list-disc ml-5 mt-2 text-gray-600">
            <li className="text-sm">12/12/2024: ₹1000 (Credit)</li>
            <li className="text-sm">13/12/2024: ₹500 (Debit)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UdharCard;
