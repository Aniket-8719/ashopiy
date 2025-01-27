import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { getInvestment } from "../../actions/investmentAction";

const InvestmentChart = () => {
  const { investments, error, loading } = useSelector(
    (state) => state.investmentData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInvestment());
  }, [dispatch]);

  if (loading) return <p>Loading chart data...</p>;
  if (error) return <p>Error fetching data: {error}</p>;

  // Prepare the chart data
  const chartData =
    investments?.map((item) => ({
      date: item?.investment?.date || "N/A",
      investmentIncome: item?.investment?.investmentIncome || 0,
      totalEarnings: item?.totalEarnings || 0,
    })) || [];

  return (
    <section className="mt-14 md:mt-20 md:ml-72">
      <div className="bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-700 p-4">
          Investment Performance
        </h2>
        <ResponsiveContainer
          width="100%"
          height={400}
        >
          <LineChart
            data={chartData}
            margin={{ top: 0, right: 30, left: 20, bottom: 60 }} // Further increased bottom margin
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
            <Legend verticalAlign="top" height={56}/>{" "}
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
    </section>
  );
};

export default InvestmentChart;
