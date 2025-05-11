import React from "react";
import Image from "next/image";
import Link from "next/link";

type MentorCardProps = {
  name: string;
  job: string;
  linkedin: string;
  pic: string;
  desc: string;
};
const LandingPageMentorCard = ({
  name, job, pic, desc, linkedin,
}: MentorCardProps) => {
  return (
    <div
      className="
      flex 
      sm:flex-row 
      sm:w-100

      md:flex-col
      md:w-75
      md:h-75
    bg-white rounded-lg"
    >
      <div
        className="
        w-[50%]
        h-auto
        min-h-52
        mask-r-from-90%

        sm:w-60
        sm:h-auto
        sm:min-h-60

        md:w-75 
        md:h-[284px] 
        md:mask-b-from-90%
        md:mask-r-from-100%
        rounded-lg  
        bg-cover
        "
        style={{ backgroundImage: `url(${pic})` }}
      >
        <div className="m-5">
          <div
            className="
            text-white 
              gap-1 
              hidden
              md:flex 
              md:justify-between
          "
          >
            <div className="w-auto max-w-[80%]">
              <div className="font-bold h-auto w-auto">
                <p className="bg-primary-800 rounded-[5px] text-[22px] p-1 break-words">
                  {name}
                </p>
              </div>
              <div className="inline-block">
                <p className="bg-primary-800 rounded-[5px] text-[12px] p-1 mt-0.5">
                  {job}
                </p>
              </div>
            </div>

            <Link href={linkedin}>
              <Image
                src={"/icons/linkedin-icon.svg"}
                alt="linkedin-icon"
                width={35}
                height={35}
                className="bg-primary-50 rounded-[5px] mt-0 p-[5px] cursor-pointer"
              />
            </Link>
          </div>
        </div>
      </div>

      <div
        className="
          w-[50%]
          md:w-full
      "
      >
        <div className="flex justify-between p-3 md:hidden">
          <div className="text-[var(--color-neutral-50)] w-auto max-w-[75%]">
            <div className="font-bold h-auto">
              <p className="bg-primary-800 rounded-[5px] text-[18px] p-1 break-words">
                {name}
              </p>
            </div>
            <div className="inline-block">
              <p className="bg-primary-800 rounded-[5px] text-[12px] p-1 mt-0.5">
                {job}
              </p>
            </div>
          </div>

          <button className="w-[21px] h-[21px] cursor-pointer">
            <Link href={linkedin}>
              <Image
                src={"/icons/linkedin-icon.svg"}
                alt="linkedin-icon"
                width={26}
                height={26}
                className="bg-primary-50 rounded-[5px] mt-0 p-[5px] cursor-pointer"
              />
            </Link>
          </button>
        </div>

        <p className="flex m-4 text-xs items-end">{desc}</p>
      </div>
    </div>
  );
};

export default LandingPageMentorCard;
