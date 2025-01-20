import React from "react";
import video1 from "./WhatsApp Video 2025-01-12 at 21.51.22_f3c00a51.mp4";

const AutoPlayVideo = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <video 
        className="max-w-full h-auto rounded-lg shadow-lg border-4 border-gray-700" 
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src={video1} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default AutoPlayVideo;
