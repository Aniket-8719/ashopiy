import React, { useEffect, useState, useRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { HiOutlineMenu } from "react-icons/hi";
import Options from "./Options";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment-timezone";
import defaultUserImg from "../assests/default-user-profile-img.png";
import ProfileSkelton from "../Skelton/ProfileSkelton";

const TopNavbar = ({ setMobileToggle }) => {
  const [showOptions, setShowOptions] = useState(false);
  const profileRef = useRef(null);

  const { isAuthenticated, user, loading } = useSelector(
    (state) => state.user
  );

  const joiningDate = moment(user?.createdAt).format('DD/MM/YYYY');

  useEffect(() => {
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
      <div className="flex fixed z-40 bg-white top-0 left-0 justify-between items-center w-full px-4 py-3 border-b border-neutral-200 shadow-sm">
        <div className="flex justify-center items-center gap-4">
          {/* Hamburger */}
          <div
            className="lg:hidden cursor-pointer p-1 rounded-md hover:bg-neutral-100 transition-colors"
            onClick={() => setMobileToggle(showOptions)}
          >
            <HiOutlineMenu className="text-2xl text-neutral-700" />
          </div>

          {/* Logo */}
          <Link to={"/"} className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ashopiy
            </h1>
            <span className="ml-1 text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded-full hidden md:block">
              Business
            </span>
          </Link>
        </div>

        {/* Right side - profile image or details */}
        <div className="flex items-center" ref={profileRef}>
          
          {loading ? (
            <ProfileSkelton />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3 " >
              <div className="hidden md:block text-right mr-2">
                <h1 className="text-sm font-semibold text-neutral-800">
                  {user?.Name}
                </h1>
                <p className="text-xs text-neutral-500">
                  Joined: <span>{joiningDate}</span>
                </p>
              </div>
              
              {/* Profile dropdown */}
              <div
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center cursor-pointer p-1 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <div className="relative">
                  <img
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm"
                    src={user?.avatar?.url || defaultUserImg}
                    alt={"profile"}
                  />
                  <div className="absolute -bottom-1 -right-0 w-3 h-3 bg-success-500 rounded-full border-2 border-white"></div>
                </div>
                <RiArrowDropDownLine className={`text-2xl text-neutral-500 transition-transform ${showOptions ? 'rotate-180' : ''}`} />
              </div>
              
              {/* Dropdown menu */}
              <div
                className={`${
                  showOptions
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                } absolute top-full right-4 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 transition-all duration-200 ease-out z-50`}
              >
                <Options />
              </div>
            </div>
          ) : (
            <Link to={"/login"}>
              <button className="flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-sm font-medium shadow-sm hover:shadow-md transition-all hover:from-primary-700 hover:to-secondary-700">
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