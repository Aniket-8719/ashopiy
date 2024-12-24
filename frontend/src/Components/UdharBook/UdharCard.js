import React from "react";
import { MdDelete, MdModeEdit, MdOutlineFolderSpecial } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { deleteUdhar } from "../../actions/udharAction";
import moment from "moment-timezone";

const UdharCard = ({ udhar, loading, setIsUpdateModalOpen, setUpdateID }) => {
  const formattedDate = moment(udhar.date).format("DD/MM/YYYY");
  const formattedTime = moment(udhar.time, "HH:mm:ss").format("hh:mm A");
  const dispatch = useDispatch();
  const deleteIncomeHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this udhar record?")) {
      dispatch(deleteUdhar(id));
    }
  };

  return (
    <div className="max-w-md md:max-w-[280px]  w-full  mx-auto bg-white shadow-sm rounded-lg overflow-hidden border-2  border-gray-200 md:border-gray-300 relative">
      <div className="flex items-center justify-end absolute top-2 right-2">
        <button
          onClick={() => deleteIncomeHandler(udhar._id)}
          className="w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-600 rounded-full hover:bg-gray-400 hover:text-white"
        >
          <IoMdClose size={20} />
        </button>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {udhar.customerName}
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          <strong>Phone:</strong> {udhar.phoneNumber}
        </p>
        <p className="text-gray-600 text-sm mt-1">
          <strong>Address:</strong> {udhar.address}
        </p>
        {udhar.description && (
          <p className="text-gray-600 text-sm mt-1">
            <strong>Description:</strong> {udhar.description}
          </p>
        )}
        <div className="mt-2">
          <h3 className="font-medium text-gray-700">Date & Time:</h3>
          <ul className="flex justify-between items-center list-disc ml-5 mt-2 text-gray-600">
            <li className="text-sm">{formattedDate}</li>
            <li className="text-sm">{formattedTime}</li>
          </ul>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <p className="text-gray-800 text-lg font-bold">
            ₹{new Intl.NumberFormat("en-IN").format(udhar.udharAmount)}
          </p>
          <button className="rounded-full bg-blue-500 hover:bg-blue-500 w-[30px] h-[30px] flex items-center justify-center">
            <div>
              <MdModeEdit
                onClick={() => {
                  setIsUpdateModalOpen(true);
                  setUpdateID(udhar._id);
                }}
                className="text-white cursor-pointer"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UdharCard;
