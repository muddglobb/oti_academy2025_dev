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

// type SessionTypes = {
//   id: string;
//   courseId: string;
//   startAt: string;
//   durationHrs: number;
//   description: string;
//   createdAt: string;
//   updatedAt: string;
// };
// type CourseTypes = {
//   id: string;
//   title: string;
//   description: string;
//   quota: number;
//   entryQuota: number;
//   bundleQuota: number;
//   level: string;
//   createdAt: string;
//   updatedAt: string;
//   sessions: SessionTypes;
// };
// type AllClassSlider = {
//   data: CourseTypes[];
// }

const AllClassSlider = ({ data }: any) => {
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

  return (
    <div>
      <main className="w-full overflow-hidden">
        <Carousel setApi={setApi}>
          <CarouselContent>
            {data.map((course: any) => (
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
                      <Link href={`/dashboard/class-dashboard/${course.id}`}>
                        <button className="bg-primary-500 p-1 rounded self-start">
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
