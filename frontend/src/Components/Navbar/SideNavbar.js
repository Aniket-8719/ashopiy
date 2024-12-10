import React from "react";
import { Link } from "react-router-dom";
// import { BsArrowRightSquareFill, BsArrowLeftSquareFill } from "react-icons/bs";
// import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
// import { MdDashboard } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { SiHomeassistantcommunitystore } from "react-icons/si";
// import { CiReceipt } from "react-icons/ci";
// import { GiTakeMyMoney } from "react-icons/gi";
// import { TbTransactionRupee } from "react-icons/tb";
// import { GrMoney } from "react-icons/gr";
import { IoStatsChartSharp } from "react-icons/io5";
import { FaChartPie } from "react-icons/fa6";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { IoReceiptSharp } from "react-icons/io5";
import { MdManageAccounts } from "react-icons/md";
import { MdOutlineMenuBook } from "react-icons/md";



const AdminDropdown = ({mobileToggle, setMobileToggle}) => { 
  return (
    <>
      <div
        className={`bg-white border-r border-r-slate-200 md:border-r-slate-300 w-64 md:w-72 h-screen flex flex-col fixed top-0 pt-4 z-50 md:left-0  animation duration-500 ${
          mobileToggle ? "-left-80" : "left-0"
        }`}
      > 
        <div className="flex items-center justify-between mx-4">
          <div>
           <h1 className="md:pl-2 text-2xl font-bold md:text-4xl text-amber-600">ashopiy</h1>
          </div>
          <div 
           onClick={() => setMobileToggle(true)} 
          className=" md:hidden">
            <IoMdClose className="text-2xl text-slate-600"/>
          </div>
        </div>

      <div className="flex flex-col  mt-12 gap-4 ">
        <Link to={"/"} className="flex items-center gap-4  p-2  pl-4 md:pl-8 hover:bg-blue-50 md:hover:bg-blue-200  hover:text-blue-600">
        <div><SiHomeassistantcommunitystore className="text-xl"/></div>
        <div><h1 className="text-xl">Home</h1></div>
        </Link>

        <Link to={"/earning"} className="flex items-center gap-4  p-2  pl-4 md:pl-8 hover:bg-blue-50 md:hover:bg-blue-200  hover:text-blue-600">
        <div><IoStatsChartSharp className="text-xl"/></div>
        <div><h1 className="text-xl">Earning</h1></div>
        </Link>

        <Link to={"/charts"} className="flex items-center gap-4  p-2 pl-4 md:pl-8 hover:bg-blue-50 md:hover:bg-blue-200  hover:text-blue-600 ">
        <div><FaChartPie className="text-xl hover:text-blue-500"/></div>
        <div><h1 className="text-xl">Charts</h1></div>
        </Link>

        <Link to={"/investment"} className="flex items-center gap-4  p-2   pl-4 md:pl-8 hover:bg-blue-50 md:hover:bg-blue-200  hover:text-blue-600">
        <div><FaMoneyBillTrendUp className="text-xl"/></div>
        <div><h1 className="text-xl">Investment</h1></div>
        </Link>
        <Link to={"/history"} className="flex items-center gap-4  p-2   pl-4 md:pl-8 hover:bg-blue-50 md:hover:bg-blue-200  hover:text-blue-600">
        <div><FaMoneyBillTransfer className="text-xl"/></div>
        <div><h1 className="text-xl">History</h1></div>
        </Link>  
        <Link to={"/staffMangement"} className="flex items-center gap-4  p-2   pl-4 md:pl-8 hover:bg-blue-50 md:hover:bg-blue-200  hover:text-blue-600 opacity-50">
        <div><MdManageAccounts className="text-2xl"/></div>
        <div><h1 className="text-xl">Staff Mangement</h1></div>
        </Link>
        <Link to={"/uDhaarBook"} className="flex items-center gap-4  p-2   pl-4 md:pl-8 hover:bg-blue-50 md:hover:bg-blue-200  hover:text-blue-600 opacity-50">
        <div><MdOutlineMenuBook className="text-2xl"/></div>
        <div><h1 className="text-xl">Udhaar Book</h1></div>
        </Link>
        <Link to={"/billing"} className="flex items-center gap-4  p-2   pl-4 md:pl-8 hover:bg-blue-50 md:hover:bg-blue-200  hover:text-blue-600 opacity-50">
        <div><IoReceiptSharp className="text-xl"/></div>
        <div><h1 className="text-xl">Billing</h1></div>
        </Link>
        
      </div>
      </div>
    </>
  );
};

export default AdminDropdown;
