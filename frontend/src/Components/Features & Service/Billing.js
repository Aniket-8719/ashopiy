import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import MetaData from "../Layouts/MetaData";

const Billing = () => {
  // const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // Calculate time remaining for a target date
  // function calculateTimeLeft() {
  //   const targetDate = new Date("2024-12-31T23:59:59").getTime();
  //   const now = new Date().getTime();
  //   const difference = targetDate - now;

  //   if (difference <= 0) return null;

  //   return {
  //     days: Math.floor(difference / (1000 * 60 * 60 * 24)),
  //     hours: Math.floor((difference / (1000 * 60 * 60)) % 24), 
  //     minutes: Math.floor((difference / (1000 * 60)) % 60),
  //     seconds: Math.floor((difference / 1000) % 60),
  //   };
  // }

  // // Update the countdown timer every second
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTimeLeft(calculateTimeLeft());
  //   }, 1000);

  //   return () => clearInterval(timer); // Clean up timer on component unmount
  // }, []);

  return (
    <>
    <MetaData title={"BILLING"}/>
      <section className="mt-20 md:mt-0  md:ml-72">
        <div className="flex flex-col items-center justify-center  px-4">
          <div className="flex w-full text-[50px] justify-center  ">
          <Player
            autoplay
            loop
            src="https://lottie.host/0f7b68a7-5f52-4af3-9f9c-5be71335984b/Hc3icCdhIM.json"
            className="w-[350px] h-[350px] md:w-[600px] md:h-[600px]"
          >
          </Player>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center -mt-12 md:-mt-20">
            Coming Soon
          </h1>
          <p className="text-lg md:text-xl  mb-8 text-center">
            We're working hard to bring something amazing! Stay tuned.
          </p>

          {/* {timeLeft ? (
            <div className="flex gap-4">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold">
                    {String(value).padStart(2, "0")}
                  </div>
                  <div className="text-sm md:text-lg uppercase tracking-wide">
                    {unit}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg text-gray-300">The wait is over! 🎉</p>
          )} */}

          {/* <button className="mt-8 px-6 py-3 bg-white text-purple-600 font-bold rounded-md shadow-md hover:bg-gray-100 transition">
            Notify Me
          </button> */}
          
        </div>
      </section>
    </>
  );
};

export default Billing;
