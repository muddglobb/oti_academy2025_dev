import React from "react";
import VideoPlayer from "./video-player";

const VideoTeaser = () => {
  return (
    <div className="w-132 h-108 border-sol border-2 border-neutral-500 rounded-[20px] p-5">
      <p className="text-lg text-success-50 border-b-2 border-neutral-500 pb-2">
        Video Teaser
      </p>
      <VideoPlayer
        embedUrl="https://www.youtube.com/embed/HH386jtT3NY"
        className="mt-4"
      />
    </div>
  );
};

export default VideoTeaser;
