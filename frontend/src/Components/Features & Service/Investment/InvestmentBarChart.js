import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const InvestmentBarChart = ({ data }) => {
  return (
    <div className="bg-white p-2">
      <h2 className="text-xl font-bold mb-4 text-gray-700 p-4">
        Investment & Income Overview
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 30 }}
          barCategoryGap={20} // Adjust spacing
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="year"
            angle={-45}
            textAnchor="end"
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="totalInvestment" fill="#8884d8" name="Investment" />
          <Bar dataKey="totalIncome" fill="#82ca9d" name="Total Income" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvestmentBarChart;
