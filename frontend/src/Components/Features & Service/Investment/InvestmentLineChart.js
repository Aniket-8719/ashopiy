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

const InvestmentLineChart = ({ chartData }) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-primary-100 rounded-lg mr-3">
            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-800">Investment Performance</h2>
            <p className="text-sm text-neutral-600">Track your investment growth over time</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={{ stroke: '#e2e8f0' }}
              tickFormatter={(value) => `₹${new Intl.NumberFormat('en-IN').format(value)}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
              }}
              formatter={(value) => [`₹${new Intl.NumberFormat('en-IN').format(value)}`, '']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{ fontSize: '14px', color: '#374151' }}
            />
            <Line
              type="monotone"
              dataKey="totalEarnings"
              stroke="#10b981"
              name="Total Income"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#059669' }}
            />
            <Line
              type="monotone"
              dataKey="investmentIncome"
              stroke="#4f46e5"
              name="Total Investment"
              strokeWidth={3}
              dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#3730a3' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InvestmentLineChart;
