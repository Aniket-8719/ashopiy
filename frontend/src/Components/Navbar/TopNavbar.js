import React, { useEffect, useState, useRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { HiOutlineMenu } from "react-icons/hi";
import Options from "./Options";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment-timezone";
import defaultUserImg from "../assests/default-user-profile-img.png";

const TopNavbar = ({ setMobileToggle }) => {
  const [showOptions, setShowOptions] = useState(false);
  const profileRef = useRef(null); // To track clicks on the image

  const {isAuthenticated,user } = useSelector(
    (state) => state.user
  );

  const joiningDate = moment(user?.createdAt).format('DD/MM/YYYY');

  useEffect(() => {
    // Close the dropdown when clicking outside of the profile image
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="">
      <div className="flex fixed z-40 backdrop-filter backdrop-blur-lg bg-opacity-30 bg-white  top-0 left-0 justify-between items-center w-full p-2 border border-b-slate-200 md:border-b-slate-300">
        <div className="flex justify-center items-center gap-4 ml-2">
          {/* Hamburger */}
          <div
            className="md:hidden"
            onClick={() => setMobileToggle(showOptions)}
          >
            <HiOutlineMenu className="text-3xl text-gray-900 " />
          </div>

          {/* Project Name */}
          <Link to={"/"}>
            <h1 className="md:pl-2 text-2xl font-bold md:text-4xl text-amber-600">
              ashopiy
            </h1>
          </Link>
        </div>

        {/* Right side :- profile image or details */}
        <div className="flex flex-col items-center justify-center">
          {isAuthenticated ? (
            <div className="flex justify-center items-center gap-2">
              <div>
                <h1 className="text-right text-md md:text-lg font-bold">
                  {user?.shopOwnerName}
                </h1>
                <p className="text-[8px] md:text-sm">Joining:<span>{" "}{joiningDate}</span></p>
              </div>
              {/* Options navbar */}
              <div
                ref={profileRef} // Attach ref to profile image wrapper
                onClick={() => setShowOptions(!showOptions)} // Toggle on image click
                className="flex items-center justify-center gap-2 md:gap-0"
              >
                <div className="relative">
                  <img
                    className="w-8 h-8 md:w-12 md:h-12 rounded-full"
                    src={user?.avatar?.url || defaultUserImg}
                    alt={"profile"}
                  />
                  <div
                    className={`${
                      showOptions
                        ? "top-[2.5rem] md:top-[3.5rem] z-50 right-20"
                        : "-top-24 -z-50 -right-52"
                    } absolute  w-full transition-all ease-in-out duration-150`}
                  >
                    <Options />
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <RiArrowDropDownLine className="text-xl -ml-2 md:-ml-0 md:text-2xl font-bold" />
                </div>
              </div>
            </div>
          ) : (
            <Link to={"/login"}>
              <button className="flex justify-center items-center px-6 py-2 rounded-md bg-amber-600 border border-amber-600 text-white  text-md mr-2 md:mr-4">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
