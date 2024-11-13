import React  from "react";
import { Link} from "react-router-dom";
import { LuLogOut } from "react-icons/lu";


const Options = () => {
  
  return (
    <>
      <div className="flex">
        <div className="flex flex-col justify-center items-start gap-4 text-slate-900 shadow-lg rounded-md border-slate-300 border-[0.5px] py-4 px-8 pr-20 md:pr-28
        text-sm bg-white">
          <Link className="hover:text-blue-600 w-full" to={"/admin/dashboard"}>Dashboard</Link>
          <Link className="hover:text-blue-600 w-full" to={"/profile"}>Profile</Link>
          <Link className="hover:text-blue-600 w-full" to={"/orders"}>Orders</Link>
          <button className="flex justify-center items-center text-red-500 gap-2">
            <LuLogOut />
            <p>Logout</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default Options;
