import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../Layouts/Loader";
import { FaShieldAlt } from "react-icons/fa";

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
          name: user?.Name,
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
      <section className="lg:ml-72 px-4 lg:px-6">
        <div className="max-w-2xl mx-auto">
          {CalbackLoading ? (
            <div className="flex justify-center items-center min-h-screen">
              <Loader />
            </div>
          ) : (
            <div className="min-h-screen flex items-center justify-center py-12">
              <div className="w-full bg-white rounded-xl border border-neutral-200 p-8 shadow-sm">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-neutral-800 mb-2">
                    Order Summary
                  </h2>
                  <p className="text-neutral-600">
                    Review your subscription details
                  </p>
                </div>

                {/* Pricing Breakdown */}
                <div className="bg-neutral-50 rounded-lg p-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-700">{planName}:</span>
                      <span className="font-medium">₹{price}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-neutral-700">
                        Razorpay Platform Fee (2%):
                      </span>
                      <span className="font-medium">₹{platformFee}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-neutral-700">
                        GST (18% on Platform Fee):
                      </span>
                      <span className="font-medium">₹{gst}</span>
                    </div>

                    <hr className="border-neutral-200" />

                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span className="text-neutral-800">Total Amount:</span>
                      <span className="text-primary-600">₹{amount}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Security */}
                <div className="flex items-center justify-center mb-8 text-sm text-neutral-500">
                  <div className="flex items-center">
                    <FaShieldAlt className="mr-2 text-success-600" />
                    <span>100% Secure Payment powered by Razorpay</span>
                  </div>
                </div>

                {/* Buy Now Button */}
                <button
                  onClick={() => checkoutHandler(amount)}
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                    loading
                      ? "bg-neutral-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                  } shadow-md hover:shadow-lg`}
                >
                  {loading ? "Processing..." : `Pay ₹${amount}`}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PaymentSummary;
