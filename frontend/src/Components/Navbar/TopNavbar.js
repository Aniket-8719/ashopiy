import React, { useEffect, useState, useRef } from "react";
import profileImg from "../assests/profile img.jpg";
import { RiArrowDropDownLine } from "react-icons/ri";
import { HiOutlineMenu } from "react-icons/hi";
import Options from "./Options";

const TopNavbar = ({ setMobileToggle }) => {
  const [showOptions, setShowOptions] = useState(false);
  const profileRef = useRef(null); // To track clicks on the image

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
      <div className="flex fixed z-20 backdrop-filter backdrop-blur-lg bg-opacity-30 bg-white  top-0 left-0 justify-between items-center w-full p-2 border border-b-slate-200 md:border-b-slate-300">
        <div className="flex justify-center items-center gap-4 ml-2">

          {/* Hamburger */}
          <div onClick={() => setMobileToggle(showOptions)}>
            <HiOutlineMenu className="text-3xl text-gray-900 " />
          </div>

          {/* Project Name */}
          <div>
            <h1 className="text-blue-600 font-bold">Project EX</h1>
          </div>
        </div>

        {/* Right side :- profile image or details */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex justify-center items-center gap-2">
            <div>
              <h1 className="text-right text-md md:text-lg font-bold">
                Aniket
              </h1>
              <p className="text-[8px] md:text-sm">Joining: 06/10/2024</p>
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
                  src={profileImg}
                  alt={"profileImg"}
                />
                <div
                  className={`${
                    showOptions
                      ? "top-[2.5rem] md:top-[3.5rem] z-10 right-28"
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
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
