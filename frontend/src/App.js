import React from "react";
import { Route, Routes } from "react-router-dom";
import DailyEarning from './Components/Features & Service/DailyEarning';
import Home from './Components/Home';
import Navbar from './Components/Navbar/Navbar';
import AllCharts from "./Components/Features & Service/Charts/AllCharts";
import AllData from "./Components/Features & Service/AllData";
import Investment from "./Components/Features & Service/Investment";
 

function App() {
  return (
   <>
  <Navbar/>
  <Routes>

    <Route path="/" element={<Home/>} />
    <Route path="/earning" element={<DailyEarning/>} />
    <Route path="/charts" element={<AllCharts/>} />
    <Route path="/transaction" element={<AllData/>} />
    <Route path="/investment" element={<Investment/>} />
  </Routes>
  {/* <DailyEarning/> */} 
   </>
  );
}

export default App;
 