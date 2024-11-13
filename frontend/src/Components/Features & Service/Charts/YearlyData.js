import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getYearlyData } from "../../../actions/earningAction";
import Loader from "../../Layouts/Loader";
import { toast } from "react-toastify";

const YearlyData = () => {
    const dispatch = useDispatch();
    const { data, error, loading } = useSelector((state) => state.yearly);
    useEffect(() => {
        dispatch(getYearlyData());
      }, [ dispatch]);
    
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
      <div className=" flex justify-between items-center mt-24 mb-16 mx-8">
        <div className="flex justify-center items-center">
          <h1 className="text-3xl font-bold text-gray-900">Yearly Data</h1>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="50%">
        <BarChart
          width={500}
          height={300}
          data={data.yearlyIncome}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={20}
        >
          <XAxis
            dataKey="year"
            scale="point"
            padding={{ left: 10, right: 10 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="totalIncome" fill="#8884d8" background={{ fill: "#eee" }} />
          {/* <Bar dataKey="pv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} /> */}
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default YearlyData;
