import React from "react";
import DayCharts from "./DayCharts";
import MonthlyCharts from "./MonthlyCharts";
import YearlyData from "./YearlyData";


const AllCharts = () => {
  return (
    <>
      <section className="mt-14 md:mt-20  md:ml-72 h-screen">
        <>
       <DayCharts/>
       <MonthlyCharts/>
       <YearlyData/>
        </>
      </section>
    </>
  );
};

export default AllCharts;
