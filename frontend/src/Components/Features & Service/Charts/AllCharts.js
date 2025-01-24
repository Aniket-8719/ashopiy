import React, { useEffect, useState } from "react";
import DayCharts from "./DayCharts";
import MonthlyCharts from "./MonthlyCharts";
import YearlyData from "./YearlyData";
import PiChart from "./PiChart";
import MetaData from "../../Layouts/MetaData";
import { lockList, unLockFeature } from "../../../actions/appLockAction";
import { UNLOCK_FEATURE_RESET } from "../../../constants/appLockConstant";
import { clearErrors } from "../../../actions/earningAction";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Layouts/Loader";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const AllCharts = () => {
  // Lock/Unlock
  // Lock List
  const dispatch = useDispatch();
  const { LockList } = useSelector((state) => state.lockUnlockList);

  const {
    loading: unLockPasswordLoading,
    isUnlock,
    error: unLockError,
  } = useSelector((state) => state.unLockFeature);

  // The feature to check
  const checkLockFeature = "Charts"; // You can dynamically change this value as needed

  // State to manage password pop-up visibility and input
  const [isLocked, setIsLocked] = useState(false);
  const [password, setPassword] = useState("");

  // Assuming LockList is always a single document, as per your description
  const lockedFeatures = LockList[0]?.lockedFeatures || {};

  // Check if the selected feature is locked
  const isFeatureLocked = lockedFeatures[checkLockFeature];

  const handleUnlockClick = () => {
    setIsLocked(true);
  };

  const handlePasswordSubmit = () => {
    // e.preventDefault();
    const addData = {
      featureName: checkLockFeature,
      setPassword: password,
    };
    // Add your logic here to verify the password
    dispatch(unLockFeature(addData));
    setIsLocked(false); // After successful verification, you can unlock the screen
  };

  useEffect(() => {
    if (unLockError) {
      toast.error(unLockError);
      dispatch(clearErrors());
    }
    if (isUnlock) {
      toast.success("Charts Unlock");
      dispatch({ type: UNLOCK_FEATURE_RESET });
      dispatch(lockList());
    }
  }, [unLockError, isUnlock, isFeatureLocked, dispatch]);


  const [showPassword, setShowPassword] = useState(false);
  // Toggle function for showing/hiding Set Password
const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <>
      <MetaData title={"CHARTS"} />
      <section className="mt-14 md:mt-20  md:ml-72">
        <>
          <div className="">
            {isFeatureLocked ? (
              <div className="flex flex-col items-center justify-center mt-20">
                <p className="text-xl mb-4">{checkLockFeature} is locked.</p>
                <button
                  onClick={handleUnlockClick}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Unlock Feature
                </button>
                {isLocked && (
                  <div className="flex justify-center items-center mt-4  ">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
                      />
                      {/* Eye icon for toggling password visibility */}
                      <span
                        className="absolute top-2 inset-y-0 right-3 flex items-center cursor-pointer"
                        onClick={handleTogglePassword} // Toggle for old password
                      >
                        {showPassword ? (
                          <FaEye className="text-gray-500 text-xl" />
                        ) : (
                          <FaEyeSlash className="text-gray-500 text-xl" />
                        )}
                      </span>
                    </div>
                    <button
                      onClick={handlePasswordSubmit}
                      disabled={unLockPasswordLoading}
                      className="flex justify-center items-center ml-2 mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-sm focus:outline-none  focus:border-green-500"
                    >
                      {unLockPasswordLoading ? <Loader /> : "Submit"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // <p>Dikh rha h </p>
              // Feature is Unlcok
              <div className="h-screen">
                <DayCharts />
                <PiChart />
                <MonthlyCharts />
                <YearlyData />
              </div>
            )}
          </div>
          
        </>
      </section>
    </>
  );
};

export default AllCharts;
