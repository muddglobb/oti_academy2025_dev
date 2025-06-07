import React from "react";
import Image from "next/image";
import { getDescByTitle, getImageByTitle } from "@/lib/course-props/course-props";

const ChosenCard = ({ title }: { title: string }) => {
  return (
    <div className="h-38 sm:h-50 w-auto bg-neutral-50 text-neutral-900 rounded-md flex">
      <Image
        src={getImageByTitle(title)}
        alt={`Image ${title}`}
        width={152}
        height={152}
        className="rounded-l-md sm:w-[200px] sm:h-[200px] object-cover"
      />
      <div className="p-2 sm:p-4 w-auto">
        <p className="text-[14px] sm:text-[18px] font-bold">{title}</p>
        <p className="line-clamp-2 sm:line-clamp-5 text-[12px] sm:text-base">{getDescByTitle(title)}</p>
      </div>
    </div>
  );
};

export default ChosenCard;
