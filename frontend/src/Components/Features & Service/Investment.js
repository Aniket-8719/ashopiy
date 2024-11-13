import React, { useEffect, useRef, useState } from "react";
import { MdDelete, MdModeEdit, MdOutlineFolderSpecial } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors } from "../../actions/earningAction";
import MetaData from "../Layouts/MetaData";
import Loader from "../Layouts/Loader";
import { toast } from "react-toastify";
import {
  addInvestment,
  deleteInvestment,
  getInvestment,
  updateInvestment,
} from "../../actions/investmentAction";
import {
  ADD_INVESTMENT_RESET,
  DELETE_INVESTMENT_RESET,
  UPDATE_INVESTMENT_RESET,
} from "../../constants/investmentConstants";

const Investment = () => {
  const columns = [
    { header: "S.R.", key: "s.r." },
    { header: "Date", key: "date" },
    { header: "Day", key: "day" },
    { header: "Time", key: "time" },
    { header: "Investment type", key: "investment type" },
    { header: "Investment amt", key: "investment" },
    { header: "Earning amt", key: "earning amt" },
    { header: "Profit/Loss", key: "profit" },
    { header: "Actions", key: "actions" },
  ];

  // Create a reference for the form section
  const formRef = useRef(null);
  const [editCheck, setEditCheck] = useState(false);
  const [updateId, setUpdatedID] = useState("");

  // Set default date to today's date in YYYY-MM-DD format
  // Set default date to the current India date

  const indiaDate = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  }); // Default format YYYY-MM-DD

  const [formData, setFormData] = useState({
    investmentIncomeByUser: "",
    typeOfInvestmentByUser: "",
    customDate: indiaDate,
  });

  const { investments, error, loading } = useSelector(
    (state) => state.investmentData
  );
  const { isAdded } = useSelector((state) => state.currentInvestment);
  const {
    error: deleteError,
    isDeleted,
    isUpdated,
    message,
  } = useSelector((state) => state.deleteUpdateInvestment);

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
    const { investmentIncomeByUser, typeOfInvestmentByUser, customDate } =
      formData;

    // Validate income input
    if (!investmentIncomeByUser || isNaN(investmentIncomeByUser)) {
      toast.error("Please enter a valid amount");
      return;
    }

    const earningData = {
      investmentIncomeByUser,
      typeOfInvestmentByUser: typeOfInvestmentByUser || "Normal",
      customDate,
    };
    if (editCheck) {
      dispatch(updateInvestment(updateId, earningData));
      setEditCheck(false);
    } else {
      dispatch(addInvestment(earningData));
    }
    setFormData({ investmentIncomeByUser: "", typeOfInvestmentByUser: "" });
  };

  //   // Handle update income
  const updateIncomeHandler = (id) => {
    formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    window.scrollBy(0, -300);
    const foundIncome = investments.find((item) => item.investment._id === id);
    if (!foundIncome) {
      toast.error(`${id} not found`);
      return;
    }

    // Extract the date in DD/MM/YY format and convert it to YYYY-MM-DD
    const [day, month, year] = foundIncome.investment.date.split("/");
    const formattedDate = `20${year}-${month}-${day}`; // Converts to YYYY-MM-DD format

    console.log(formattedDate);
    setFormData({
      investmentIncomeByUser: foundIncome.investment.investmentIncome,
      typeOfInvestmentByUser: foundIncome.investment.typeOfInvestment,
      customDate: formattedDate,
    });
    // Set edit mode to true
    setEditCheck(true);
    setUpdatedID(foundIncome.investment._id);
  };

  // Handle delete income
  const deleteIncomeHandler = (id) => {
    dispatch(deleteInvestment(id));
  };

  // Fetch today's earnings
  useEffect(() => {
    dispatch(getInvestment());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isAdded) {
      toast.success("Investment Added");
      dispatch({ type: ADD_INVESTMENT_RESET });
    }

    if (isUpdated) {
      toast.success(message);
      dispatch({ type: UPDATE_INVESTMENT_RESET });
    }
    if (isDeleted) {
      toast.success(message);
      dispatch({ type: DELETE_INVESTMENT_RESET });
    }
  }, [dispatch, error, isAdded, isUpdated, isDeleted]);

  // Calculate totals dynamically when rendering (optional)
  const investingMoney = investments?.reduce(
    (acc, dataKey) => acc + (dataKey?.investment?.investmentIncome || 0),
    0
  );
  const earningMoney = investments?.reduce(
    (acc, dataKey) => acc + (dataKey?.totalEarnings || 0),
    0
  );

  return (
    <>
      <MetaData title="INVESTMENT" />
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
              <div className="flex flex-col justify-center items-center w-full gap-4">
                <div className="flex w-full gap-2">
                  <div className="relative flex justify-center items-center w-full focus-within:border-blue-500 focus-within:ring-0.5 focus-within:ring-blue-500">
                    <span className="absolute top-[35%] left-2">
                      <FaIndianRupeeSign className="text-black focus-within:text-blue-500 opacity-65" />
                    </span>
                    <input
                      type="text"
                      id="investmentIncomeByUser"
                      name="investmentIncomeByUser"
                      required
                      value={formData.investmentIncomeByUser}
                      onChange={handleChange}
                      className="py-3 ps-8 w-full text-gray-700 leading-normal border md:border-2 border-slate-300 rounded-sm focus-within:outline-none focus-within:ring-0.5 focus-within:ring-blue-500 focus-within:border-blue-500"
                      placeholder="Enter amount....."
                    />
                  </div>
                  <div className="flex  justify-center items-center w-full border md:border-2 border-slate-300  relative focus-within:border-blue-500 focus-within:ring-0.5 focus-within:ring-blue-500 rounded-sm">
                    <input
                      type="date"
                      id="customDate"
                      name="customDate"
                      value={formData.customDate}
                      onChange={handleChange}
                      className="py-2 px-2  ps-6 w-full text-gray-700 leading-normal focus:outline-none focus:bg-white focus:border-blue-500 rounded-sm"
                    />
                  </div>
                </div>
                <div className="flex  justify-center items-center w-full border md:border-2 border-slate-300  relative focus-within:border-blue-500 focus-within:ring-0.5 focus-within:ring-blue-500 rounded-sm">
                  <span className="absolute top-[35%] left-2">
                    <MdOutlineFolderSpecial className="text-black focus-within:text-blue-500 opacity-65" />
                  </span>
                  <input
                    type="text"
                    id="typeOfInvestmentByUser"
                    name="typeOfInvestmentByUser"
                    value={formData.typeOfInvestmentByUser}
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
                {editCheck ? "Update Investment" : "Add Investment"}
              </button>
            </form>

            {/* Total amount display */}
            <div className="flex flex-col w-full  mx-auto gap-4  p-4 md:px-8 justify-center items-center border md:border-slate-300 rounded-lg md:shadow-lg ">
              {/* Box-1 */}
              <h1 className="text-xl md:text-2xl font-bold text-gray-700 md:mb-4">
                Overall Amount
              </h1>
              <div className="flex  w-full  mx-2 md:gap-8 items-center justify-between md:mx-16 ">
                <div className="">
                  <h1 className="text-sm md:text-md">Total Investing:</h1>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <h1 className="text-xl md:text-2xl text-green-500 font-bold">
                      +{investingMoney || 0}
                    </h1>
                  )}
                </div>
                <div className="">
                  <h1 className="text-sm md:text-md">Total Earning:</h1>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <h1 className="text-xl md:text-2xl font-bold text-purple-500">
                      +{earningMoney || 0}{" "}
                    </h1>
                  )}
                </div>
                <div className="">
                  <h1 className="text-sm md:text-md">Profit/Loss:</h1>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <h1 className="text-xl md:text-2xl font-bold text-purple-500">
                      {(() => {
                        const result =
                          (earningMoney || 0) - (investingMoney || 0);

                        return (
                          <span
                            className={`${
                              result > 0
                                ? "text-green-500 font-bold"
                                : "text-red-500 font-bold"
                            }`}
                          >
                            {result > 0 ? `+${result}` : result}
                          </span>
                        );
                      })()}
                    </h1>
                  )}
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
                    {investments?.length > 0 ? (
                      investments?.map((dataKey, index) => (
                        <tr key={dataKey.investment?.objectId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {index + 1}.
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Rs.{dataKey?.investment?.date || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {dataKey?.investment?.day || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {dataKey?.investment?.time || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {dataKey?.investment?.typeOfInvestment || "Normal"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {dataKey?.investment?.investmentIncome}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {dataKey?.totalEarnings}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {(() => {
                              const result =
                                (dataKey?.totalEarnings || 0) -
                                (dataKey?.investment?.investmentIncome || 0);

                              return (
                                <span
                                  className={`${
                                    result > 0
                                      ? "text-green-500 font-bold"
                                      : "text-red-500 font-bold"
                                  }`}
                                >
                                  {result > 0 ? `+${result}` : result}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap flex space-x-2 justify-center items-center">
                            <button
                              onClick={() => {
                                updateIncomeHandler(dataKey.investment?._id);
                              }}
                              className="rounded-full bg-blue-600 w-[30px] h-[30px] flex items-center justify-center"
                            >
                              <div>
                                <MdModeEdit className="text-white cursor-pointer" />
                              </div>
                            </button>
                            <button
                              onClick={() =>
                                deleteIncomeHandler(dataKey.investment?._id)
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
                        <td
                          colSpan={columns.length}
                          className="px-6 py-4 text-center"
                        >
                          No income data available
                          {/* <span> ( {InvestmentMoney.date})</span> */}
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

export default Investment;
