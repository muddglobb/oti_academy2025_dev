import React from "react";

interface VideoPlayerProps {
  embedUrl: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  embedUrl,
  className = "",
}) => (
  <div className={`relative w-89 md:w-120 overflow-hidden ${className}`}>
    <div className="pb-[56.25%]">
      <iframe
        src={embedUrl}
        allowFullScreen
        className="absolute top-0 left-0 w-100 h-full mx-10"
      />
    </div>
  </div>
);

export default VideoPlayer;
