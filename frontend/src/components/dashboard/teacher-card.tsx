import React from "react";
import Image from "next/image";
import Link from "next/link";

type TeacherCardData = [string, string, string, string, string];

// type TeacherCardProps = {
//   name: string;
//   role: string;
//   imageUrl: string;
//   linkedin: string;
//   desc: string;
// };

const TeacherCard = ({ teacherCard }: { teacherCard: TeacherCardData[] }) => {
  return (
    <div className="inline-block border-solid border-2 border-neutral-500 rounded-[20px] p-5 justify-self-start">
      <p className="text-lg text-success-50 border-b-2 border-neutral-500 pb-2">
        Teaching Assistant & Mentor
      </p>
      <div className="flex flex-row gap-15 mt-2">
        {teacherCard.map(([name, role, imageUrl, linkedin, desc], index) => (
          <div key={index}>
            <div className="w-122 h-34 flex flex-row gap-4 bg-neutral-50 text-neutral-900 rounded-[10px]">
              <div
                className="w-34 h-34 bg-cover bg-center bg-no-repeat flex rounded-l-[10px]"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  position: "relative",
                }}
              >
                <div className="bg-neutral-200 w-7.5 h-7.5 flex justify-center items-center rounded-[5px] absolute bottom-2 right-2">
                  <Link href={linkedin}>
                    <Image
                      src="/icons/linkedin-icon.svg"
                      alt="linkedin"
                      width={20}
                      height={20}
                    ></Image>
                  </Link>
                </div>
              </div>
              <div className="w-94 mt-5">
                <p className="text-sm font-bold">
                  {name} | {role}
                </p>
                <p className="text-xs">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherCard;
