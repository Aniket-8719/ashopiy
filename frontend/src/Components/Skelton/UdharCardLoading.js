import React from "react";

const UdharCardLoading = () => {
  return (
    <>
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm relative animate-pulse">
        {/* Action buttons skeleton */}
        <div className="absolute top-3 right-3 flex items-center space-x-1">
          <div className="w-7 h-7 bg-neutral-200 rounded-lg"></div>
          <div className="w-7 h-7 bg-neutral-200 rounded-lg"></div>
        </div>

        <div className="pr-8">
          {/* Customer name skeleton */}
          <div className="h-6 w-3/4 bg-neutral-200 rounded mb-4"></div>

          <div className="mt-4 space-y-3">
            {/* Phone skeleton */}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-neutral-200 rounded mr-2"></div>
              <div className="h-4 w-1/2 bg-neutral-200 rounded"></div>
            </div>

            {/* Address skeleton */}
            <div className="flex items-start">
              <div className="w-4 h-4 bg-neutral-200 rounded mr-2 mt-0.5"></div>
              <div className="h-4 w-2/3 bg-neutral-200 rounded"></div>
            </div>

            {/* Description skeleton */}
            <div className="flex items-start">
              <div className="w-4 h-4 bg-neutral-200 rounded mr-2 mt-0.5"></div>
              <div className="h-4 w-3/4 bg-neutral-200 rounded"></div>
            </div>

            {/* Date & time skeleton */}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-neutral-200 rounded mr-2"></div>
              <div className="h-4 w-1/4 bg-neutral-200 rounded"></div>
              <div className="w-2 h-2 bg-neutral-200 rounded-full mx-2"></div>
              <div className="w-4 h-4 bg-neutral-200 rounded mr-2"></div>
              <div className="h-4 w-1/4 bg-neutral-200 rounded"></div>
            </div>
          </div>

          {/* Amount skeleton */}
          <div className="mt-4 pt-3 border-t border-neutral-100">
            <div className="h-6 w-1/3 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UdharCardLoading;
