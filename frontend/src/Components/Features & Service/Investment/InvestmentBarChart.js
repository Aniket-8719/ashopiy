import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const InvestmentBarChart = ({ data }) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-primary-100 rounded-lg mr-3">
            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-800">Investment & Income Overview</h2>
            <p className="text-sm text-neutral-600">Yearly comparison of investments and returns</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            barCategoryGap={25}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="year"
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
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
              }}
              formatter={(value) => [`₹${new Intl.NumberFormat('en-IN').format(value)}`, '']}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{ fontSize: '14px', color: '#374151' }}
            />
            <Bar 
              dataKey="totalInvestment" 
              fill="#4f46e5" 
              name="Total Investment"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="totalIncome" 
              fill="#10b981" 
              name="Total Income"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InvestmentBarChart;
