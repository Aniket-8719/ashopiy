import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUdhar } from "../../../actions/udharAction";

const AddUdhar = () => {
  const dispatch = useDispatch();

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
    dispatch(addUdhar(formData));
  };

  return (
    <>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">
          Add Credit Entry
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
              placeholder="Enter customer name"
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
              type="number"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 text-neutral-700 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Enter phone number"
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
              placeholder="Enter address (optional)"
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
              placeholder="Enter description (optional)"
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
              placeholder="Enter amount"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all shadow-md hover:shadow-lg"
          >
            Add Credit
          </button>
        </form>
      </div>
    </>
  );
};

export default AddUdhar;
