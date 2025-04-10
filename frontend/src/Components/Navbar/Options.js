import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { clearError, logout } from "../../actions/userAction";
import { toast } from "react-toastify";
import { FaLock } from "react-icons/fa6";

const Options = () => {
  const { user, isAuthenticated, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutUser = () => {
    dispatch(logout()); // Trigger logout action
    toast.success("Logged out successfully"); // Show success message
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

  const { LockList } = useSelector((state) => state.lockUnlockList);
  // Assuming LockList is always a single document
  const lockedFeatures = LockList[0]?.lockedFeatures || {};

  const isProfileLocked = lockedFeatures["Profile"];

    // Function to render lock icon based on the locked status of a feature
    const renderLockIcon = (isLocked) => {
      return isLocked && <FaLock className="text-gray-500" />;
    };
  return (
    <>
      <div className="flex">
        <div
          className="flex flex-col justify-center items-center gap-2 text-slate-900 shadow-lg rounded-md border-slate-300 border-[0.5px] pr-16 py-2 pt-2 px-8 md:pr-20
        text-sm bg-white"
        >
          {user && user?.role === "admin" && (
            <Link
              to={"/admin/allUsers"}
              className="hover:text-blue-600 w-full   border-black py-1.5"
            >
              Dashboard
            </Link>
          )}
          <Link
            className=" flex  justify-center items-center gap-2 hover:text-blue-600 w-full   border-black py-1.5"
            to={"/profile"}
          >
            <h1>Profile</h1>
            <div className="mr-4">{renderLockIcon(isProfileLocked)}</div>
          </Link>
          <Link
            className="hover:text-blue-600 w-full   border-black py-1.5"
            to={"/paymentHistory"}
          >
            Payment History
          </Link>
          <button
            onClick={logoutUser}
            className="flex justify-center items-center -ml-2 py-1.5  border-black text-red-500 gap-2"
          >
            <LuLogOut />
            <p>Logout</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default Options;
