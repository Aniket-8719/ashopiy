import React from 'react'
import Calendar from './Calender'

const ShowingCal = () => {
    const attendanceData = [
        { date: "17-12-2024", status: "present" },
        { date: "18-12-2024", status: "absent" },
        { date: "19-12-2024", status: "leave", reason: "Sick" },
        { date: "20-12-2024", status: "leave", reason: "Marriage" },
        // More data...
      ];
      
      
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Calendar attendanceData={attendanceData} />
    </div>
      
    </>
  )
}

export default ShowingCal
