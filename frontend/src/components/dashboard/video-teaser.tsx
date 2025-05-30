import React from "react";
import VideoPlayer from "./video-player";

const VideoTeaser = () => {
  return (
    <div className="w-full border-sol border-2 border-neutral-500 rounded-[20px] px-2 py-5 md:p-5 flex flex-col">
      <p className="font-bold text-lg text-neutral-50 border-b-2 border-neutral-500 pb-2">
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
