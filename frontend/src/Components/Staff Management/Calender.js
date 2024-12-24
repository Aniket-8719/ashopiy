import React, { useState, useEffect } from "react";
import moment from "moment";

const Calendar = ({ attendanceData }) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment().format("DD-MM-YYYY"));
  const [hoveredLeaveReason, setHoveredLeaveReason] = useState(""); // Track leave reason on hover

  const daysOfWeek = moment.weekdaysShort();

  // Previous month handler
  const prevMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, "month"));
  };

  // Next month handler
  const nextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, "month"));
  };

  // Handle day click
  const selectDate = (day) => {
    const selected = currentDate.clone().date(day);
    setSelectedDate(selected.format("DD-MM-YYYY"));
  };

  // Function to get attendance status for a specific day
  const getAttendanceStatus = (day) => {
    const date = currentDate.clone().date(day).format("DD-MM-YYYY");
    const attendance = attendanceData.find((item) => item.date === date);
    return attendance || null; // Return full object or null
  };

  // Generate days in the month
  const renderDays = () => {
    const startOfMonth = currentDate.clone().startOf("month");
    const daysInMonth = currentDate.daysInMonth();
    const startDay = startOfMonth.day(); // Day index where the month starts

    const daysArray = [];
    for (let i = 0; i < startDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className="text-gray-400"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = currentDate.clone().date(day).format("DD-MM-YYYY") === selectedDate;
      const isToday = currentDate.clone().date(day).isSame(moment(), "day");

      const attendance = getAttendanceStatus(day);
      const status = attendance?.status || "";
      const reason = attendance?.reason || "";

      // Determine the background color based on attendance status
      let bgColor = "";
      if (status === "present") bgColor = "bg-green-500"; // Green for present
      else if (status === "absent") bgColor = "bg-red-500"; // Red for absent
      else if (status === "leave") bgColor = "bg-violet-500"; // Violet for leave

      daysArray.push(
        <div
          key={day}
          onClick={() => selectDate(day)}
          onMouseEnter={() => setHoveredLeaveReason(reason)} // Show reason on hover
          onMouseLeave={() => setHoveredLeaveReason("")} // Hide reason when not hovering
          className={`relative cursor-pointer w-10 h-10 flex items-center justify-center rounded-full 
          ${isSelected ? "bg-blue-500 text-white" : isToday ? "bg-gray-200" : "hover:bg-gray-100"}
          ${bgColor}`}
        >
          {day}
          {/* Tooltip for leave reason */}
          {status === "leave" && hoveredLeaveReason && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded p-1 shadow-lg z-10 whitespace-nowrap">
              {hoveredLeaveReason}
            </div>
          )}
        </div>
      );
    }

    return daysArray;
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md p-5">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-5">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          &lt;
        </button>
        <h2 className="text-lg font-semibold">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          &gt;
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 text-center mb-2 text-gray-600">
        {daysOfWeek.map((day) => (
          <div key={day} className="font-semibold">
            {day}
          </div>
        ))}
      </div>

      {/* Days of Month */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {renderDays()}
      </div>

      {/* Selected Date */}
      <p className="mt-5 text-center text-gray-700">
        Selected Date:{" "}
        <span className="font-bold text-blue-500">{selectedDate}</span>
      </p>
    </div>
  );
};

export default Calendar;
