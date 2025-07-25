import React from "react";

interface VideoPlayerProps {
  embedUrl: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  embedUrl,
  className = "",
}) => (
  <div
    className={`relative w-full h-full overflow-hidden flex items-center justify-center  ${className}`}
  >
    <div className="lg:w-122 lg:h-84.5 sm:w-89.5 sm:h-62 w-65 h-45 relative">
      <iframe
        src={embedUrl}
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  </div>
);

export default VideoPlayer;
