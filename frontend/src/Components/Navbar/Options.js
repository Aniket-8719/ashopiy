import React, { useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineViewGrid } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { clearError, logout } from "../../actions/userAction";
import { toast } from "react-toastify";

const Options = () => {
  const { user, isAuthenticated, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutUser = () => {
    dispatch(logout()); 
    toast.success("Logged out successfully"); 
    navigate("/login"); 
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [dispatch, error, isAuthenticated, navigate]);

  return (
    <>
      <div className="py-2 bg-white rounded-lg shadow-lg border border-neutral-200 min-w-[180px]">
      {user && user?.role === "admin" && (
        <Link
          to={"/admin/allUsers"}
          className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
        >
          <HiOutlineViewGrid className="text-lg" />
          <span className="text-sm font-medium">Dashboard</span>
        </Link>
      )}
      
      <Link
        to={"/profile"}
        className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
      >
        <IoSettingsOutline className="text-lg" />
        <span className="text-sm font-medium">Settings</span>
      </Link>
      
      <Link
        to={"/paymentHistory"}
        className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
        <span className="text-sm font-medium">Payment History</span>
      </Link>
      
      <div className="border-t border-neutral-200 my-1"></div>
      
      <button
        onClick={logoutUser}
        className="flex items-center text-red-500 gap-3 w-full px-4 py-2 text-error hover:bg-neutral-50 transition-colors"
      >
        <LuLogOut className="text-lg" />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </div>
    </>
  );
};

export default Options;
