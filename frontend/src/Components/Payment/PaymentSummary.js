import React from 'react';

const PaymentSummary = () => {
  const basicPlanPrice = 100;
  const platformFee = (basicPlanPrice * 0.02).toFixed(2);
  const gst = (platformFee * 0.18).toFixed(2);
  const totalPrice = (parseFloat(basicPlanPrice) + parseFloat(platformFee) + parseFloat(gst)).toFixed(2);

  return (
  <>
  <section className="md:ml-72">
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Order Summary</h2>

        {/* Pricing Breakdown */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-lg">
            <span>Basic Plan:</span>
            <span>₹{basicPlanPrice}</span>
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
            <span>₹{totalPrice}</span>
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
        <button className="w-full bg-blue-600 text-white py-3 rounded-md font-bold text-xl hover:bg-blue-700 transition duration-300">
          Buy Now for ₹{totalPrice}
        </button>

        {/* Security Badge (Optional for user trust) */}
        <div className="text-center text-sm text-gray-500 mt-4">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1">100% Secure Payment</span>
        </div>
      </div>
    </div>
  </section>
  </>
  );
};

export default PaymentSummary;
