import React from "react";
import Link from "next/link";
import CountdownTimer from "@/components/timer";
import { ArrowLeft } from "lucide-react";
import BeginJourney from "../begin-journey";

type HeroProps = {
  hero: [string, string, string];
};
const IntermediateHero = ({ hero }: HeroProps) => {
  const [title, description, classLevel] = hero;
  return (
    <div
      className="relative w-full overflow-hidden
    pt-35
    sm:pt-31 h-screen
    bg-[linear-gradient(0deg,rgba(5,12,26,0.8)_0%,rgba(5,12,26,0.2)_100%)]
    "
    >
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/images/space-background.png')" }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-neutral-900/100 to-neutral-900/10 -z-20"></div>
      </div>

      <div
        className="absolute w-5/6 h-5/6 right-6/8 -top-10 bg-right -mr-[30%] bg-contain bg-no-repeat -z-10 scale-x-[-1] rotate-[-35deg] brightness-40 "
        style={{ backgroundImage: "url(/images/planet/planet-kuning.png)" }}
      ></div>

      <div className="mt-2 ml-6 md:ml-10 lg:ml-15">
        <Link
          href="/programs"
          className="flex gap-2 bg-primary-800 text-[14px] font-bold px-4.5 py-3 rounded-[8px] w-fit"
        >
          <ArrowLeft size={20} color="white" />
          <p className="text-white ">Kembali</p>
        </Link>
      </div>

      <div
        className="
        flex
        flex-col
        items-center
        justify-center
        relative
        w-full
        lg:mb-35
        
      "
      style={{ height: "calc(100% - 140px)" }}
      >
        {/* bg-[linear-gradient(0deg,rgba(5,12,26,0.8)_0%,rgba(5,12,26,0.2)_100%)] */}

        <div
          className="flex-col items-center justify-center 
        md:px-10
        lg:px-15

        mt-11
        "
        >
          <div className="flex flex-col items-center gap-3 lg:gap-10 mx-9 xl:mx35">
            <div className="flex flex-col gap-2.5">
              <div className="flex gap-5 items-center justify-center">
                <div className="text-white border-solid border-1 rounded-[5px] px-4.5 py-1.5 border-white">
                  <CountdownTimer targetDate={"2025-06-30T23:59:59"} />
                </div>

                <div>
                  <p
                    className="text-[var(--color-neutral-50)] bg-[var(--color-primary-800)] font-bold px-4.5 py-3 rounded-[5px]
                  text-[12px]
                  sm:text-[18px]
                  "
                  >
                    {classLevel}
                  </p>
                </div>
              </div>

              <p
                className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center font-bold
              text-[22px]
              md:text-[30px]
              lg:text-[46px]
              "
              >
                {title}
              </p>
              <p
                className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center 
              text-[14px]
              md:text-[20px]
              lg:text-[27px]
              "
              >
                {description}
              </p>
            </div>

            <BeginJourney/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntermediateHero;
