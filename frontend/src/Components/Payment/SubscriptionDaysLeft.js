import React from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaCrown, FaExclamationTriangle, FaCalendarAlt } from "react-icons/fa";

const SubscriptionDaysLeft = () => {
  const { user } = useSelector((state) => state.user);

  // Function to calculate total days left
  const calculateTotalDaysLeft = () => {
    if (!user?.subscription) return 0;

    const currentDate = moment();
    const { basic, premium } = user.subscription;

    // Collect relevant dates only for active plans
    const dates = [];

    if (basic?.isActive) {
      if (basic.startDate) dates.push(moment(basic.startDate));
      if (basic.endDate) dates.push(moment(basic.endDate));
    }

    if (premium?.isActive) {
      if (premium.startDate) dates.push(moment(premium.startDate));
      if (premium.endDate) dates.push(moment(premium.endDate));
    }

    // If no active dates are found, return 0
    if (dates.length === 0) return 0;

    // Find the maximum (latest) date
    const maxDate = moment.max(dates);

    // Calculate days left from current date to the maximum date
    const totalDaysLeft = maxDate.diff(currentDate, "days");
    return totalDaysLeft > 0 ? totalDaysLeft : 0;
  };

  const totalDaysLeft = calculateTotalDaysLeft();
  const hasActiveSubscription = user?.subscription?.basic?.isActive || user?.subscription?.premium?.isActive;

  // Determine status and styling
  const getStatusInfo = () => {
    if (!hasActiveSubscription) {
      return {
        color: "text-error-600",
        bgColor: "bg-error-50",
        icon: <FaExclamationTriangle className="text-error-600" />,
        status: "No Active Plan"
      };
    } else if (totalDaysLeft <= 7) {
      return {
        color: "text-warning-600",
        bgColor: "bg-warning-50",
        icon: <FaExclamationTriangle className="text-warning-600" />,
        status: "Expiring Soon"
      };
    } else {
      return {
        color: "text-success-600",
        bgColor: "bg-success-50",
        icon: <FaCrown className="text-success-600" />,
        status: "Active"
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-800 flex items-center">
          Subscription Status
        </h3>
        <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
          {statusInfo.icon}
          <span className="ml-1">{statusInfo.status}</span>
        </div>
      </div>

      {hasActiveSubscription ? (
        <div className="text-center">
          {/* Days Counter */}
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 bg-primary-100 rounded-lg mr-3">
              <FaCalendarAlt className="text-primary-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Days Remaining</p>
              <p className={`text-3xl font-bold ${statusInfo.color}`}>
                {totalDaysLeft}
              </p>
            </div>
          </div>
          
          {/* Plan Status */}
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className={`p-2 rounded-lg ${user?.subscription?.basic?.isActive ? "bg-primary-50 text-primary-700" : "bg-neutral-50 text-neutral-500"}`}>
                <p>Basic Plan</p>
                <p className="font-semibold">{user?.subscription?.basic?.isActive ? "Active" : "Inactive"}</p>
              </div>
              <div className={`p-2 rounded-lg ${user?.subscription?.premium?.isActive ? "bg-purple-50 text-purple-700" : "bg-neutral-50 text-neutral-500"}`}>
                <p>Premium Plan</p>
                <p className="font-semibold">{user?.subscription?.premium?.isActive ? "Active" : "Inactive"}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-neutral-500 mt-4">
            Total days remaining across all active subscriptions
          </p>
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="p-3 bg-error-100 rounded-full inline-flex mb-3">
            <FaExclamationTriangle className="text-error-600 text-2xl" />
          </div>
          <p className="text-error-600 font-semibold text-lg mb-2">No Active Subscription</p>
          <p className="text-neutral-500 text-sm mb-4">Upgrade to access premium features</p>
          <Link
            to="/pricing"
            className="inline-block px-5 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 transition-colors shadow-md hover:shadow-lg text-sm"
          >
            View Plans
          </Link>
        </div>
      )}
    </div>
  );
};

export default SubscriptionDaysLeft;