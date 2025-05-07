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
      <section
        className=" text-white py-20 bg-no-repeat bg-cover w-full 
      px-1
      md:px-10
      lg:px-14"
      >
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
            {/* <div className="absolute left-1 top-2 bottom-0 w-0.5 -translate-x-1/2 bg-white"></div> */}

            {/* <div className="space-y-9">
              <div className="relative flex flex-col gap-7.5 w-full items-center">
                {sessions.map(([title, date, duration, description], index) => (
                  <div
                    className="relative flex w-full "
                    key={index}
                  >
                    <div className="w-auto pl-8 text-left 
                    text-[12px]
                    md:text-lg">
                      <h3 className="font-bold ">{title}</h3>
                      <div className="flex flex-row gap-5">
                        <div className="flex flex-row gap-[5px]">
                          <Image
                            src={"/icons/calendar-icon.svg"}
                            alt="calendar-icon"
                            width={24}
                            height={24}
                          />
                          <p>{date}</p>
                        </div>
                        <div className="flex flex-row gap-[5px]">
                          <Image
                            src={"/icons/time-icon.svg"}
                            alt="time-icon"
                            width={24}
                            height={24}
                          />
                          <p>{duration}</p>
                        </div>
                      </div>
                      <p className="mt-2">{description}</p>
                    </div>
                    <div className="absolute left-1 flex h-5 w-5 -translate-x-1/2 -translate-y-0 items-center justify-center rounded-full ring-2 ring-white bg-neutral-800"></div>
                  </div>
                ))}
              </div>
            </div> */}

            <div className="">
              {sessions.map(([title, date, duration, description], index) => (
                <div
                  className="relative flex flex-col gap-7.5 w-full items-center pb-9"
                  key={index}
                >
                  {/* Titik bulat */}
                  {/* <div className="absolute left-1 flex h-5 w-5 -translate-x-1/2 -translate-y-0 items-center justify-center rounded-full ring-2 ring-white bg-neutral-800 z-10"></div> */}
                  <div className="absolute left-1 top-[2px] flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full ring-2 ring-white bg-neutral-800 z-10"></div>

                  {/* Garis hanya jika bukan elemen terakhir */}
                  {index !== sessions.length - 1 && (
                    <div className="absolute left-1 top-2 bottom-0 w-0.5 -translate-x-1/2 bg-white z-0"></div>
                    
                  )}

                  {/* Konten session */}
                  <div className="relative flex w-full pl-8 text-left text-[12px] md:text-lg">
                    <div>
                      <h3 className="font-bold ">{title}</h3>
                      <div className="flex flex-row gap-5">
                        <div className="flex flex-row gap-[5px] items-center">
                          <Image
                            src={"/icons/calendar-icon.svg"}
                            alt="calendar-icon"
                            width={24}
                            height={24}
                          />
                          <p>{date}</p>
                        </div>
                        <div className="flex flex-row gap-[5px] items-center">
                          <Image
                            src={"/icons/time-icon.svg"}
                            alt="time-icon"
                            width={24}
                            height={24}
                          />
                          <p>{duration}</p>
                        </div>
                      </div>
                      <p className="mt-2">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntermediateSessionInfo;
