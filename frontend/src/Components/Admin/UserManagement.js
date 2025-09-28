import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchFilterBar from "./SearchFilterBar";
import UserTable from "./UserTable";
import { getAllUsers, clearError } from "../../actions/userAction";
import { toast } from "react-toastify";
import { FaUserCheck, FaUsers } from "react-icons/fa6";

const UserManagement = () => {
  const dispatch = useDispatch();

  const { users, loading, error } = useSelector((state) => state.allUser);

  const handleSearch = async (searchData) => {
    const {
      searchQuery,
      country,
      state,
      city,
      agentID,
      shopType,
      startDate,
      endDate,
    } = searchData;

    // Construct query parameters
    const queryParams = new URLSearchParams({
      ...(searchQuery && { search: searchQuery }),
      ...(country && { country }),
      ...(state && { state }),
      ...(city && { city }),
      ...(shopType && { shopType }),
      ...(agentID && { agentID }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    }).toString(); // Convert to a query string

    // Dispatch the getAllUsers action with query parameters
    dispatch(getAllUsers(queryParams));
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    dispatch(getAllUsers(""));
  }, [dispatch]);

  // Total No. of active users
  const getActiveUserCount = (users) => {
    return users.filter(
      (user) =>
        user.subscription.basic.isActive || user.subscription.premium.isActive
    ).length;
  };
  return (
    <>
      <section className="mt-20 lg:ml-72 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-semibold text-neutral-800 mb-6">
              User Management
            </h1>

            {/* Search and Filter Bar */}
            <SearchFilterBar handleSearch={handleSearch} />

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-primary-100 rounded-lg mr-3">
                    <FaUsers className="text-primary-600 text-base" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Total Users</p>
                    <p className="text-xl font-semibold text-primary-600">
                      {users?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-success-100 rounded-lg mr-3">
                    <FaUserCheck className="text-success-600 text-base" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Active Users</p>
                    <p className="text-xl font-semibold text-success-600">
                      {users ? getActiveUserCount(users) : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
            <UserTable users={users} loading={loading} />
          </div>
        </div>
      </section>
    </>
  );
};

export default UserManagement;
