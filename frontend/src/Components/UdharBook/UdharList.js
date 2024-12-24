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
import { FaPlus } from "react-icons/fa6";

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

  useEffect(() => {
    // Fetch udhars when the component mounts and after successful add, update, or delete
    dispatch(getAllUdhar(searchQuery));
  }, [dispatch, isAdded, isUpdated, isDeleted]);

  useEffect(() => {
    // Handle error and success messages
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (addingError) {
      toast.error(addingError);
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
    }

    if (isUpdated) {
      toast.success(message);
      dispatch({ type: UPDATE_UDHAR_RESET });
      setIsUpdateModalOpen(false);
    }

    if (isDeleted) {
      toast.success(message);
      dispatch({ type: DELETE_UDHAR_RESET });
    }
  }, [
    dispatch,
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
  return (
    <>
      <section className="mt-14 md:mt-20  md:ml-72  relative">
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
                className=" absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-600 rounded-full hover:bg-gray-400 hover:text-white"
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
          <FaPlus className="text-2xl font-bold"/>
        </div>
      </section>
    </>
  );
};

export default UdharList;
