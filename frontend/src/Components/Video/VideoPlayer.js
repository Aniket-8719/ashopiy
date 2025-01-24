import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { BsPlayCircleFill } from "react-icons/bs";
import Earning from "./Files/Earning.mp4"
import Charts from "./Files/Charts.mp4"
import Invesment from "./Files/Investment.mp4"
import Udhar_Book from "./Files/Udhar Book.mp4"
import History from "./Files/History.mp4"
import Registeration from "./Files/Registeration.mp4"

const videos = [
  {
    id: 1,
    title: "Register",
    description: "How to register when you are new.",
    url: Registeration,
  },
  {
    id: 2,
    title: "Login",
    description: "How to login, Forgot Password, Reset Password",
    url: "#",
  },
  {
    id: 3,
    title: "Profile",
    description: "How to Update Password, Edit Profile, Download full data",
    url: "#",
  },
  {
    id: 4,
    title: "Subscription",
    description: "How to buy subscription",
    url: "#",
  },
  {
    id: 5,
    title: "Earning",
    description: "How to login, Forgot Password, Reset Password",
    url: Earning,
  },
  {
    id: 6,
    title: "Charts",
    description: "How to Download Per day, monthly & yearly data",
    url: Charts,
  },
  {
    id: 7,
    title: "Investment",
    description: "How to add, update & delete investment",
    url: Invesment,
  },
  {
    id: 8,
    title: "Udhaar Book",
    description: "How to add, update and delete udhaar",
    url: Udhar_Book,
  },
  {
    id: 9,
    title: "History",
    description: "How to see your total cash, online cash, Return customers, Return amount, Total active days",
    url: History,
  },
  {
    id: 10,
    title: "App Lock",
    description: "How to lock your features",
    url: "#",
  },
  // Add more video objects here
];

const VideoPlayer = () => {
  const [currentVideo, setCurrentVideo] = useState(null);

  return (
    <>
      <section className="mt-16 md:my-20 md:ml-72">
        <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center p-4">
          <h1 className="text-3xl font-bold mb-6">Video Library</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setCurrentVideo(video)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      {video.title}
                    </h2>
                  </div>
                  <div className="mr-4">
                    <BsPlayCircleFill className={`${video.url === "#" ? "text-black" : "text-blue-500"}`} size={20} />
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{video.description}</p>
              </div>
            ))}
          </div>

          {/* Video Popup */}
          {currentVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
              <div className="w-full max-w-md max-h-[600px] h-full p-8 bg-white rounded-lg shadow-lg relative mx-2">
                <button
                  onClick={() => setCurrentVideo(null)}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-600 rounded-full hover:bg-gray-400 hover:text-white"
                >
                  <IoMdClose size={20} />
                </button>
                {/* <h2 className="text-xl font-semibold mb-4">
                  {currentVideo.title}
                </h2>
                <p className="text-gray-700 mb-4">{currentVideo.description}</p> */}
                <video
                  controls
                  className="w-full h-full rounded-lg object-contain"
                >
                  <source src={currentVideo.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default VideoPlayer;
