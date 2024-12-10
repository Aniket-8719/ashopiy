import React from "react";
import DayCharts from "./DayCharts";
import MonthlyCharts from "./MonthlyCharts";
import YearlyData from "./YearlyData";
import PiChart from "./PiChart";
import MetaData from "../../Layouts/MetaData";


const AllCharts = () => {
  return (
    <>
    <MetaData title={"CHARTS"}/>
      <section className="mt-14 md:mt-20  md:ml-72 h-screen">
        <>
       <DayCharts/>
       <PiChart/>
       <MonthlyCharts/> 
       <YearlyData/>
        </>
      </section>
    </>
  );
};

export default AllCharts;
