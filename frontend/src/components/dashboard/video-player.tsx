import React from "react";

interface VideoPlayerProps {
  embedUrl: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  embedUrl,
  className = "",
}) => (
  <div className={`relative w-full overflow-hidden ${className}`}>
    <div className="pb-[56.25%]">
      <iframe
        src={embedUrl}
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  </div>
);

export default VideoPlayer;
