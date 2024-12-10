import React, { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchFilterBar from './SearchFilterBar';
import UserTable from './UserTable';
import {getAllUsers,clearError} from "../../actions/userAction";
import { toast } from "react-toastify";



const UserManagement = () => {
  const dispatch = useDispatch();

  const {users,loading,error}= useSelector((state)=>state.allUser)

  const handleSearch = async (searchData) => {
    
  
    const { searchQuery, country, state, city, agentID,shopType, startDate, endDate } = searchData;
  
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
    
  }, [dispatch,error]);
  return (
    <>
    <section className="mt-16 md:mt-20  md:ml-72">
    <div className="mt-8">
    <h1 className=" text-2xl md:text-3xl font-bold text-gray-900 mb-2 p-2">User Management</h1>

      {/* Search and Filter Bar */}
      <SearchFilterBar handleSearch={handleSearch} />

      {/* Loading and Error Handling
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>} */}
      <p className=" text-xl md:text-2xl my-2 ml-4 font-bold text-gray-900">Total Users:  <span className=" font-bold text-green-600 text-xl md:text-2xl md:ml-2"> {users?.length}</span></p>
     

      {/* User Table */}
      <div className="mt-4">
        <UserTable users={users} loading={loading} />
      </div>
    </div>
    </section>
    </>
  );
};

export default UserManagement;