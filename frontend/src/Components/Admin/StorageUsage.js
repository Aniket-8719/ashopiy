import React from "react";

const StorageUsage = ({dailyData,fullDayData,investData}) => {
    // const dailyData=1; 
    // const fullDayData=9; 
    // const investData=3;  // Let's assume a hypothetical storage limit for each type (e.g., 100 MB)
  const dailyDataTotalStorageLimit = 5; // MB
  const fullDayDataTotalStorageLimit = 20; // MB
  const investDataTotalStorageLimit = 20; // MB
  
  // Calculate percentages for daily and full-day data
  const dailyPercentage = (dailyData / dailyDataTotalStorageLimit) * 100;
  const fullDayPercentage = (fullDayData / fullDayDataTotalStorageLimit) * 100;
  const investPercentage = (investData / investDataTotalStorageLimit) * 100;

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Storage Usage</h2>

      <div className="w-full mb-6">
        <p className="text-sm text-gray-500 mb-2">
          Daily Income Data Usage: <span className="font-semibold">{dailyData} MB</span>
        </p>
        <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
          <div
            className={`h-4 rounded-full bg-yellow-600`}
            style={{ width: `${dailyPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500">Used {dailyPercentage.toFixed(2)}% of {dailyDataTotalStorageLimit}MB</p>
      </div>

      <div className="w-full mb-6">
        <p className="text-sm text-gray-500 mb-2">
          Full Day Income Data Usage: <span className="font-semibold">{fullDayData} MB</span>
        </p>
        <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
          <div
            className={`h-4 rounded-full bg-green-600`}
            style={{ width: `${fullDayPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500">Used {fullDayPercentage.toFixed(2)}% of {fullDayDataTotalStorageLimit}MB</p>
      </div>

      <div className="w-full mb-6">
        <p className="text-sm text-gray-500 mb-2">
          Investment Data Usage: <span className="font-semibold">{investData} MB</span>
        </p>
        <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
          <div
            className={`h-4 rounded-full bg-indigo-600`}
            style={{ width: `${investPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500">Used {investPercentage.toFixed(2)}% of {investDataTotalStorageLimit}MB</p>
      </div>
    </div>
  );
};

export default StorageUsage;
