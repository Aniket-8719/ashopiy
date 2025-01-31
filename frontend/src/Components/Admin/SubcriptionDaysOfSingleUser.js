import React from "react";
import moment from "moment";

const SubcriptionDaysOfSingleUser = ({ user }) => {
  // Function to calculate total days left
  const calculateTotalDaysLeft = () => {
    if (!user?.subscription) return 0;

    const currentDate = moment(); // Current date
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
    // const totalDaysLeft = Math.round(maxDate.diff(currentDate, "days") / 24);

    // Return days left or 0 if the maxDate is in the past
    return totalDaysLeft > 0 ? totalDaysLeft : 0;
  };

  const totalDaysLeft = calculateTotalDaysLeft();

  // Conditional style for color
  const textColor = totalDaysLeft <= 7 ? "text-red-600" : "text-indigo-600";

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        Subscription Days Left
      </h2>
      {user?.subscription?.basic?.isActive ||
      user?.subscription?.premium?.isActive ? (
        <div>
          <div className="flex items-center justify-center w-full">
            <span className={`text-4xl font-bold ${textColor}`}>
              {totalDaysLeft}
            </span>
            <span className="ml-2 text-xl text-gray-500">days</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This is the total number of days left across all active
            subscriptions.
          </p>
        </div>
      ) : (
        <p className="text-red-600 text-4xl font-bold">Unsubscribed</p>
      )}
    </div>
  );
};

export default SubcriptionDaysOfSingleUser;
