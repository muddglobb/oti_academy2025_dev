import React from "react";
import Image from "next/image";
import { getCourses } from "@/lib/courses/fetch-courses";
import { getMaterials } from "@/lib/material/fetch-material";

const getIcons = (title: string) => {
  switch (title) {
    case "Web Development":
      return "/images/class-profile/hako.jpg";
    case "Software Engineering":
      return "/images/class-profile/hako.jpg";
    case "Data Science & Artificial Intelligence":
      return "/images/class-profile/hako.jpg";
    case "UI/UX":
      return "/images/class-profile/hako.jpg";
    case "Cyber Security":
      return "/images/class-profile/hako.jpg";
    case "Basic Python":
      return "/images/class-profile/hako.jpg";
    case "Competitive Programming":
      return "/images/class-profile/hako.jpg";
    case "Game Development":
      return "/images/class-profile/hako.jpg";
    case "Fundamental Cyber Security":
      return "/images/class-profile/hako.jpg";
    case "Graphic Design":
      return "/images/class-profile/hako.jpg";
    default:
      return "/person-placeholder.jpeg";
  }
};

const ApprovedClass = async ({ title, description }: any) => {
  const icon = getIcons(title);
  const now = new Date();
  // const targetDate = new Date("2025-05-28T13:52:14.495Z");
  // console.log(targetDate > now); // true jika targetDate sudah lewat

  const classData = await getCourses();
  const course = classData.data.find((course) => course.title === title);

  const materialData = await getMaterials({ courseId: course.id });
  console.log("Material Data " + course.title, materialData);

  const timez = materialData.data[0]?.unlockDate.utc.iso;
  // console.log("Now", now);
  // console.log("Unlock Date", timez);
  // console.log(new Date(timez));
  // console.log("Unlock Date > Now", new Date(timez) > now);

  return (
    <div className="bg-neutral-50 border-3 border-neutral-500 rounded-[20px] h-35 flex">
      <Image
        src={icon || "/person-placeholder.jpeg"}
        alt="class-icon"
        className="rounded-l-[16px]"
        width={140}
        height={140}
      />
      <div className="w-5/6 p-2 lg:p-4">
        {/* <div className="flex gap-2 items-center mb-2">
          <div className="w-4 h-4 bg-[#095C37] rounded-full"></div>
          <p className="text-[#095C37]">On going</p>
        </div> */}
        <div className="flex gap-2 items-center mb-2">
          {new Date(timez) > new Date() ? (
            <>
              <div className="w-4 h-4 bg-error-800 rounded-full"></div>
              <p className="text-error-800">Scheduled</p>
            </>
          ) : (
            <>
              <div className="w-4 h-4 bg-[#095C37] rounded-full"></div>
              <p className="text-[#095C37]">On going</p>
            </>
          )}
        </div>
        <div className="text-neutral-900">
          <p className="font-bold text-lg sm:text-sm">{title}</p>
          <p className="text-[12px] line-clamp-2 hidden sm:block">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApprovedClass;
