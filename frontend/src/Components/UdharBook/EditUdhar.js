import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSingleUdhar, updateUdhar } from '../../actions/udharAction';

const EditUdhar = ({updateID}) => {

    const dispatch = useDispatch();
    const {singleUdharDetails} = useSelector((state)=> state.singleUdhar)

  
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
      dispatch(updateUdhar(updateID,formData));
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
    <h2 className="text-2xl font-bold mb-4 text-gray-700">Update Udhar Entry</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="customerName"
          className="block text-sm font-medium text-gray-700"
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
          className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
        />
      </div>
      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700"
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
          className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
        />
      </div>
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
        />
      </div>
      <div>
        <label
          htmlFor="udharAmount"
          className="block text-sm font-medium text-gray-700"
        >
          Udhar Amount
        </label>
        <input
          type="number"
          id="udharAmount"
          name="udharAmount"
          value={formData.udharAmount}
          onChange={handleChange}
          required
          className="mt-2 w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none  focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center  w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Udhar
      </button>
    </form>
  </>
  )
}

export default EditUdhar
