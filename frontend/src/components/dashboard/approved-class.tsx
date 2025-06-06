import React from "react";
import Image from "next/image";
import { getCourses } from "@/lib/courses/fetch-courses";
import { getMaterials } from "@/lib/material/fetch-material";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

// const getIcons = (title: string) => {
//   switch (title) {
//     case "Web Development":
//       return "/images/class-profile/hako.jpg";
//     case "Software Engineering":
//       return "/images/class-profile/hako.jpg";
//     case "Data Science & Artificial Intelligence":
//       return "/images/class-profile/hako.jpg";
//     case "UI/UX":
//       return "/images/class-profile/hako.jpg";
//     case "Cyber Security":
//       return "/images/class-profile/hako.jpg";
//     case "Basic Python":
//       return "/images/class-profile/hako.jpg";
//     case "Competitive Programming":
//       return "/images/class-profile/hako.jpg";
//     case "Game Development":
//       return "/images/class-profile/hako.jpg";
//     case "Fundamental Cyber Security":
//       return "/images/class-profile/hako.jpg";
//     case "Graphic Design":
//       return "/images/class-profile/hako.jpg";
//     default:
//       return "/person-placeholder.jpeg";
//   }
// };
const classData: Record<string, { icon: string; slug: string }> = {
  "Web Development": {
    icon: "/images/class-profile/hako.jpg",
    slug: "web-development",
  },
  "Software Engineering": {
    icon: "/images/class-profile/hako.jpg",
    slug: "software-engineering",
  },
  "Data Science & Artificial Intelligence": {
    icon: "/images/class-profile/hako.jpg",
    slug: "data-science&artificial-intelligence",
  },
  "UI/UX": {
    icon: "/images/class-profile/hako.jpg",
    slug: "ui-ux",
  },
  "Cyber Security": {
    icon: "/images/class-profile/hako.jpg",
    slug: "cyber-security",
  },
  "Basic Python": {
    icon: "/images/class-profile/hako.jpg",
    slug: "basic-python",
  },
  "Competitive Programming": {
    icon: "/images/class-profile/hako.jpg",
    slug: "competitive-programming",
  },
  "Game Development": {
    icon: "/images/class-profile/hako.jpg",
    slug: "game-development",
  },
  "Fundamental Cyber Security": {
    icon: "/images/class-profile/hako.jpg",
    slug: "fundamental-cyber-security",
  },
  "Graphic Design": {
    icon: "/images/class-profile/hako.jpg",
    slug: "graphic-design",
  },
};

const getIcons = (title: string) => {
  return classData[title]?.icon || "/person-placeholder.jpeg";
};

const getSlug = (title: string) => {
  return classData[title]?.slug || "";
};

export type CourseSession = {
  id: string;
  courseId: string;
  startAt: string; // ISO timestamp
  durationHrs: number;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type CourseData = {
  id: string;
  title: string;
  description: string;
  quota: number;
  entryQuota: number;
  bundleQuota: number;
  level: "BEGINNER" | "INTERMEDIATE" | "BUNDLE"; // asumsi enum level
  createdAt: string;
  updatedAt: string;
  sessions: CourseSession[];
};

const ApprovedClass = async ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const icon = getIcons(title);
  const classData = await getCourses();
  const course = classData.data.find(
    (course: CourseData) => course.title === title
  );

  const materialData = await getMaterials({ courseId: course.id });
  const timez = materialData.data[0]?.unlockDate.utc.iso;

  const SLUG = getSlug(title);
  return (
    <Link href={`/dashboard/class-dashboard/${SLUG}`}>
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
          <div className="flex justify-between">
            <div className="flex gap-2 items-center mb-2">
              {new Date(timez) > new Date() ? (
                <>
                  <div className="w-4 h-4 bg-error-800 rounded-full"></div>
                  <p className="text-error-800 text-[12px]">Scheduled</p>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 bg-[#095C37] rounded-full"></div>
                  <p className="text-[#095C37] text-[12px]">On going</p>
                </>
              )}
            </div>

            <div className="p-1 bg-primary-500 rounded-sm">
              <ArrowUpRight />
            </div>
          </div>
          <div className="text-neutral-900">
            <p className="font-bold text-lg sm:text-sm">{title}</p>
            <p className="text-[12px] line-clamp-2 hidden sm:block">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ApprovedClass;
