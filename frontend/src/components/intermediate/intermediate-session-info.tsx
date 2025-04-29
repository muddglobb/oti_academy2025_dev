import React from "react";
import Image from "next/image";

type SessionData = [string, string, string, string];
const IntermediateSessionInfo = ({ sessions }: { sessions: SessionData[] }) => {
  return (
    <div
      className="
        w-full
        h-auto

        bg-cover 
        bg-center
        flex
        flex-col
        items-center
        justify-center
        
        bg-[linear-gradient(0deg,rgba(5,12,26,0.3)_0%,rgba(5,12,26,0.5)_100%)]
        relative
    "
    >
      <section className=" text-white py-20 bg-no-repeat bg-cover w-full px-14">
        <Image
          src="/images/class-info-background.png"
          alt="stars"
          fill
          className="absolute top-0 left-0 w-full object-cover -z-10"
        />

        <p className="text-[2rem] text-center font-bold bg-gradient-to-b from-gray-300 to-gray-400 bg-clip-text text-transparent">
          Complete Session Information
        </p>
        <div className=" mx-8 py-8 w-auto">
          <div className="relative">
            <div className="absolute left-1 top-2 bottom-0 w-0.5 -translate-x-1/2 bg-white"></div>

            <div className="space-y-9">
              <div className="relative flex flex-col gap-7.5 w-full items-center">
                {sessions.map(([title, date, duration, description], index) => (
                  <div
                    className="relative flex w-full items-center"
                    key={index}
                  >
                    <div className="w-auto pl-8 text-left">
                      <h3 className="font-bold text-lg">{title}</h3>
                      <div className="flex flex-row gap-5">
                        <div className="text-lg flex flex-row gap-[5px]">
                          <Image
                            src={"/icons/calendar-icon.svg"}
                            alt="calendar-icon"
                            width={24}
                            height={24}
                          />
                          <p>{date}</p>
                        </div>
                        <div className="text-lg flex flex-row gap-[5px]">
                          <Image
                            src={"/icons/time-icon.svg"}
                            alt="time-icon"
                            width={24}
                            height={24}
                          />
                          <p>{duration}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-lg">{description}</p>
                    </div>
                    <div className="absolute left-1 flex h-5 w-5 -translate-x-1/2 -translate-y-0 items-center justify-center rounded-full ring-2 ring-white bg-neutral-800"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntermediateSessionInfo;
