import React from "react";
import UdharCard from "./UdharCard";

const UdharList = ({ udharRecords }) => {
  return (
    <div className="md:ml-72 mt-72 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* {udharRecords.map((udhar) => ( */}
        <UdharCard  />
      {/* ))} */}
    </div>
  );
};

export default UdharList;
