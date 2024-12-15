import React from "react";

const ProfileSkelton = () => {
  return (
    <>
      <div className="flex justify-center items-center gap-2 animate-pulse">
        <div>
          {/* Skeleton for name */}
          <div className="h-4 md:h-6 w-32 bg-gray-300 rounded-md mb-2"></div>

          {/* Skeleton for joining date */}
          <div className="h-3 md:h-4 w-24 bg-gray-300 rounded-md"></div>
        </div>

        {/* Skeleton for profile image */}
        <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-300 rounded-full"></div>
      </div>
    </>
  );
};

export default ProfileSkelton;
