import React from "react";
import Image from "next/image";

const EntryClassInfo = () => {
  return (
    <section className="flex flex-col gap-7.5  justify-center items-center py-10 bg-no-repeat bg-cover w-full">
      <p className="text-[2rem] text-center font-bold bg-gradient-to-b from-gray-300 to-gray-400 bg-clip-text text-transparent">
        Detailed Information About Our Class
      </p>
      <div className="w-4xl">
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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore,
              fuga rem quibusdam nulla commodi excepturi fugit vitae sint quia
              distinctio id. Ipsa a dolorem inventore quas aliquid ratione
              voluptates dignissimos!
            </p>
          </div>
          <div className="text-sm text-white flex flex-col gap-2">
            <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-sm px-2.5 py-2">
              <Image
                src={"/icons/calendar-icon.svg"}
                alt="calendar-icon"
                width={21}
                height={21}
              ></Image>
              <p>1 - 15 June 2025</p>
            </div>
            <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-sm px-2.5 py-2">
              <Image
                src={"/icons/target-icon.svg"}
                alt="calendar-icon"
                width={21}
                height={21}
              ></Image>
              <p>6 Sesi</p>
            </div>
            <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-sm px-2.5 py-2">
              <Image
                src={"/icons/time-icon.svg"}
                alt="calendar-icon"
                width={21}
                height={21}
              ></Image>
              <p>2 Jam/Sesi</p>
            </div>
            <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-sm px-2.5 py-2">
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
      </div>
    </section>
  );
};

export default EntryClassInfo;
