// holidayLibrary.js

const holidaysData = {
  IN: {
    "01/01/2024": "New Year's Day",
    "15/08/2024": "Independence Day",
    "30/11/2024": "Testing Day",
    "01/12/2024": "Devolpment Day",
    "18/12/2024": "Guru Ghasidas Jayanti",
    "25/12/2024": "Christmas Day",

    // Holiday list 2025
    "01/01/2025": "New Year's Day",
    "06/01/2025": "Guru Gobind Singh Jayanti",
    "12/01/2025": "Swami Vivekananda Jayanti",
    "14/01/2025": "Makara Sankranti",
    "23/01/2025": "Netaji Subhas Chandra Bose Jayanti",
    "26/01/2025": "Republic Day",
    "03/02/2025": "Vasant Panchami",
    "12/02/2025": "Guru Ravidas Jayanti",
    "26/02/2025": "Maha Shivaratri",
    "14/03/2025": "Holi",
    "06/04/2025": "Ram Navami",
    "10/04/2025": "Mahavir Jayanti",
    "13/04/2025": "Vaisakh",
    "18/04/2025": "Good Friday",
    "29/04/2025": "Maharshi Parasuram Jayanti",
    "08/05/2025": "Guru Rabindranath Jayanti",
    "12/05/2025": "Buddha Purnima",
    "29/05/2025": "Maharana Pratap Jayanti",
    "11/06/2025": "Sant Guru Kabir Jayanti",
    "27/06/2025": "Ratha Yathra",
    "06/07/2025": "Muharram",
    "09/08/2025": "Raksha Bandhan",
    "15/08/2025": "Independence Day",
    "16/08/2025": "Janmashtami",
    "27/08/2025": "Ganesh Chaturthi",
    "05/09/2025": "Eid e Milad",
    "01/10/2025": "Maha Navami",
    "02/10/2025": "Gandhi Jayanti & Vijaya Dashami",
    "06/10/2025": "Lakshmi Puja",
    "07/10/2025": "Maharishi Valmiki Jayanti",
    "10/10/2025": "Karwa Chauth",
    "21/10/2025": "Diwali",
    "23/10/2025": "Bhai Dooj",
    "27/10/2025": "Chhath Puja",
    "05/11/2025": "Guru Nanak Jayanti",
    "25/12/2025": "Christmas Day",
    "31/12/2025": "New Year's Eve",

    // Holiday list 2026
    "01/01/2026": "New Year's Day",
    "12/01/2026": "Swami Vivekananda Jayanti",
    "14/01/2026": "Makara Sankranti",
    "23/01/2026": "Vasant Panchami",
    "26/01/2026": "Republic Day",
    "01/02/2026": "Guru Ravidas Jayanti",
    "15/02/2026": "Maha Shivaratri",
    "19/02/2026": "Chhatrapati Shivaji Maharaj Jayanti",
    "03/03/2026": "Holi",
    "27/03/2026": "Ram Navami",
    "31/03/2026": "Mahavir Jayanti",
    "03/04/2026": "Good Friday",
    "14/04/2026": "Dr Ambedkar Jayanti",
    "09/05/2026": "Guru Rabindranath Jayanti",
    "17/06/2026": "Maharana Pratap Jayanti",
    "26/06/2026": "Muharram",
    "16/07/2026": "Ratha Yatra",
    "15/08/2026": "Independence Day",
    "25/08/2026": "Eid-e-Milad",
    "28/08/2026": "Raksha Bandhan",
    "04/09/2026": "Janmashtami",
    "15/09/2026": "Ganesh Chaturthi",
    "21/09/2026": "Teja Dashmi",
    "02/10/2026": "Gandhi Jayanti",
    "19/10/2026": "Maha Navami",
    "20/10/2026": "Dussehra",
    "21/10/2026": "Vijaya Dashami",
    "25/10/2026": "Lakshmi Puja",
    "26/10/2026": "Maharishi Valmiki Jayanti",
    "31/10/2026": "Sardar Vallabhbhai Patel Jayanti",
    "08/11/2026": "Diwali",
    "09/11/2026": "Govardhan Puja",
    "11/11/2026": "Bhai Dooj",
    "15/11/2026": "Chhath Puja",
    "24/11/2026": "Guru Nanak Jayanti",
    "18/12/2026": "Guru Ghasidas Jayanti",
    "25/12/2026": "Christmas Day",
    "31/12/2026": "New Year's Eve",

    // Add more holidays here
  },
  // More countries can be added here
};

/**
 * Function to get the holiday name based on the given day, month, year, and country code.
 * @param {number} day - The day of the month.
 * @param {number} month - The month (1-indexed).
 * @param {number} year - The year (yyyy).
 * @param {string} countryCode - The country code (e.g., 'IN').
 * @returns {string} The holiday name or 'No holiday on this day' if not found.
 */
function getHolidayName(day, month, year, countryCode) {
  // Format the date into dd/mm/yyyy
  const formattedDate = `${String(day).padStart(2, "0")}/${String(
    month
  ).padStart(2, "0")}/${year}`;

  // Look up the holiday for the formatted date
  if (holidaysData[countryCode] && holidaysData[countryCode][formattedDate]) {
    return holidaysData[countryCode][formattedDate];
  }

  return "Normal";
}

module.exports = getHolidayName;
