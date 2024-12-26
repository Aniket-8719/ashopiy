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
  return (
    <>
      <MetaData title={"CHARTS"} />
      <section className="mt-14 md:mt-20  md:ml-72 h-screen">
        <>
          <div className="">
            {isFeatureLocked ? (
              <div className="flex flex-col items-center justify-center mt-20">
                <p className="text-xl mb-4">This feature is locked.</p>
                <button
                  onClick={handleUnlockClick}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Unlock Feature
                </button>
                {isLocked && (
                  <div className="flex justify-center items-center mt-4  ">
                    <div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
                      />
                    </div>
                    <button
                      onClick={handlePasswordSubmit}
                      disabled={unLockPasswordLoading}
                      className="flex justify-center items-center ml-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-sm focus:outline-none  focus:border-green-500"
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
