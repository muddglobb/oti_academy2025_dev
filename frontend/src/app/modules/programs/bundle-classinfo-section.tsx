import React from "react";
import Image from "next/legacy/image";

const BundleClassInfo = () => {
  return (
    <>
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/space-background.png')] bg-repeat bg-center -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 to-neutral-900/10 -z-20"></div>
        </div>
        <div className="absolute w-3/4 h-3/4 top-0 right-0 bg-right -mr-[30%] -mt-[10%] bg-[url('/images/planet/saturnus.png')] bg-contain bg-no-repeat -z-10 scale-x-[-1] rotate-[-35deg] brightness-40"></div>
        <section className="flex flex-col gap-7.5  justify-center items-center py-10 bg-no-repeat bg-cover w-full">
          <p className="text-[2rem] text-center font-bold bg-gradient-to-b from-gray-300 to-gray-400 bg-clip-text text-transparent">
            Detailed Information About Our Class
          </p>
          <div className="w-4xl flex flex-col justify-center items-center gap-[25px]">
            <div className="flex flex-row justify-center gap-x-8">
              <div className="flex flex-col w-74 h-108 bg-white rounded-lg">
                <div className="w-[297px] h-[284px] bg-[url(/person-placeholder.jpeg)] rounded-lg mask-b-from-90% bg-cover">
                  <div className="flex flex-row justify-between m-5">
                    <div className="text-white flex flex-col gap-1 ">
                      <div className="bg-primary-800 rounded-[5px] font-bold text-center h-auto w-[162px]">
                        <p className="text-[22px] ">Dhimas Putra</p>
                      </div>
                      <div className="bg-primary-800 rounded-[5px] w-[122px] text-center">
                        <p className="text-[12px]">Teaching Assistant</p>
                      </div>
                    </div>
                    <button className="w-[30px] h-[30px] ">
                      <Image
                        src={"/icons/linkedin-icon.svg"}
                        alt="linkedin-icon"
                        width={30}
                        height={30}
                        className="bg-primary-50 rounded-[5px] mt-0 p-[5px] border-s-white border-[1px] "
                      ></Image>
                    </button>
                  </div>
                </div>
                <p className="m-4 text-xs">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolore, fuga rem quibusdam nulla commodi excepturi fugit vitae
                  sint quia distinctio id. Ipsa a dolorem inventore quas aliquid
                  ratione voluptates dignissimos!
                </p>
              </div>
              <div className="flex flex-col w-74 h-108 bg-white rounded-lg">
                <div className="w-[297px] h-[284px] bg-[url(/person-placeholder.jpeg)] rounded-lg mask-b-from-90% bg-cover">
                  <div className="flex flex-row justify-between m-5">
                    <div className="text-white flex flex-col gap-1 ">
                      <div className="bg-primary-800 rounded-[5px] font-bold text-center h-auto w-[162px]">
                        <p className="text-[22px] ">Dhimas Putra</p>
                      </div>
                      <div className="bg-primary-800 rounded-[5px] w-[122px] text-center">
                        <p className="text-[12px]">Teaching Assistant</p>
                      </div>
                    </div>
                    <button className="w-[30px] h-[30px] ">
                      <Image
                        src={"/icons/linkedin-icon.svg"}
                        alt="linkedin-icon"
                        width={30}
                        height={30}
                        className="bg-primary-50 rounded-[5px] mt-0 p-[5px] border-s-white border-[1px] "
                      ></Image>
                    </button>
                  </div>
                </div>
                <p className="m-4 text-xs">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolore, fuga rem quibusdam nulla commodi excepturi fugit vitae
                  sint quia distinctio id. Ipsa a dolorem inventore quas aliquid
                  ratione voluptates dignissimos!
                </p>
              </div>
            </div>
            <div className="text-sm text-white flex flex-col gap-2">
              <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-[619px] px-2.5 py-2">
                <Image
                  src={"/icons/calendar-icon.svg"}
                  alt="calendar-icon"
                  width={21}
                  height={21}
                ></Image>
                <p>1 - 15 June 2025</p>
              </div>
              <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-[619px] px-2.5 py-2">
                <Image
                  src={"/icons/target-icon.svg"}
                  alt="calendar-icon"
                  width={21}
                  height={21}
                ></Image>
                <p>6 Sesi</p>
              </div>
              <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-[619px] px-2.5 py-2">
                <Image
                  src={"/icons/time-icon.svg"}
                  alt="calendar-icon"
                  width={21}
                  height={21}
                ></Image>
                <p>2 Jam/Sesi</p>
              </div>
              <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-[619px] px-2.5 py-2">
                <Image
                  src={"/icons/stack-icon.svg"}
                  alt="calendar-icon"
                  width={21}
                  height={21}
                ></Image>
                <p>10 Modul</p>
              </div>
            </div>
          </div>
        </section>
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
      </div>
    </>
  );
};

export default BundleClassInfo;
