import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUdhar, updateUdhar } from "../../../actions/udharAction";

const EditUdhar = ({ updateID }) => {
  const dispatch = useDispatch();
  const { singleUdharDetails, loading } = useSelector(
    (state) => state.singleUdhar
  );

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    address: "",
    description: "",
    udharAmount: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUdhar(updateID, formData));
  };
  // Fetch single Udhar details and prefill the form
  useEffect(() => {
    if (updateID) {
      dispatch(getSingleUdhar(updateID));
    }
  }, [dispatch, updateID]);

  useEffect(() => {
    if (singleUdharDetails) {
      setFormData({
        customerName: singleUdharDetails.customerName || "",
        phoneNumber: singleUdharDetails.phoneNumber || "",
        address: singleUdharDetails.address || "",
        description: singleUdharDetails.description || "",
        udharAmount: singleUdharDetails.udharAmount || "",
      });
    }
  }, [singleUdharDetails]);

  return (
    <>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">
          Update Credit Entry
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="udharAmount"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Credit Amount
            </label>
            <input
              type="number"
              id="udharAmount"
              name="udharAmount"
              value={formData.udharAmount}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-medium rounded-lg transition-all ${
              loading
                ? "bg-neutral-400 cursor-not-allowed"
                : "bg-warning-600 hover:bg-warning-700"
            } shadow-md hover:shadow-lg`}
          >
            {loading ? "Updating..." : "Update Credit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditUdhar;
