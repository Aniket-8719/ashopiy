import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Layouts/Loader";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../actions/userAction";
import { FaIdCard, FaTrash } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";

const UpdateMerchantIDForm = () => {
   const dispatch = useDispatch();
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
      if (response?.data?.success) {
        toast.success("Merchant ID removed successfully");
        setMerchantID("");
        setIsMerchantIdSubmitted(false);
        // Refresh user data to reflect changes
        dispatch(loadUser());
      }
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
      toast.success(response?.data?.message || "Merchant ID updated successfully");
      setIsMerchantIdSubmitted(true);
      // Refresh user data to reflect changes
      dispatch(loadUser());
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false); // Stop loading
    }
  };

 


  return (
    <>
      <section className="mt-20 lg:ml-72 px-4 lg:px-6">
        <div className="max-w-md mx-auto">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <FaIdCard className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800">
              Merchant ID
            </h1>
            <p className="text-neutral-600 mt-2">
              {isMerchantIdSubmitted
                ? "Your payment processing identifier"
                : "Add your merchant ID to enable payments"}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 lg:p-8">
            {isMerchantIdSubmitted ? (
              // Display Merchant ID with option to delete
              <div className="space-y-6">
                <div className="text-center">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Your Merchant ID
                  </label>
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                    <code className="text-lg font-mono font-semibold text-primary-600 break-all">
                      {merchantID}
                    </code>
                  </div>
                  <p className="text-sm text-neutral-500 mt-2">
                    This ID is used for payment processing and transactions
                  </p>
                </div>

                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className={`w-full py-3 text-white font-medium rounded-lg transition-all ${
                    loading
                      ? "bg-neutral-400 cursor-not-allowed"
                      : "bg-error-600 hover:bg-error-700"
                  } shadow-md hover:shadow-lg flex items-center justify-center`}
                >
                  {loading ? (
                    <Loader />
                  ) : (
                    <>
                      <FaTrash className="mr-2" />
                      Remove Merchant ID
                    </>
                  )}
                </button>
              </div>
            ) : (
              // Form to add new Merchant ID
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Merchant ID
                  </label>
                  <input
                    type="text"
                    value={merchantID}
                    onChange={(e) => setMerchantID(e.target.value)}
                    placeholder="Enter your merchant ID"
                    className="w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    required
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    This is typically provided by your payment processor
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 text-white font-medium rounded-lg transition-all ${
                    loading
                      ? "bg-neutral-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                  } shadow-md hover:shadow-lg`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader />
                      <span className="ml-2">Processing...</span>
                    </div>
                  ) : (
                    "Save Merchant ID"
                  )}
                </button>
              </form>
            )}

            {/* Additional Information */}
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <div className="bg-primary-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-primary-800 mb-2 flex items-center">
                  <FaInfoCircle className="mr-2" />
                  About Merchant ID
                </h3>
                <ul className="text-xs text-primary-600 space-y-1">
                  <li>• Required for payment processing integration</li>
                  <li>• Provided by your payment service provider</li>
                  <li>• Used to identify your business in transactions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UpdateMerchantIDForm;
