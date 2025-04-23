import React from "react";
import CountdownTimer from "@/components/timer";
import BackButton from "@/components/backButton";
import Link from "next/link";

const BundleHero = () => {
  return (
    <>
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-[url(/images/space-background.png)] bg-cover bg-center -z-10">
          <div className="absolute inset-0 bg-linear-to-t from-neutral-900/100 to-neutral-900/10 -z-20"></div>
        </div>
        <div className="absolute w-2/3 h-2/3  top-1/4 left-1/6 -translate-x-1/2 bg-[url('/images/planet/planet-kuning.png')] bg-contain bg-no-repeat -z-10 opacity-60 drop-shadow-[0_0_30px_rgba(20,74,200,0.3)]"></div>
        <section className="flex flex-col items-center justify-center h-152 font-display  bg-no-repeat bg-cover w-full">
          <div className="self-start">
            <BackButton></BackButton>
          </div>
          <div className="flex flex-col items-center text-center font-display w-xl lg:w-5xl">
            <div className="flex justify-center items-center gap-5">
              <div className="text-white border-solid border-1 rounded-[5px] px-4.5 py-1.5 border-white">
                <CountdownTimer
                  targetDate={"2025-05-30T23:59:59"}
                  initialServerTime={Date.now()}
                />
              </div>
              <div className="bg-primary-800 text-white  rounded-lg text-center">
                <p className="m-auto px-4.5 py-2">Bundle</p>
              </div>
            </div>

            <p className="text-[46px] font-bold bg-gradient-to-b from-gray-300 to-gray-400 bg-clip-text text-transparent">
              Web Development + Software Engineering
            </p>
            <p className="font-bold bg-gradient-to-b from-gray-300 to-gray-400 bg-clip-text text-transparent">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem
              provident odit repellendus temporibus magnam. Sequi dolores enim
              illo debitis corrupti quam deserunt nisi, commodi nam voluptatem
              omnis quo reprehenderit vel.
            </p>
            <Link
              href={"../programs"}
              className="bg-blue-500 text-white p-[8px] text-base m-[14px] rounded-lg"
              type="button"
            >
              Begin Your Journey Here
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default BundleHero;
