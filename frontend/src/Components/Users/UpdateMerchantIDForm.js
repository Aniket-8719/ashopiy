import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Layouts/Loader";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../actions/userAction";


const UpdateMerchantIDForm = () => {
  const { user } = useSelector((state) => state.user);
  const API_URL = process.env.REACT_APP_BACKEND_URL;
  const [merchantID, setMerchantID] = useState(user?.merchantID || "");
  const [loading, setLoading] = useState(false);
  const [isMerchantIdSubmitted, setIsMerchantIdSubmitted] = useState(
    !!user?.merchantID
  ); 

  // Handle deleting the Merchant ID
  const handleDelete = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const response = await axios.put(
        `${API_URL}/api/v2/user/add-merchant-id`,
        { merchantID: null }, // Send null to delete the Merchant ID
        config
      );
      if (response.data.success) {
        toast.success("Merchant ID removed successfully");
      }
      setMerchantID(""); // Reset Merchant ID
      setIsMerchantIdSubmitted(false); // Show form after deleting
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const response = await axios.put(
        `${API_URL}/api/v2/user/add-merchant-id`,
        { merchantID },
        config
      );
      toast.success(
        response.data.message || "Merchant ID updated successfully"
      );
      setIsMerchantIdSubmitted(true); // Set submission state
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  const dispatch = useDispatch();
//   // merchantID
//   const [deleteloading, setDeleteLoading] = useState(false);

  useEffect(() => {
      dispatch(loadUser());
  }, [dispatch, loading]);

  return (
    <>
      <section className="mt-14 md:mt-20 md:ml-72">
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-10">
          <h1 className="text-xl font-bold text-center mb-6">
            {isMerchantIdSubmitted ? "Your Merchant ID" : "Add Merchant ID"}
          </h1>

          {isMerchantIdSubmitted ? (
            // If merchantID exists, show the merchantID and Delete button
            <div className="space-y-4">
              <p className="text-center text-gray-700">{merchantID}</p>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {loading ? <Loader /> : "Delete Merchant ID"}
              </button>
            </div>
          ) : (
            // If no merchantID, show the form to add a new one
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Merchant ID
                </label>
                <input
                  type="text"
                  value={merchantID}
                  onChange={(e) => setMerchantID(e.target.value)}
                  placeholder="Enter Merchant ID"
                  className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? <Loader /> : "Submit Merchant ID"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default UpdateMerchantIDForm;
