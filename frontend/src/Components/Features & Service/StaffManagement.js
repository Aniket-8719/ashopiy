import React from "react";
import { Player} from "@lottiefiles/react-lottie-player";
import MetaData from "../Layouts/MetaData";

const StaffManagement = () => {
  return (
    <>
    <MetaData title={"STAFF MANAGEMENT"} />
      <section className="mt-20 md:mt-0  md:ml-72">
        <div className="flex flex-col items-center justify-center  px-4">
          <div className="flex w-full text-[50px] justify-center  ">
            <Player
              autoplay
              loop
              src="https://lottie.host/0f7b68a7-5f52-4af3-9f9c-5be71335984b/Hc3icCdhIM.json"
              className="w-[350px] h-[350px] md:w-[600px] md:h-[600px]"
            ></Player>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center -mt-12 md:-mt-20">
            Coming Soon
          </h1>
          <p className="text-lg md:text-xl  mb-8 text-center">
            We're working hard to bring something amazing! Stay tuned.
          </p>
        </div>
      </section>
    </>
  );
};

export default StaffManagement;
