"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import NextArrow from "@/components/ui/next-arrow";
import PrevArrow from "@/components/ui/prev-arrow";

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

  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    variableWidth: true,
    slidesToShow: 3, // tampilkan 3 item per layar (ubah sesuai kebutuhan)
    slidesToScroll: 1,
    nextArrow: <NextArrow></NextArrow>,
    prevArrow: <PrevArrow></PrevArrow>,
  };

  return (
    <div>
      {/* <main>
        <Carousel setApi={setApi}>
          <CarouselContent>
            {data.map((course: any) => (
            <CarouselItem key={course.id} className="basis-1/3">
              <div className="p-4 bg-white rounded shadow">
                <div className="font-bold mb-2 text-black">{course.title}</div>
                <div className="text-sm text-gray-600">{course.description}</div>
              </div>
            </CarouselItem>
          ))}
          </CarouselContent>
        </Carousel>

        <div className="flex-col ">
          <div
            className="cusor-pointer"
            onClick={() => api?.scrollTo(current - 1)}
          >
            <div className=" cursor-pointer p-3 bg-[var(--color-primary-800)] rounded-lg flex items-center gap-2 mt-2">
              <Image
                src="/icons/backarrow-icon.svg"
                alt="MUNDUR"
                width={20}
                height={20}
                // className="transform rotate-180"
              ></Image>
              <p className="text-[var(--color-neutral-50)] text-sm">Previous</p>
            </div>
          </div>

          <div
            className="cusor-pointer"
            onClick={() => api?.scrollTo(current + 1)}
          >
            <div className="cursor-pointer p-3 bg-[var(--color-primary-800)] rounded-lg flex items-center gap-2 mt-2">
              <p className="text-[var(--color-neutral-50)] text-sm">Next</p>
              <Image
                src="/icons/backarrow-icon.svg"
                alt="MAJU"
                width={20}
                height={20}
                className="transform rotate-180"
              ></Image>
            </div>
          </div>
        </div>
      </main> */}

      <main className="w-full overflow-hidden">
        <Carousel setApi={setApi}>
          <CarouselContent>
            {data.map((course: any) => (
              <CarouselItem
                key={course.id}
                className="w-10 md:basis-1/2 lg:basis-1/3"
              >
                <div className="bg-white rounded-md h-full">
                  <div>
                    {/* <div className="h-50 bg-red-500 rounded-t-md flex justify-center items-center"
                    style={{ backgroundImage: 'url("/images/teacher/faris.jpg")' }}>
                      <Image src="/images/teacher/faris.jpg" alt="logo kelas" width={200} height={200}></Image>
                      <div className="z-1">
                        {course.level}
                      </div>
                    </div> */}
                    
                  </div>

                  <div className="p-5">
                    <div>
                      <p className="font-bold mb-2 text-black w-[70%]">
                        {course.title}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600">
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

      {/* <main>
        <div className="">
          <Slider {...settings}>
            {data.map((course: any) => (
              <div key={course.id}>
                <div className="p-4 bg-white rounded shadow">
                  <div className="font-bold mb-2 text-black">
                    {course.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {course.description}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </main> */}
    </div>
  );
};

export default AllClassSlider;
