import React from "react";
import { Chart } from "react-google-charts";
import { useSelector } from "react-redux";
import Loader from "../../Layouts/Loader";

const PiChart = () => {
  const { data, error, loading } = useSelector((state) => state.perDay);
 
  // Check if data is available and not empty
  const totals = data?.perDayIncome?.reduce(
    (acc, record) => {
      acc.totalOnline += record.totalOnlineAmount || 0; // Ensure valid values
      acc.totalCash += (record.totalIncome || 0) - (record.totalOnlineAmount || 0);
      return acc;
    },
    { totalOnline: 0, totalCash: 0 }
  ) || { totalOnline: 0, totalCash: 0 }; // Fallback for empty or undefined data

  // Data for the chart
  const chartData = [
    ["Task", "Amount"],
    ["Cash", totals.totalCash],
    ["Online", totals.totalOnline],
  ];

  // Options for the chart
  const options = {
    title: "Current Month",
    pieHole: 0.4,
    is3D: false,
    colors: ["#4caf50", "#2196f3"], // Green for "Cash" and Blue for "Online"
  };

  // Handle loading and error states
  // Check if data is loading or if there is an error
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  // if (error) return <p>Error: {error.message}</p>;

  return (
   
      <Chart
        chartType="PieChart"
        width="100%"
        height="400px" 
        data={chartData}
        options={options}
      />
    
  );
};

export default PiChart;
