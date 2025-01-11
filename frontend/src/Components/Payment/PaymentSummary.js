import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../Layouts/Loader";

const PaymentSummary = () => {
  const [loading, setLoading] = useState(false); // Loading state
  const [CalbackLoading, setCalbackLoading] = useState(false); // Loading state
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const { planName, price } = location.state;
  const platformFee = (price * 0.02).toFixed(2);
  const gst = (platformFee * 0.18).toFixed(2);
  const amount = (
    parseFloat(price) +
    parseFloat(platformFee) +
    parseFloat(gst)
  ).toFixed(2);

  const checkoutHandler = async (amount) => {
    // const userId = user._id;
    const planNameLowercase = planName.toLowerCase();
    try {
      setLoading(true); // Start loading
      const {
        data: { key },
      } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v2/getKey`,
        { amount } // Send amount inside an object
      );
      const {
        data: { order },
      } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v2/checkout`,
        { amount, planName: planNameLowercase }, // Send amount inside an object
        {
          withCredentials: true, // Include cookies with the request
        }
      );

      // Step 2: Set Razorpay options with order details
      const options = {
        key, // Razorpay key_id
        amount: order.amount, // Amount from the backend
        currency: "INR", // Currency type
        name: "Subscription Payment",
        order_id: order.id, // Razorpay order ID
        callback_url: `${process.env.REACT_APP_BACKEND_URL}/api/v2/payment-success`, // Callback URL for payment verification
        prefill: {
          name: user?.shopOwnerName,
          email: user?.email,
          contact: user?.mobileNo || user?.whatsappNo,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            // Razorpay modal closed without payment
            console.log("Razorpay modal closed");
            setCalbackLoading(false); // Stop callback loading
          },
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setCalbackLoading(true);
    } catch (error) {
      console.error(
        "Error during checkout:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message);
      setCalbackLoading(false);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <section className="md:ml-72">
        {CalbackLoading ? (
          <div className="flex justify-center items-center h-screen">
            <Loader />
          </div>
        ) : (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                Order Summary
              </h2>

              {/* Pricing Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span>{planName}:</span>
                  <span>₹{price}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Razorpay Platform Fee (2%):</span>
                  <span>₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>GST (18% on Platform Fee):</span>
                  <span>₹{gst}</span>
                </div>
                <hr className="border-t border-gray-300" />
                <div className="flex justify-between text-xl font-semibold">
                  <span>Total:</span>
                  <span>₹{amount}</span>
                </div>
              </div>

              {/* Payment Methods (Optional for trust signals) */}
              <div className="mb-6 text-center text-sm text-gray-600">
                <p>We accept all major payment methods via Razorpay</p>
                {/* <img
            src="https://cdn.razorpay.com/static/assets/logo/payment.png"
            alt="Razorpay Payment Methods"
            className="mx-auto w-48 mt-2"
          /> */}
              </div>

              {/* Buy Now Button */}
              <button
                onClick={() => checkoutHandler(amount)}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-md font-bold text-xl hover:bg-blue-700 transition duration-300"
              >
                {loading ? "Processing..." : `Buy Now for ₹${amount}`}
              </button>

              {/* Security Badge (Optional for user trust) */}
              <div className="text-center text-sm text-gray-500 mt-4">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1">
                  100% Secure Payment
                </span>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default PaymentSummary;
