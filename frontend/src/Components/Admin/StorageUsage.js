import React from "react";
import { FaDatabase, FaChartLine, FaMoneyBill, FaInfoCircle } from "react-icons/fa";

const StorageUsage = ({ dailyData, fullDayData, investData, DataNumbers }) => {
  const dailyDataTotalStorageLimit = 5; // MB
  const fullDayDataTotalStorageLimit = 20; // MB
  const investDataTotalStorageLimit = 20; // MB
  
  // Calculate percentages for daily and full-day data
  const dailyPercentage = (dailyData / dailyDataTotalStorageLimit) * 100;
  const fullDayPercentage = (fullDayData / fullDayDataTotalStorageLimit) * 100;
  const investPercentage = (investData / investDataTotalStorageLimit) * 100;
  const totalUsed =  Number(dailyData) + Number(fullDayData) + Number(investData);

  // Determine color based on usage percentage
  const getColorClass = (percentage) => {
    if (percentage >= 90) return "bg-error-600";
    if (percentage >= 70) return "bg-warning-600";
    return "bg-primary-600";
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-800 flex items-center">
          <FaDatabase className="text-primary-600 mr-2" />
          Storage Usage
        </h3>
        <div className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
          Total: {totalUsed.toFixed(2)}MB
        </div>
      </div>

      {/* Daily Income Data */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg mr-3">
              <FaChartLine className="text-warning-600 text-sm" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700">Daily Income</p>
              <p className="text-xs text-neutral-500">{dailyData}MB / {dailyDataTotalStorageLimit}MB</p>
            </div>
          </div>
          <span className="text-sm font-medium text-neutral-700">
            {dailyPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
          <div
            className={`h-2 rounded-full ${getColorClass(dailyPercentage)}`}
            style={{ width: `${dailyPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Full Day Income Data */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg mr-3">
              <FaChartLine className="text-success-600 text-sm" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700">Full Day Income</p>
              <p className="text-xs text-neutral-500">{fullDayData}MB / {fullDayDataTotalStorageLimit}MB</p>
            </div>
          </div>
          <span className="text-sm font-medium text-neutral-700">
            {fullDayPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
          <div
            className={`h-2 rounded-full ${getColorClass(fullDayPercentage)}`}
            style={{ width: `${fullDayPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Investment Data */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <FaMoneyBill className="text-purple-600 text-sm" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700">Investment Data</p>
              <p className="text-xs text-neutral-500">{investData}MB / {investDataTotalStorageLimit}MB</p>
            </div>
          </div>
          <span className="text-sm font-medium text-neutral-700">
            {investPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
          <div
            className={`h-2 rounded-full ${getColorClass(investPercentage)}`}
            style={{ width: `${investPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Additional Data Numbers */}
      {DataNumbers && (
        <div className="pt-4 border-t border-neutral-100">
          <div className="flex items-center text-xs text-neutral-500">
            <FaInfoCircle className="mr-1 text-neutral-400" />
            {DataNumbers}
          </div>
        </div>
      )}

      {/* Usage Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-neutral-500 mt-4 pt-4 border-t border-neutral-100">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-primary-600 rounded mr-1"></div>
          <span>Normal</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-warning-600 rounded mr-1"></div>
          <span>High</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-error-600 rounded mr-1"></div>
          <span>Critical</span>
        </div>
      </div>
    </div>
  );
};

export default StorageUsage;