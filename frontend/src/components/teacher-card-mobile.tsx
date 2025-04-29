import React from "react";
import Image from "next/image";
import Link from "next/link";

type TeacherCardProps = {
  teacher: string;
  linkedin: string;
  description: string;
};

const TeacherCardMobile = ({
  teacher,
  linkedin,
  description,
}: TeacherCardProps) => {
  return (
    <>
      <div className="flex flex-col justify-center gap-y-8">
        <div className="flex flex-row w-98 h-60 bg-white justify-center rounded-lg">
          <Image
            src={"/person-placeholder.jpeg"}
            alt="person-placeholder"
            width={180}
            height={235}
            className="rounded-lg mask-r-from-80%"
          ></Image>
          <div>
            <div className="flex flex-row justify-between mt-2.5 mr-2.5">
              <div className="text-white flex flex-col gap-1 ">
                <div className="bg-primary-800 rounded-[5px] font-bold text-center h-auto w-[162px]">
                  <p className="text-lg ">{teacher}</p>
                </div>
                <div className="bg-primary-800 rounded-[5px] w-[122px] text-center">
                  <p className="text-xs">Teaching Assistant</p>
                </div>
              </div>
              <Link
                href={linkedin}
                className="w-[24px] h-[24px] border-solid border-primary-800 border-[1px] rounded-[5px] p-1 bg-primary-50"
              >
                <Image
                  src={"/icons/linkedin-icon.svg"}
                  alt="linkedin-icon"
                  width={14}
                  height={14}
                  className=" rounded-[5px]"
                ></Image>
              </Link>
            </div>
            <p className="mt-2.5 text-xs mr-2.5">{description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherCardMobile;
