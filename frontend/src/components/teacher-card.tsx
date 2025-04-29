import React from "react";
import Image from "next/image";
import Link from "next/link";

type TeacherCardProps = {
  teacher: string;
  linkedin: string;
  description: string;
};

const TeacherCard = ({ teacher, linkedin, description }: TeacherCardProps) => {
  return (
    <>
      <div className="flex md:flex-col flex-row md:w-74 w-auto h-108 bg-white rounded-lg">
        <div className="w-[297px] h-[284px] bg-[url(/person-placeholder.jpeg)] rounded-lg mask-b-from-90% bg-cover">
          <div className="flex flex-row justify-between m-5">
            <div className="text-white flex flex-col gap-1 ">
              <div className="bg-primary-800 rounded-[5px] font-bold text-center h-auto w-[162px]">
                <p className="text-[22px] ">{teacher}</p>
              </div>
              <div className="bg-primary-800 rounded-[5px] w-[122px] text-center">
                <p className="text-[12px]">Teaching Assistant</p>
              </div>
            </div>
            <Link
              href={linkedin}
              className="w-[30px] h-[30px] border-solid border-primary-800 border-[1px] rounded-[5px] p-1 bg-primary-50"
            >
              <Image
                src={"/icons/linkedin-icon.svg"}
                alt="linkedin-icon"
                width={30}
                height={30}
                className=" rounded-[5px]"
              ></Image>
            </Link>
          </div>
        </div>
        <p className="m-4 text-xs">{description}</p>
      </div>
    </>
  );
};

export default TeacherCard;
