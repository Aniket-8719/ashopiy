import React, { useEffect, useState } from "react";
import UdharCard from "./UdharCard";
import SearchUdharPerson from "./SearchUdharPerson";
import UdharCardLoading from "../../Skelton/UdharCardLoading";
import { IoMdClose } from "react-icons/io";
import AddUdhar from "./AddUdhar";
import { clearErrors, getAllUdhar } from "../../../actions/udharAction";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_UDHAR_RESET,
  DELETE_UDHAR_RESET,
  UPDATE_UDHAR_RESET,
} from "../../../constants/udharConstants";
import { toast } from "react-toastify";
import EditUdhar from "./EditUdhar";
import { FaFileInvoiceDollar, FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../utils/useDebounce";

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

  const navigate = useNavigate();
  useEffect(() => {
    // Handle error and success messages
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (addingError) {
      toast.error(addingError);
      if (
        addingError ===
        "You do not have an active subscription. Please subscribe to access this resource."
      ) {
        navigate("/pricing");
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

  // Calculate total Udhar Amount
  const totalUdharAmount = udharData?.udharRecords?.reduce(
    (total, udhar) => total + (Number(udhar.udharAmount) || 0),
    0
  );

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    dispatch(getAllUdhar(debouncedSearch));
  }, [dispatch, debouncedSearch, isAdded, isUpdated, isDeleted]);

  // Handle search button submission
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getAllUdhar(searchQuery));
  };

  return (
    <>
      <section className="mt-20  lg:ml-72 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Search Component */}
          <SearchUdharPerson
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />

          {/* Total Amount Summary */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-700">
                  Total Outstanding
                </h2>
                <p className="text-sm text-neutral-500">
                  Amount due from all customers
                </p>
              </div>
              <div
                className={`text-2xl lg:text-3xl font-bold ${
                  loading || totalUdharAmount === 0
                    ? "text-success-600"
                    : "text-error-600"
                }`}
              >
                {loading
                  ? "₹0"
                  : `₹${new Intl.NumberFormat("en-IN").format(
                      totalUdharAmount || 0
                    )}`}
              </div>
            </div>
          </div>

          {/* Udhar Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <UdharCardLoading />
            </div>
          ) : (
            <>
              {udharData?.udharRecords?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8">
                  {udharData.udharRecords.map((udhar) => (
                    <UdharCard
                      key={udhar._id}
                      udhar={udhar}
                      loading={loading}
                      setIsUpdateModalOpen={setIsUpdateModalOpen}
                      setUpdateID={setUpdateID}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
                  <div className="flex flex-col items-center justify-center text-neutral-400">
                    <FaFileInvoiceDollar className="w-12 h-12 mb-3 opacity-50" />
                    <p className="text-lg font-medium">
                      No credit records found
                    </p>
                    <p className="text-sm mt-1">
                      Add your first credit record using the button below
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Add Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="w-full max-w-md bg-white rounded-xl border border-neutral-200 shadow-lg relative">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-neutral-100 text-neutral-600 rounded-full hover:bg-neutral-200 transition-colors"
                >
                  <IoMdClose size={16} />
                </button>
                <AddUdhar />
              </div>
            </div>
          )}

          {/* Update Modal */}
          {isUpdateModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="w-full max-w-md bg-white rounded-xl border border-neutral-200 shadow-lg relative">
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-neutral-100 text-neutral-600 rounded-full hover:bg-neutral-200 transition-colors"
                >
                  <IoMdClose size={16} />
                </button>
                <EditUdhar updateID={updateID} />
              </div>
            </div>
          )}

          {/* Floating Action Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex justify-center items-center w-14 h-14 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full fixed bottom-6 right-6 shadow-lg hover:shadow-xl transition-all hover:from-primary-700 hover:to-secondary-700"
            aria-label="Add credit record"
          >
            <FaPlus className="text-xl" />
          </button>
        </div>
      </section>
    </>
  );
};

export default UdharList;
