import React from "react";
import Image from "next/image";
import Link from "next/link";

type MentorCardProps = {
  name: string;
  imageUrl: string;
  description: string;
};

const TBACard = ({ name, imageUrl, description }: MentorCardProps) => {
  return (
    <div>
      <div className="md:flex sm:flex-row sm:w-100 md:flex-col md:w-75 md:h-108 bg-neutral-900 rounded-lg hidden">
        <div
          className="h-auto min-h-52 sm:w-60 sm:h-80 sm:min-h-60 md:w-75 md:h-[284px] md:mask-b-from-90% md:mask-r-from-100% rounded-lg bg-cover"
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
        <div className="md:w-auto text-neutral-50">
          <p
            className="flex m-5 text-xl font-bold items-end"
            style={{
              background: "linear-gradient(180deg, #F8F9FF 0%, #959599 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            Mentor <br /> {description}
          </p>
        </div>
      </div>

      <div className="md:hidden flex">
        <Image
          src="/images/foto-orang/mentor-tba-2.webp"
          alt="person-placeholder"
          width={200}
          height={200}
          className="rounded-l-md"
        />
        <div className="bg-neutral-900 w-42 rounded-r-md h-50">
          <div className="m-2">
            <p
              className="text-lg font-bold"
              style={{
                background: "linear-gradient(180deg, #F8F9FF 0%, #959599 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              Mentor <br /> {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TBACard;
