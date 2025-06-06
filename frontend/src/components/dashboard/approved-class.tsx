import React from "react";
import Image from "next/image";
import { getCourses } from "@/lib/courses/fetch-courses";
import { getMaterials } from "@/lib/material/fetch-material";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getIcons, getSlugByTitle } from "@/lib/course-props/course-props";

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

  const SLUG = getSlugByTitle(title);
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
