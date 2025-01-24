import React from "react";


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
        <source src="#" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default AutoPlayVideo;
