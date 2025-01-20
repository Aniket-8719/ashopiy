import React, { useEffect, useState } from "react";
import UdharCard from "./UdharCard";
import SearchUdharPerson from "./SearchUdharPerson";
import UdharCardLoading from "../Skelton/UdharCardLoading";
import { IoMdClose } from "react-icons/io";
import AddUdhar from "./AddUdhar";
import { clearErrors, getAllUdhar } from "../../actions/udharAction";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_UDHAR_RESET,
  DELETE_UDHAR_RESET,
  UPDATE_UDHAR_RESET,
} from "../../constants/udharConstants";
import { toast } from "react-toastify";
import EditUdhar from "./EditUdhar";
import { FaEye, FaEyeSlash, FaPlus } from "react-icons/fa6";
import { lockList, unLockFeature } from "../../actions/appLockAction";
import { UNLOCK_FEATURE_RESET } from "../../constants/appLockConstant";
import Loader from "../Layouts/Loader";
import { useNavigate } from "react-router-dom";

const UdharList = () => {
  const dispatch = useDispatch();

  // currentUdhar
  const { isAdded, error: addingError } = useSelector(
    (state) => state.currentUdhar
  );

  const { error, loading, udharData } = useSelector(
    (state) => state.allUdharInfo
  );

  // delete Or Update Udhar
  const {
    error: deleteORupdateError,
    isDeleted,
    isUpdated,
    message,
  } = useSelector((state) => state.deleteORUpdateUdhar);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateID, setUpdateID] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // useEffect(() => {
  //   // Fetch udhars when the component mounts and after successful add, update, or delete
  //   dispatch(getAllUdhar(searchQuery));
  // }, [dispatch, isAdded, isUpdated, isDeleted]);

  const navigate = useNavigate();
  useEffect(() => {
    // Handle error and success messages
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (addingError) {
      toast.error(addingError);
      if (addingError === "You do not have an active subscription. Please subscribe to access this resource.") {
        navigate('/pricing');
      }
      dispatch(clearErrors());
    }
    if (deleteORupdateError) {
      toast.error(deleteORupdateError);
      dispatch(clearErrors());
    }
    if (isAdded) {
      toast.success("Udhar Added");
      dispatch({ type: ADD_UDHAR_RESET });
      setIsModalOpen(false);
      dispatch(getAllUdhar(searchQuery));
    }

    if (isUpdated) {
      toast.success(message);
      dispatch({ type: UPDATE_UDHAR_RESET });
      setIsUpdateModalOpen(false);
      dispatch(getAllUdhar(searchQuery));
    }

    if (isDeleted) {
      toast.success(message);
      dispatch({ type: DELETE_UDHAR_RESET });
      dispatch(getAllUdhar(searchQuery));
    }
  }, [
    dispatch,
    navigate,
    searchQuery,
    error,
    addingError,
    deleteORupdateError,
    isAdded,
    isUpdated,
    isDeleted,
    message,
  ]);

  // Handle search button submission
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getAllUdhar(searchQuery)); // Fetch filtered data based on searchQuery
  };

  // Calculate total Udhar Amount
  const totalUdharAmount = udharData?.udharRecords?.reduce(
    (total, udhar) => total + (Number(udhar.udharAmount) || 0),
    0
  );

  // Lock/Unlock
  // Lock List
  const { LockList } = useSelector((state) => state.lockUnlockList);

  const {
    loading: unLockPasswordLoading,
    isUnlock,
    error: unLockError,
  } = useSelector((state) => state.unLockFeature);

  // The feature to check
  const checkLockFeature = "UdharBook"; // You can dynamically change this value as needed

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
      toast.success("UdharBook Unlock");
      dispatch({ type: UNLOCK_FEATURE_RESET });
      dispatch(lockList());
    }
    // Fetch udhars only when the feature is unlocked
  if (!isFeatureLocked) {
    dispatch(getAllUdhar(searchQuery));
  }
  }, [unLockError, isUnlock, isFeatureLocked,searchQuery, dispatch]);

  const [showPassword, setShowPassword] = useState(false);
  // Toggle function for showing/hiding Set Password
const handleTogglePassword = () => setShowPassword((prev) => !prev);
  return (
    <>
      <section className="mt-14 md:mt-20  md:ml-72 ">
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
            <div className=" relative">
              <SearchUdharPerson
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
              />

              <p
                className={`ml-8 font-bold text-2xl md:mb-2 ${
                  loading || totalUdharAmount === 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {loading
                  ? `₹0`
                  : `₹${new Intl.NumberFormat("en-IN").format(
                      totalUdharAmount || 0
                    )}`}
              </p>
              <div className="h-0.5 w-full bg-gray-200 md:bg-gray-400 opacity-45"></div>
              {loading ? (
                // Show loading message while data is being fetched
                <div className="flex flex-col md:flex-row">
                  <UdharCardLoading />
                  <UdharCardLoading />
                  <UdharCardLoading />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
                  {udharData?.udharRecords?.length > 0 ? (
                    // Display Udhar cards when records are available
                    udharData.udharRecords.map((udhar) => (
                      <UdharCard
                        key={udhar._id} // Assuming udhar._id is unique, add a key for list rendering
                        udhar={udhar}
                        loading={loading}
                        setIsUpdateModalOpen={setIsUpdateModalOpen}
                        setUpdateID={setUpdateID}
                      />
                    ))
                  ) : (
                    // Show message when no Udhar records are found
                    <p className="mt-24 text-center">No Udhar is present</p>
                  )}
                </div>
              )}

              {/* Add Modal */}
              {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
                  <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg relative mx-2">
                    {/* Close Button */}
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-600 rounded-full hover:bg-gray-400 hover:text-white"
                    >
                      <IoMdClose size={20} />
                    </button>
                    <AddUdhar />
                  </div>
                </div>
              )}

              {/* Update Model */}
              {isUpdateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
                  <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg relative mx-2">
                    {/* Close Button */}
                    <button
                      onClick={() => setIsUpdateModalOpen(false)}
                      className=" absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-600 rounded-full hover:bg-gray-400 hover:text-white"
                    >
                      <IoMdClose size={20} />
                    </button>
                    <EditUdhar updateID={updateID} />
                  </div>
                </div>
              )}

              <div
                onClick={() => setIsModalOpen(true)}
                className="flex justify-center items-center w-16 h-16 bg-amber-600 text-white rounded-full fixed bottom-4 right-4 shadow-lg cursor-pointer hover:bg-amber-700 transition duration-300 ease-in-out"
                aria-label="Add"
                role="button"
              >
                <FaPlus className="text-2xl font-bold" />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default UdharList;
