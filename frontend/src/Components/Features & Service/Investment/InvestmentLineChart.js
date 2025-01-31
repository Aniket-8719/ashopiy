import React from "react";
import {
  LineChart,
  Line,
  XAxis, 
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const InvestmentLineChart = ({chartData}) => {
  return (
    <>
      <div className="bg-white p-2">
        <h2 className="text-xl font-bold mb-4 text-gray-700 p-4">
          Investment Performance
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 0, right: 30, left: 0, bottom: 60 }} // Further increased bottom margin
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              //   interval={0}
              tick={{ fontSize: 12 }} // Keep the font size small
            />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" height={56} />{" "}
            {/* Move legend to the top for more space */}
            <Line
              type="monotone"
              dataKey="totalEarnings"
              stroke="#82ca9d"
              name="Total Income"
            />
            <Line
              type="monotone"
              dataKey="investmentIncome"
              stroke="#8884d8"
              name="Total Investment"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default InvestmentLineChart;
