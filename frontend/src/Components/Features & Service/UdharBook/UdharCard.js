import React from "react";
import { MdModeEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { deleteUdhar } from "../../../actions/udharAction";
import moment from "moment-timezone";
import { FaCalendar, FaClock, FaPhone } from "react-icons/fa6";
import { FaInfoCircle, FaMapMarkerAlt } from "react-icons/fa";

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
    <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-shadow relative">
      <div className="absolute top-3 right-3 flex items-center space-x-1">
        <button
          onClick={() => {
            setIsUpdateModalOpen(true);
            setUpdateID(udhar._id);
          }}
          className="w-7 h-7 flex items-center justify-center bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
          title="Edit"
        >
          <MdModeEdit size={14} />
        </button>
        <button
          onClick={() => deleteIncomeHandler(udhar._id)}
          className="w-7 h-7 flex items-center justify-center bg-error-100 text-error-600 rounded-lg hover:bg-error-200 transition-colors"
          title="Delete"
        >
          <IoMdClose size={16} />
        </button>
      </div>

      <div className="pr-8">
        <h2 className="text-lg font-semibold text-neutral-800 truncate">
          {udhar.customerName}
        </h2>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-neutral-600">
            <FaPhone className="mr-2 text-neutral-400" size={12} />
            <span>{udhar.phoneNumber}</span>
          </div>

          {udhar.address && (
            <div className="flex items-start text-sm text-neutral-600">
              <FaMapMarkerAlt
                className="mr-2 mt-0.5 text-neutral-400"
                size={12}
              />
              <span className="break-words">{udhar.address}</span>
            </div>
          )}

          {udhar.description && (
            <div className="flex items-start text-sm text-neutral-600">
              <FaInfoCircle
                className="mr-2 mt-0.5 text-neutral-400"
                size={12}
              />
              <span className="break-words">{udhar.description}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-neutral-600">
            <FaCalendar className="mr-2 text-neutral-400" size={12} />
            <span>{formattedDate}</span>
            <span className="mx-2">•</span>
            <FaClock className="mr-2 text-neutral-400" size={12} />
            <span>{formattedTime}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">
            ₹{new Intl.NumberFormat("en-IN").format(udhar.udharAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UdharCard;
