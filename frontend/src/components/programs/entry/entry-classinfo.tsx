import React from "react";
import Image from "next/legacy/image";
import MentorCard from "@/components/programs/intermediate/mentor-card";
type ClassInfoProps = {
  classInfo: [string, string, string, string, string, string, string, string];
};

const EntryClassInfo = ({ classInfo }: ClassInfoProps) => {
  const [date, sesi, jam, modul, mentor, mentorImage, mentorDesc, mentorLink] =
    classInfo;

  return (
    <>
      <div className="relative w-full h-200 overflow-hidden bg-[linear-gradient(0deg,rgba(5,12,26,0.8)_0%,rgba(5,12,26,0.2)_100%)]">
        <div
          className="absolute inset-0 bg-repeat bg-center -z-10"
          style={{ backgroundImage: "url('/images/space-background.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-900/10 to-neutral-900/50 -z-20"></div>
        </div>
        <div
          className="absolute w-210 h-210 left-2/3 bg-right -mr-[40%] bg-contain bg-no-repeat -z-10 scale-x-[-1] rotate-[-35deg] brightness-19 "
          style={{ backgroundImage: "url(/images/planet/saturnus.png)" }}
        ></div>
        <section className="flex flex-col gap-7.5  justify-center items-center py-10 bg-no-repeat bg-cover w-full">
          <p className="text-center font-bold bg-gradient-to-b from-gray-300 to-gray-400 bg-clip-text text-transparent w-md md:w-full
          text-[22px]
          md:text-[32px]">
            Detailed Information About Our Class
          </p>
          <div className="md:w-4xl w-sm">
            <div className="flex md:flex-row flex-col justify-center md:gap-x-8 gap-y-8">
              <MentorCard
                name={mentor}
                imageUrl={mentorImage}
                role="Teaching Assistant"
                description={mentorDesc}
                linkedin={mentorLink}
              ></MentorCard>

              <div className="hidden text-sm text-white md:flex flex-col gap-2">
                <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-sm px-2.5 py-2">
                  <Image
                    src={"/icons/calendar-icon.svg"}
                    alt="calendar-icon"
                    width={21}
                    height={21}
                  ></Image>
                  <p>{date}</p>
                </div>
                <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-sm px-2.5 py-2">
                  <Image
                    src={"/icons/target-icon.svg"}
                    alt="calendar-icon"
                    width={21}
                    height={21}
                  ></Image>
                  <p>{sesi}</p>
                </div>
                <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-sm px-2.5 py-2">
                  <Image
                    src={"/icons/time-icon.svg"}
                    alt="calendar-icon"
                    width={21}
                    height={21}
                  ></Image>
                  <p>{jam}</p>
                </div>
                <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-sm px-2.5 py-2">
                  <Image
                    src={"/icons/stack-icon.svg"}
                    alt="calendar-icon"
                    width={21}
                    height={21}
                  ></Image>
                  <p>{modul}</p>
                </div>
              </div>

              <div className="md:hidden text-sm text-white flex flex-row justify-center items-center gap-1">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-48 px-2.5 py-2">
                    <Image
                      src={"/icons/calendar-icon.svg"}
                      alt="calendar-icon"
                      width={21}
                      height={21}
                    ></Image>
                    <p>{date}</p>
                  </div>
                  <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-48 px-2.5 py-2">
                    <Image
                      src={"/icons/target-icon.svg"}
                      alt="calendar-icon"
                      width={21}
                      height={21}
                    ></Image>
                    <p>{sesi}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-48 px-2.5 py-2">
                    <Image
                      src={"/icons/time-icon.svg"}
                      alt="calendar-icon"
                      width={21}
                      height={21}
                    ></Image>
                    <p>{jam}</p>
                  </div>
                  <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-48 px-2.5 py-2">
                    <Image
                      src={"/icons/stack-icon.svg"}
                      alt="calendar-icon"
                      width={21}
                      height={21}
                    ></Image>
                    <p>{modul}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default EntryClassInfo;
