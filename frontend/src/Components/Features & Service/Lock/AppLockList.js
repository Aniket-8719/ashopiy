import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  deleteAppLock,
  getAllAppLocks,
} from "../../../actions/appLockAction";
import AddLockModal from "./AddLockModal";
import UpdateLockModal from "./UpdateLockModal";
import AppLockCard from "./AppLockCard";
import { FaPlus, FaSignInAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import AppLockCardLoading from "../../Skelton/AppLockCardLoading";
import { FaLock } from "react-icons/fa6";

const AppLockList = () => {
  const dispatch = useDispatch();
  const { loading, appLocks, error } = useSelector((state) => state.appLocks);
  const { isCreated, error: createError } = useSelector(
    (state) => state.createAppLock
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  // Using the combined reducer for update and delete operations
  const {
    isUpdated,
    isDeleted,
    error: operationsError,
  } = useSelector((state) => state.appLockOperations);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateID, setUpdateID] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAllAppLocks());
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (isCreated) {
      toast.success("App Lock created successfully!");
      setIsAddModalOpen(false);
      dispatch({ type: "CREATE_APPLOCK_RESET" });
      dispatch(getAllAppLocks());
    }

    if (createError) {
      toast.error(createError);
      dispatch(clearErrors());
    }
  }, [isCreated, createError, dispatch]);

  useEffect(() => {
    if (isUpdated) {
      toast.success("App Lock updated successfully!");
      setIsUpdateModalOpen(false);
      dispatch({ type: "UPDATE_ACCESS_FEATURES_RESET" });
      dispatch(getAllAppLocks());
    }

    if (isDeleted) {
      toast.success("App Lock deleted successfully!");
      dispatch({ type: "DELETE_APPLOCK_RESET" });
      dispatch(getAllAppLocks());
    }

    if (operationsError) {
      toast.error(operationsError);
      dispatch(clearErrors());
    }
  }, [isUpdated, isDeleted, operationsError, dispatch]);

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this App Lock?")) {
      dispatch(deleteAppLock(id));
    }
  };
  return (
    <section className="mt-20 lg:ml-72 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800">
              Access Control
            </h1>
            <p className="text-neutral-600 mt-1 text-sm">
              Manage feature access for your team members
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all shadow-md"
          >
            <FaPlus className="mr-2" />
            Add New Lock
          </button>
        </div>

        {/* Content */}
        <div className="relative">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <AppLockCardLoading key={item} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appLocks?.length > 0 ? (
                appLocks.map((worker) => (
                  <AppLockCard
                    key={worker._id}
                    worker={worker}
                    setIsUpdateModalOpen={setIsUpdateModalOpen}
                    setUpdateID={setUpdateID}
                    handleDeleteClick={handleDeleteClick}
                  />
                ))
              ) : (
                <div className="col-span-full">
                  {isAuthenticated ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaLock className="text-neutral-400 text-2xl" />
                      </div>
                      <h3 className="text-lg font-medium text-neutral-600 mb-2">
                        No access controls yet
                      </h3>
                      <p className="text-neutral-500 text-sm">
                        Create your first access control to get started
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaSignInAlt className="text-neutral-400 text-2xl" />
                      </div>
                      <h3 className="text-lg font-medium text-neutral-600 mb-2">
                        Authentication required
                      </h3>
                      <p className="text-neutral-500 text-sm">
                        Please log in to manage access controls
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Add Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-xl relative">
                <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                  <h2 className="text-xl font-semibold text-neutral-800">
                    Add Access Control
                  </h2>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors"
                  >
                    <IoMdClose size={20} />
                  </button>
                </div>
                <div className="p-6">
                  <AddLockModal />
                </div>
              </div>
            </div>
          )}

          {/* Update Modal */}
          {isUpdateModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-xl relative">
                <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                  <h2 className="text-xl font-semibold text-neutral-800">
                    Update Access Control
                  </h2>
                  <button
                    onClick={() => setIsUpdateModalOpen(false)}
                    className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors"
                  >
                    <IoMdClose size={20} />
                  </button>
                </div>
                <div className="p-6">
                  <UpdateLockModal updateID={updateID} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AppLockList;
