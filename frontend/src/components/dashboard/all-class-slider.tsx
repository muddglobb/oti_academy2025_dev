"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

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
export type DataData = {
  bundleQuota: number;
  createdAt: string;
  description: string;
  entryQuota: number;
  id: string;
  level: "BEGINNER" | "INTERMEDIATE" | "BUNDLE"; // asumsi enum level
  quota: number;
  sessions: CourseSession[];
  title: string;
  updatedAt: string;
};

const AllClassSlider = ({ data }: { data: DataData[] }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  function getSlugByTitle(title: string) {
    switch (title) {
      case "Web Development":
        return "web-development";
      case "Software Engineering":
        return "software-engineering";
      case "Data Science & Artificial Intelligence":
        return "data-science&artificial-intelligence";
      case "UI/UX":
        return "ui-ux";
      case "Cyber Security":
        return "cyber-security";
      case "Basic Python":
        return "basic-python";
      case "Competitive Programming":
        return "competitive-programming";
      case "Game Development":
        return "game-development";
      case "Fundamental Cyber Security":
        return "fundamental-cyber-security";
      case "Graphic Design":
        return "graphic-design";
      case "Bundle Web Development + Software Engineering":
        return "web-development+software-engineering";
      case "Bundle Python + Data Science & Artificial Intelligence":
        return "python+data-science&artificial-intelligence";
      case "Bundle Graphic Design + UI/UX":
        return "graphic-design+ui-ux";
      case "Bundle Fundamental Cyber Security + Cyber Security":
        return "fundamental-cyber-security+cyber-security";
      default:
        return null;
    }
  }

  return (
    <div>
      <main className="w-full overflow-hidden">
        <Carousel setApi={setApi}>
          <CarouselContent>
            {data.map((course: CourseData) => (
              <CarouselItem
                key={course.id}
                className="w-8 md:basis-1/2 lg:basis-1/3"
              >
                <div className="bg-white rounded-md h-full">
                  <div>
                    <div className="p-5 h-50 bg-black rounded-t-md bg-[url('/images/teacher/faris.jpg')] bg-center bg-contain bg-no-repeat">
                      <div className="text-white font-bold text-sm bg-primary-500 inline-block px-3 py-1 rounded">
                        {course.level}
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between">
                      <p className="font-bold text-black w-[70%]">
                        {course.title}
                      </p>
                      {/* <Link href={`/dashboard/class-dashboard/${course.id}`}> */}
                      <Link
                        href={`/dashboard/class-dashboard/${getSlugByTitle(
                          course.title
                        )}`}
                      >
                        <button className="bg-primary-500 p-1 rounded self-start cursor-pointer">
                          <ArrowUpRight />
                        </button>
                      </Link>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      {course.description}
                    </div>
                    <div />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex justify-between mt-4 gap-2">
          <button
            onClick={() => api?.scrollTo(current - 1)}
            className="cursor-pointer p-3 bg-[var(--color-primary-800)] rounded-lg flex items-center gap-2"
          >
            <Image
              src="/icons/backarrow-icon.svg"
              alt="Previous"
              width={20}
              height={20}
            />
            <p className="text-[var(--color-neutral-50)] text-sm">Previous</p>
          </button>

          <button
            onClick={() => api?.scrollTo(current + 1)}
            className="cursor-pointer p-3 bg-[var(--color-primary-800)] rounded-lg flex items-center gap-2"
          >
            <p className="text-[var(--color-neutral-50)] text-sm">Next</p>
            <Image
              src="/icons/backarrow-icon.svg"
              alt="Next"
              width={20}
              height={20}
              className="transform rotate-180"
            />
          </button>
        </div>
      </main>
    </div>
  );
};

export default AllClassSlider;
