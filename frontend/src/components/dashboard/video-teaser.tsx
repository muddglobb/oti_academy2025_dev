import React from "react";
import VideoPlayer from "./video-player";
import { getVideoByTitle } from "@/lib/course-props/course-props";

type VideoTeaserProps = { slug: string; title:string};

const VideoTeaser = ({ slug, title }: VideoTeaserProps) => {
  const URL = getVideoByTitle("Bundle " + title) || getVideoByTitle(title);
  return (
    <div className="h-full border-sol border-2 border-neutral-500 rounded-[20px] p-5 flex flex-col">
      <p className="font-bold text-lg text-neutral-50 border-b-2 border-neutral-500 pb-2 ">
        Video Teaser
      </p>

      <VideoPlayer
        // embedUrl="https://www.youtube.com/embed/HH386jtT3NY"
        // embedUrl="https://drive.google.com/file/d/11HKpxsCuoqvViHtMvU4C_WdR_NgxFGpZ/preview"
        embedUrl={URL}
        className="mt-4 "
      />
    </div>
  );
};

export default VideoTeaser;
