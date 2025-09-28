import { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import moment from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import { getTodayEarning } from "../../../actions/earningAction";
import Loader from "../../Layouts/Loader";

const IncomeChart = () => {
  const dispatch = useDispatch();
  const { todayData, loading } = useSelector(
    (state) => state.todayEarnings
  );

  // Get the current date and time in Indian Standard Time (IST)
  const todayIST = moment.tz("Asia/Kolkata");
  const day = todayIST.date(); // Get the day of the month in IST
  const month = todayIST.month() + 1; // Get the month in IST (months are 0-indexed in moment.js)
  const year = todayIST.year(); // Get the year in IST

  useEffect(() => {
    dispatch(getTodayEarning(day, month, year));
  }, [dispatch, day, month, year,]);
  // Ensure todayData.todayIncome is an array of objects
  const data = todayData?.todayIncome?.map((item) => ({ 
    time: item.time,
    income: item.income,
  }));

  return (
    <>
      <section className="mt-16  lg:mt-20  lg:ml-72">
        {loading ? (
          <div className="absolute inset-0 flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <div className="w-full h-64">
            <h2 className="text-xl font-bold mb-4 text-gray-700 p-4 text-center">
              Today's Income
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 0,
                  bottom: 30,
                }}
              >
                <XAxis
                  dataKey="time"
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </>
  );
};

export default IncomeChart;
