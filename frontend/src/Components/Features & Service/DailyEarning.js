import React, { useEffect, useRef, useState } from "react";
import { MdDelete, MdModeEdit, MdOutlineFolderSpecial } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import {
  addTodayEarning,
  clearErrors,
  deleteTodayIncome,
  getTodayEarning,
  updateTodayIncome,
} from "../../actions/earningAction";
import MetaData from "../Layouts/MetaData";
import Loader from "../Layouts/Loader";
import { toast } from "react-toastify";
import {
  ADD_TODAY_EARNING_RESET,
  DELETE_TODAY_EARNING_RESET,
  UPDATE_TODAY_EARNING_RESET,
} from "../../constants/earningConstants";
import moment from "moment-timezone";

const DailyEarning = () => {
  const columns = [
    { header: "Customers", key: "id" },
    { header: "Earning", key: "earning" },
    { header: "Time", key: "time" },
    { header: "Date", key: "date" },
    { header: "Actions", key: "actions" },
  ];

  // Create a reference for the form section
  const formRef = useRef(null);
  const [editCheck, setEditCheck] = useState(false);
  const [updateId, setUpdatedID] = useState("");
  const [formData, setFormData] = useState({
    dailyIncome: "",
    specialDay: "",
  });

  const { todayData, error, loading } = useSelector(
    (state) => state.todayEarnings
  );
  const { isAdded } = useSelector((state) => state.currentEarning);
  const {
    error: deleteError,
    isDeleted,
    isUpdated,
    message,
  } = useSelector((state) => state.deleteUpdateEarning);

  const dispatch = useDispatch();

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const { dailyIncome, specialDay } = formData;

    if (!dailyIncome || isNaN(dailyIncome)) {
      toast.error("Please enter a valid amount");
      return;
    }
    const earningData = {
      dailyIncome,
      specialDay: specialDay || "Normal",
    };

    if (editCheck) {
      dispatch(updateTodayIncome(updateId, earningData));
      setEditCheck(false);
    } else {
      dispatch(addTodayEarning(earningData));
    }
    setFormData({ dailyIncome: "", specialDay: "" });
  };

  // Handle update income
  const updateIncomeHandler = (id) => {
    formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    window.scrollBy(0, -300);
    const foundIncome = todayData.todayIncome.find(
      (item) => item.objectId === id
    );
    if (!foundIncome) {
      toast.error(`${id} not found`);
    }
    setFormData({
      dailyIncome: foundIncome.income,
      specialDay: foundIncome.specialDay,
    });
    // Set edit mode to true
    setEditCheck(true);
    setUpdatedID(foundIncome.objectId);
  };

  // Handle delete income
  const deleteIncomeHandler = (id) => {
    dispatch(deleteTodayIncome(id));
  };

  // Fetch today's earnings
  useEffect(() => {
    // Get the current date and time in Indian Standard Time (IST)
    const todayIST = moment.tz("Asia/Kolkata");
    const day = todayIST.date(); // Get the day of the month in IST
    const month = todayIST.month() + 1; // Get the month in IST (months are 0-indexed in moment.js)
    const year = todayIST.year(); // Get the year in IST

    dispatch(getTodayEarning(day, month, year));

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isAdded) {
      toast.success("Income Added");
      dispatch({ type: ADD_TODAY_EARNING_RESET });
    }

    if (isUpdated) {
      toast.success(message);
      dispatch({ type: UPDATE_TODAY_EARNING_RESET });
    }
    if (isDeleted) {
      toast.success(message);
      dispatch({ type: DELETE_TODAY_EARNING_RESET });
    }
  }, [dispatch, error, deleteError, isAdded, isDeleted, isUpdated]);
  return (
    <>
      <MetaData title="EARNING" />
      <section className="mt-14 md:mt-20  md:ml-72 h-screen">
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-2">
            {/* Add money */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col w-full gap-6 p-4 border md:border-slate-300 rounded-lg md:shadow-lg"
            >
              <div className="flex justify-center items-center w-full gap-4">
                <div className="relative flex justify-center items-center w-full focus-within:border-blue-500 focus-within:ring-0.5 focus-within:ring-blue-500">
                  <span className="absolute top-[35%] left-2">
                    <FaIndianRupeeSign className="text-black focus-within:text-blue-500 opacity-65" />
                  </span>
                  <input
                    type="text"
                    id="dailyIncome"
                    name="dailyIncome"
                    required
                    value={formData.dailyIncome}
                    onChange={handleChange}
                    className="py-3 ps-8 w-full text-gray-700 leading-normal border md:border-2 border-slate-300 rounded-sm focus-within:outline-none focus-within:ring-0.5 focus-within:ring-blue-500 focus-within:border-blue-500"
                    placeholder="Enter amount....."
                  />
                </div>
                <div className="flex  justify-center items-center w-full border md:border-2 border-slate-300  relative focus-within:border-blue-500 focus-within:ring-0.5 focus-within:ring-blue-500 rounded-sm">
                  <span className="absolute top-[35%] left-2">
                    <MdOutlineFolderSpecial className="text-black focus-within:text-blue-500 opacity-65" />
                  </span>
                  <input
                    type="text"
                    id="specialDay"
                    name="specialDay"
                    value={formData.specialDay}
                    onChange={handleChange}
                    className="py-3  ps-8 w-full text-gray-700 leading-normal focus:outline-none focus:bg-white focus:border-blue-500 rounded-sm"
                    placeholder="Any special Day"
                  />
                </div>
              </div>
              <button
                type="submit"
                className={`${
                  editCheck ? "bg-orange-600" : "bg-blue-600 "
                } py-3 flex items-center justify-center   text-white text-center rounded-sm `}
                disabled={loading}
              >
                {editCheck ? "Update" : "Add"}
              </button>
            </form>

            {/* Total amount display */}
            <div className="flex w-full  mx-auto gap-4  p-4 justify-between items-center border md:border-slate-300 rounded-lg md:shadow-lg ">
              {/* Box-1 */}
              <div className="flex flex-col  w-full  gap-2 md:gap-2 md:justify-center ">
                <div className="">
                  <h1 className="text-sm md:text-md">Total Income:</h1>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <h1 className="text-xl md:text-2xl text-green-500 font-bold">
                      +{todayData?.totalIncome || 0}
                    </h1>
                  )}
                </div>
                <div className="">
                  <h1 className="text-sm md:text-md">Customers:</h1>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <h1 className="text-xl md:text-2xl font-bold text-purple-500">
                      +{todayData?.totalCustomerCount || 0}{" "}
                    </h1>
                  )}
                </div>
              </div>

              {/* Box-2 */}
              <div className="flex flex-col  w-full  gap-4 md:gap-4  md:justify-center ">
                <div className="">
                  <h1 className="text-sm md:text-md">Day:</h1>
                  <h1 className="text-md md:text-lg">
                    {todayData?.day || "N/A"}
                  </h1>
                </div>
                <div className="">
                  <h1 className="text-sm md:text-md">Month:</h1>
                  <h1 className="text-md md:text-lg">
                    {todayData?.month || "N/A"}
                  </h1>
                </div>
              </div>

              {/* Box-3 */}
              <div className="flex flex-col  w-full  gap-4 md:gap-4  md:justify-center ">
                <div className="">
                  <h1 className="text-sm md:text-md">Shop Status:</h1>
                  {todayData?.totalCustomerCount > 0 ? (
                    <h1 className="text-md md:text-lg text-green-600">Open</h1>
                  ) : (
                    <h1 className="text-md md:text-lg text-red-600">Close</h1>
                  )}
                </div>
                <div className="">
                  <h1 className="text-sm md:text-md">Special Day:</h1>
                  <h1 className="text-md md:text-lg text-purple-600">
                    {todayData.latestSpecialDay}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white mt-4 overflow-x-auto relative max-h-[700px] md:max-h-[620px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-900 text-white sticky top-0 z-10">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className="px-6 py-3 text-center text-md font-medium uppercase tracking-wider"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200 text-center relative">
                {/* Conditionally render the loader inside tbody */}
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="relative h-32">
                      <div className="absolute inset-0 flex justify-center items-center">
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {todayData?.todayIncome?.length > 0 ? (
                      todayData.todayIncome.map((dataKey, index) => (
                        <tr key={dataKey.objectId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {index + 1}.
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Rs.{dataKey?.income || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {dataKey?.time || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {todayData?.date || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap flex space-x-2 justify-center items-center">
                            <button
                              onClick={() => {
                                updateIncomeHandler(dataKey.objectId);
                              }}
                              className="rounded-full bg-blue-600 w-[30px] h-[30px] flex items-center justify-center"
                            >
                              <div>
                                <MdModeEdit className="text-white cursor-pointer" />
                              </div>
                            </button>
                            <button
                              onClick={() =>
                                deleteIncomeHandler(dataKey.objectId)
                              }
                              className="rounded-full bg-red-600 w-[30px] h-[30px] flex items-center justify-center"
                            >
                              <button>
                                <MdDelete className="flex text-30 text-white cursor-pointer" />
                              </button>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center">
                          No income data available
                          <span> ( {todayData.date})</span>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </>
      </section>
    </>
  );
};

export default DailyEarning;
