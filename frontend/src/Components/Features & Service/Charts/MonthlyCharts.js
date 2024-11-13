import React, { PureComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import { clearErrors, getMonthlyData } from "../../../actions/earningAction";
import Loader from "../../Layouts/Loader";
import { toast } from "react-toastify";

const MonthlyCharts = () => {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector((state) => state.monthly);
  const startYear = 1900;
  const endYear = new Date().getFullYear();
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => endYear - i
  );
  const [selectedYear, setSelectedYear] = useState(endYear);

  useEffect(() => {
    dispatch(getMonthlyData(selectedYear));
  }, [selectedYear, dispatch]);

  // Check if data is loading or if there is an error
  if (loading) {
    return <div className="absolute inset-0 flex justify-center items-center"><Loader/></div>;
  }

  if (error) {
    toast.error(error);
    dispatch(clearErrors());
  }


  return (
    <>
      <div className="flex justify-between items-center mt-24 mb-16 mx-2 md:mx-8 ">
        <div className="flex justify-center items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Monthly Data</h1>
        </div>

        <div className="flex items-center justify-center text-xl border border-black  outline-none rounded-sm focus-within:border-blue-500 ">
          <select
            id="year"
            className="border-none outline-none focus:outline-none focus:ring-0 bg-white px-4 py-1 cursor-pointer"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="50%">
        <BarChart
          width={500}
          height={300}
          data={data.monthlyIncome}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={20}
        >
          <XAxis
            dataKey="month"
            scale="point"
            padding={{ left: 10, right: 10 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar
            dataKey="totalIncome"
            fill="#8884d8"
            background={{ fill: "#eee" }}
          />
          {/* <Bar dataKey="pv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} /> */}
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default MonthlyCharts;
