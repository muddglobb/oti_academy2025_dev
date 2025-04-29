import React from "react";
import CountdownTimer from "@/components/timer";
import BackButton from "@/components/backButton";
import Link from "next/link";

type HeroProps = {
  classLevel: string;
  className: string;
  classDescription: string;
};

const ClassHero = ({ classLevel, className, classDescription }: HeroProps) => {
  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/images/space-background.png')" }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-neutral-900/100 to-neutral-900/10 -z-20"></div>
      </div>
      <div
        className="absolute w-3/4 h-3/4 -mt-[3%] top-1/4 left-1/5 -translate-x-1/2 bg-contain bg-no-repeat -z-10 brightness-40 drop-shadow-[0_0_30px_rgba(20,74,200,0.2)]"
        style={{ backgroundImage: "url(/images/planet/planet-kuning.png)" }}
      ></div>
      <section className="flex flex-col items-center justify-center h-152 font-display  bg-no-repeat bg-cover w-full">
        <div className="self-start">
          <BackButton></BackButton>
        </div>
        <div className="flex flex-col items-center text-center font-display w-sm md:w-2xl lg:w-4xl gap-3">
          <div className="flex justify-center items-center gap-5">
            <div className="text-white border-solid border-1 rounded-[5px] px-4.5 py-1.5 border-white">
              <CountdownTimer targetDate={"2025-05-30T23:59:59"} />
            </div>
            <div className="bg-primary-800 text-white  rounded-lg text-center">
              <p className="m-auto px-4.5 py-2">{classLevel}</p>
            </div>
          </div>

          <p className="sm:text-[46px] text-2xl font-bold bg-gradient-to-b from-gray-300 to-gray-400 bg-clip-text text-transparent">
            {className}
          </p>
          <p className="sm:text-lg text-sm font-bold bg-gradient-to-b from-gray-300 to-gray-400 bg-clip-text text-transparent">
            {classDescription}
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
  );
};

export default ClassHero;
