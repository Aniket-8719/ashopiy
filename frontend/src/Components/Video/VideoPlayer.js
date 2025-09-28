import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { BsPlayCircleFill } from "react-icons/bs";
import Earning from "./Files/Earning.mp4";
import Charts from "./Files/Charts.mp4";
import Invesment from "./Files/Investment.mp4";
import Udhar_Book from "./Files/Udhar Book.mp4";
import History from "./Files/History.mp4";
import Registeration from "./Files/Registeration.mp4";

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
    description:
      "How to see your total cash, online cash, Return customers, Return amount, Total active days",
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
      <section className="mt-12 lg:mt-16 lg:ml-72 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800 mb-4">
              Video Tutorials
            </h1>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Learn how to make the most of ashopiy with our comprehensive video
              guides and tutorials
            </p>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                onClick={() => setCurrentVideo(video)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors">
                      {video.title}
                    </h2>
                  </div>
                  <div
                    className={`p-2 rounded-lg ${
                      video.url === "#"
                        ? "bg-neutral-100 text-neutral-400"
                        : "bg-primary-100 text-primary-600"
                    }`}
                  >
                    <BsPlayCircleFill size={20} />
                  </div>
                </div>
                <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                  {video.description}
                </p>
                <div
                  className={`text-xs font-medium ${
                    video.url === "#" ? "text-neutral-400" : "text-primary-600"
                  }`}
                >
                  {video.url === "#" ? "Coming Soon" : "Watch Tutorial"}
                </div>
              </div>
            ))}
          </div>

          {/* Video Popup Modal */}
          {currentVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
              <div className="w-full max-w-4xl bg-white rounded-xl border border-neutral-200 shadow-2xl relative">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-800">
                      {currentVideo.title}
                    </h2>
                    <p className="text-neutral-600 text-sm mt-1">
                      {currentVideo.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentVideo(null)}
                    className="w-10 h-10 flex items-center justify-center bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-200 transition-colors"
                    aria-label="Close video"
                  >
                    <IoMdClose size={20} />
                  </button>
                </div>

                {/* Video Player */}
                <div className="p-6">
                  <div className="aspect-video bg-neutral-900 rounded-lg overflow-hidden">
                    <video
                      controls
                      className="w-full h-full object-contain"
                      poster={currentVideo.thumbnail} // Add thumbnail if available
                    >
                      <source src={currentVideo.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-neutral-200 bg-neutral-50 rounded-b-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">
                      Need more help?{" "}
                      <a
                        href="/support"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Contact support
                      </a>
                    </span>
                    <button
                      onClick={() => setCurrentVideo(null)}
                      className="px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {videos.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BsPlayCircleFill className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                No videos available
              </h3>
              <p className="text-neutral-600">
                Check back later for new tutorial videos
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default VideoPlayer;
