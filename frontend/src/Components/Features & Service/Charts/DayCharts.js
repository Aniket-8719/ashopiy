import React, { useEffect, useState , useRef} from "react";
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
import { clearErrors, getPerDayData } from "../../../actions/earningAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Layouts/Loader";
import { toast } from "react-toastify";
import * as htmlToImage from "html-to-image";

const DayCharts = () => {
  const dispatch = useDispatch();
  const { data, error, loading } = useSelector((state) => state.perDay);
  const today = new Date();
  const defaultMonthYear = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [selectedMonthYear, setSelectedMonthYear] = useState(defaultMonthYear);
  const chartRef = useRef();

  useEffect(() => {
    // Split selectedMonthYear into year and month
    const [year, month] = selectedMonthYear.split('-');
    // Call getPerDayData with month and year as integers
    dispatch(getPerDayData(parseInt(month, 10), parseInt(year, 10)));
  }, [selectedMonthYear, dispatch]);

  // Check if data is loading or if there is an error
  if (loading) {
    return <div className="absolute inset-0 flex justify-center items-center"><Loader/></div>;
  }

  if (error) {
    toast.error(error);
    dispatch(clearErrors());
  }

 // CSV Download Function
const downloadCSV = () => {
    try {
      const csvContent = [
        ["Date", "Total Income", "Customer Count"],
        ...data.perDayIncome.map((row) => [row.date, row.totalIncome, row.customerCount]),
      ]
        .map((e) => e.join(",")) // Join fields by comma
        .join("\n"); // Join rows by newline
  
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `per_day_data_${selectedMonthYear}.csv`);
      link.click();
    } catch (err) {
      console.error("Error generating CSV:", err);
    } 
  };
  

  // PNG Download Function
  const downloadPNG = () => {
    if (chartRef.current){
        htmlToImage.toPng(chartRef.current).then((dataUrl) => {
            const link = document.createElement("a");
            link.href = dataUrl;
            link.setAttribute("download", `per_day_data_${selectedMonthYear}.png`);
            link.click();
          }).catch((err) => {
            console.error("Error generating PNG:", err);
          });
    }
  };

  // SVG Download Function
  const downloadSVG = () => {
    if (chartRef.current){
        htmlToImage.toSvg(chartRef.current).then((dataUrl) => {
            const link = document.createElement("a");
            link.href = dataUrl;
            link.setAttribute("download", `per_day_data_${selectedMonthYear}.svg`);
            link.click();
          }).catch((err) => {
            console.error("Error generating SVG:", err);
          });
    }
    
  };

  return (
    <>
      <div className="flex justify-between items-center mb-16 mx-2 md:mx-8 mt-24">
        <h1 className=" text-2xl md:text-3xl font-bold text-gray-900">Per Day Data</h1>
        <input
        className="md:text-lg  bg-white p-2 border border-black outline-none cursor-pointer"
          type="month"
          id="monthYear"
          name="monthYear"
          value={selectedMonthYear}
          onChange={(e) => setSelectedMonthYear(e.target.value)}
        />
      </div>
      <ResponsiveContainer width="100%" height={300}
      className="sm:w-full md:w-3/4 lg:w-1/2 "
      ref={chartRef}
      >
        <BarChart
          data={data.perDayIncome} // Ensure this is the correct path to your data
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="totalIncome" fill="#8884d8" background={{ fill: "#eee" }}/>
          {/* <Bar yAxisId="right" dataKey="customerCount" fill="#82ca9d" background={{ fill: "#eee" }} /> */}
        </BarChart>
      </ResponsiveContainer>

      <div className="flex mt-4 space-x-4 ml-16">
        <button onClick={downloadCSV} className="btn btn-primary">
          Download CSV
        </button>
        <button onClick={downloadPNG} className="btn btn-primary">
          Download PNG
        </button>
        <button onClick={downloadSVG} className="btn btn-primary">
          Download SVG
        </button>
      </div>
    </>
  );
};

export default DayCharts;
