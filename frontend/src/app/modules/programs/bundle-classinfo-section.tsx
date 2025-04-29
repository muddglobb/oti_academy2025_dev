import React from "react";
import Image from "next/legacy/image";
// import Link from "next/link";
import TeacherCard from "@/components/teacher-card";
import TeacherCardMobile from "@/components/teacher-card-mobile";

type BundleClassInfoProps = {
  date: string;
  sesi: string;
  jam: string;
  modul: string;
};

const BundleClassInfo = ({ date, sesi, jam, modul }: BundleClassInfoProps) => {
  return (
    <>
      <div className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-repeat bg-center -z-10"
          style={{ backgroundImage: "url('/images/space-background.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-900/10 to-neutral-900/50 -z-20"></div>
        </div>
        <div
          className="absolute w-3/4 h-3/4 top-0 right-0 bg-right -mr-[30%] -mt-[10%]  bg-contain bg-no-repeat -z-10 scale-x-[-1] rotate-[-35deg] brightness-40"
          style={{ backgroundImage: "url(/images/planet/saturnus.png)" }}
        ></div>
        <section className="flex flex-col gap-7.5  justify-center items-center py-10 bg-no-repeat bg-cover w-full">
          <p className="text-[2rem] text-center font-bold bg-gradient-to-b from-gray-300 to-gray-400 bg-clip-text text-transparent">
            Detailed Information About Our Class
          </p>
          <div className="md:w-4xl w-sm">
            <div className="flex flex-col justify-center md:gap-x-8 gap-y-8">
              <div>
                <div className=" hidden md:flex flex-row justify-center gap-6">
                  <TeacherCard
                    teacher="Dhimas Putra"
                    linkedin="https://www.linkedin.com/"
                    description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur asperiores ipsa unde! Dolorem et natus nulla exercitationem dignissimos autem voluptates quam minus temporibus similique dolore, aliquid consectetur quas sequi debitis."
                  ></TeacherCard>
                  <TeacherCard
                    teacher="Dhimas Putra"
                    linkedin="https://www.linkedin.com/"
                    description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur asperiores ipsa unde! Dolorem et natus nulla exercitationem dignissimos autem voluptates quam minus temporibus similique dolore, aliquid consectetur quas sequi debitis."
                  ></TeacherCard>
                </div>
                <div className="flex flex-col justify-center md:hidden gap-6">
                  <TeacherCardMobile
                    teacher="Dhimas Putra"
                    linkedin="https://www.linkedin.com/"
                    description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur asperiores ipsa unde! Dolorem et natus nulla exercitationem dignissimos autem voluptates quam minus temporibus similique dolore, aliquid consectetur quas sequi debitis."
                  ></TeacherCardMobile>
                  <TeacherCardMobile
                    teacher="Dhimas Putra"
                    linkedin="https://www.linkedin.com/"
                    description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur asperiores ipsa unde! Dolorem et natus nulla exercitationem dignissimos autem voluptates quam minus temporibus similique dolore, aliquid consectetur quas sequi debitis."
                  ></TeacherCardMobile>
                </div>
              </div>

              <div className="hidden text-sm text-white md:flex flex-col gap-2 justify-center items-center">
                <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-[619px] px-2.5 py-2">
                  <Image
                    src={"/icons/calendar-icon.svg"}
                    alt="calendar-icon"
                    width={21}
                    height={21}
                  ></Image>
                  <p>{date}</p>
                </div>
                <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-[619px] px-2.5 py-2">
                  <Image
                    src={"/icons/target-icon.svg"}
                    alt="calendar-icon"
                    width={21}
                    height={21}
                  ></Image>
                  <p>{sesi}</p>
                </div>
                <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-[619px] px-2.5 py-2">
                  <Image
                    src={"/icons/time-icon.svg"}
                    alt="calendar-icon"
                    width={21}
                    height={21}
                  ></Image>
                  <p>{jam}</p>
                </div>
                <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-[619px] px-2.5 py-2">
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
