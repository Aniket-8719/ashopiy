import React from "react";
import { Chart } from "react-google-charts";
import { useSelector } from "react-redux";
import Loader from "../../Layouts/Loader";
import moment from "moment";

const PiChart = () => {
  // Get the data, loading, and error state from Redux
  const { data, error, loading } = useSelector((state) => state.perDay);

  // If loading, display the loader
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  // If there's an error, display an error message
  if (error) {
    return (
      <div className="flex justify-center items-center text-red-600">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  // Check if data is available, otherwise fallback to empty values
  const totals = data?.perDayIncome?.reduce(
    (acc, record) => {
      acc.totalOnline += record?.totalOnlineAmount || 0; // Ensure valid values
      acc.totalCash +=
        (record?.totalIncome || 0) - (record?.totalOnlineAmount || 0);
      return acc;
    },
    { totalOnline: 0, totalCash: 0 }
  ) || { totalOnline: 0, totalCash: 0 }; // Fallback for empty or undefined data

  // Extract perDayData safely or fallback to an empty array
  const perDayData = data?.perDayIncome || [];

  // Safely extract the first date from perDayData and format it using moment
  const firstDate = perDayData.length > 0 ? perDayData[0]?.date : null;
  const formattedDate = firstDate
    ? moment(firstDate, "DD/MM/YYYY").format("MMMM, YYYY")
    : "No Date Available";

  // Data for the chart
  const chartData = [
    ["Payment Type", "Amount"],
    ["Cash", totals.totalCash],
    ["Online", totals.totalOnline],
  ];

  // Options for the chart
  const options = {
    title: formattedDate, // Display the formatted date as the chart title
    pieHole: 0.4, // Creates a doughnut chart
    is3D: false, // Keeps the chart 2D
    colors: ["#4caf50", "#2196f3"], // Green for "Cash" and Blue for "Online"
    chartArea: { width: "80%", height: "80%" }, // Optional: Adjust chart size within the container
    legend: { position: "bottom" }, // Optional: Move the legend to the bottom
  };

  return (
    <>
      {/* Pie Chart Section */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm mb-8">
        <h2 className="text-lg lg:text-xl font-semibold text-neutral-800 mb-6 text-center">
          Income Distribution
        </h2>
        <div className="flex justify-center">
          <Chart
            chartType="PieChart"
            width="100%"
            height="400px"
            data={chartData}
            options={{
              ...options,
              backgroundColor: "transparent",
              legend: { textStyle: { color: "#374151" } },
              pieSliceBorderColor: "transparent",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default PiChart;
