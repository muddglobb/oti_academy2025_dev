import React from "react";
import Image from "next/legacy/image";

const EntrySessionInfo = () => {
  return (
    <section className=" text-white py-20 bg-no-repeat bg-cover w-full">
      <p className="text-[2rem] text-center font-bold bg-gradient-to-b from-gray-300 to-gray-400 bg-clip-text text-transparent">
        Complete Session Information
      </p>
      <div className=" mx-8 py-8 w-auto">
        <div className="relative">
          <div className="absolute left-1 top-2 bottom-0 w-0.5 -translate-x-1/2 bg-white"></div>

          <div className="space-y-9">
            <div className="relative flex w-full items-center">
              <div className="w-auto pl-8 text-left">
                <h3 className="font-bold text-lg">Session 1</h3>
                <div className="flex flex-row gap-5">
                  <div className="text-lg flex flex-row gap-[5px] ">
                    <Image
                      src={"/icons/calendar-icon.svg"}
                      alt="calendar-icon"
                      width={24}
                      height={24}
                    ></Image>
                    <p>1 June 2025</p>
                  </div>
                  <div className="text-lg flex flex-row gap-[5px]">
                    <Image
                      src={"/icons/time-icon.svg"}
                      alt="calendar-icon"
                      width={24}
                      height={24}
                    ></Image>
                    <p>2 - 4 Jam/Sessions</p>
                  </div>
                </div>

                <p className="mt-2 text-lg">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Earum rerum est excepturi, laboriosam maiores blanditiis
                  aliquid aliquam accusantium, dolores enim rem. Quidem
                  similique, quos modi veniam ea velit mollitia esse.
                </p>
              </div>

              <div className="absolute left-1 flex h-5 w-5 -translate-x-1/2 -translate-y-0 items-center justify-center rounded-full  ring-2 ring-white bg-neutral-800"></div>
            </div>

            <div className="relative flex w-full items-center">
              <div className="w-auto pl-8 text-left">
                <h3 className="font-bold text-lg">Session 1</h3>
                <div className="flex flex-row gap-5">
                  <div className="text-lg flex flex-row gap-[5px] ">
                    <Image
                      src={"/icons/calendar-icon.svg"}
                      alt="calendar-icon"
                      width={24}
                      height={24}
                    ></Image>
                    <p>1 June 2025</p>
                  </div>
                  <div className="text-lg flex flex-row gap-[5px]">
                    <Image
                      src={"/icons/time-icon.svg"}
                      alt="calendar-icon"
                      width={24}
                      height={24}
                    ></Image>
                    <p>2 - 4 Jam/Sessions</p>
                  </div>
                </div>

                <p className="mt-2 text-lg">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Earum rerum est excepturi, laboriosam maiores blanditiis
                  aliquid aliquam accusantium, dolores enim rem. Quidem
                  similique, quos modi veniam ea velit mollitia esse.
                </p>
              </div>

              <div className="absolute left-1 flex h-5 w-5 -translate-x-1/2 -translate-y-0 items-center justify-center rounded-full  ring-2 ring-white bg-neutral-800"></div>
            </div>

            <div className="relative flex w-full items-center">
              <div className="w-auto pl-8 text-left">
                <h3 className="font-bold text-lg">Session 1</h3>
                <div className="flex flex-row gap-5">
                  <div className="text-lg flex flex-row gap-[5px] ">
                    <Image
                      src={"/icons/calendar-icon.svg"}
                      alt="calendar-icon"
                      width={24}
                      height={24}
                    ></Image>
                    <p>1 June 2025</p>
                  </div>
                  <div className="text-lg flex flex-row gap-[5px]">
                    <Image
                      src={"/icons/time-icon.svg"}
                      alt="calendar-icon"
                      width={24}
                      height={24}
                    ></Image>
                    <p>2 - 4 Jam/Sessions</p>
                  </div>
                </div>

                <p className="mt-2 text-lg">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Earum rerum est excepturi, laboriosam maiores blanditiis
                  aliquid aliquam accusantium, dolores enim rem. Quidem
                  similique, quos modi veniam ea velit mollitia esse.
                </p>
              </div>

              <div className="absolute left-1 flex h-5 w-5 -translate-x-1/2 -translate-y-0 items-center justify-center rounded-full  ring-2 ring-white bg-neutral-800"></div>
            </div>

            <div className="relative flex w-full items-center">
              <div className="w-auto pl-8 text-left">
                <h3 className="font-bold text-lg">Session 1</h3>
                <div className="flex flex-row gap-5">
                  <div className="text-lg flex flex-row gap-[5px] ">
                    <Image
                      src={"/icons/calendar-icon.svg"}
                      alt="calendar-icon"
                      width={24}
                      height={24}
                    ></Image>
                    <p>1 June 2025</p>
                  </div>
                  <div className="text-lg flex flex-row gap-[5px]">
                    <Image
                      src={"/icons/time-icon.svg"}
                      alt="calendar-icon"
                      width={24}
                      height={24}
                    ></Image>
                    <p>2 - 4 Jam/Sessions</p>
                  </div>
                </div>

                <p className="mt-2 text-lg">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Earum rerum est excepturi, laboriosam maiores blanditiis
                  aliquid aliquam accusantium, dolores enim rem. Quidem
                  similique, quos modi veniam ea velit mollitia esse.
                </p>
              </div>

              <div className="absolute left-1 flex h-5 w-5 -translate-x-1/2 -translate-y-0 items-center justify-center rounded-full  ring-2 ring-white bg-neutral-800"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EntrySessionInfo;
