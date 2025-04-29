import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import CountdownTimer from "../timer";
import {ArrowLeft} from "lucide-react";

type HeroProps = {
  hero: [string, string];
};
const IntermediateHero = ({ hero }: HeroProps) => {
  const [title, description] = hero;
  // bg-[url('/images/background-programs.png')]
  return (
    <div
      className="flex flex-col
        h-133 bg-cover 
        bg-center bg-[linear-gradient(0deg,rgba(5,12,26,1.0)_0%,rgba(5,12,26,0.2)_100%)] relative"
      >
      <Image
        src="/images/stars-hero-programs.png"
        alt="stars"
        fill
        className="absolute top-0 left-0 w-full object-cover -z-10"
      ></Image>


      <div className="
      mt-20 ml-3
      ">
        <Link href="/programs" className="flex gap-2 bg-[var(--color-primary-800)] text-[14px] font-bold px-4.5 py-3 rounded-[5px] w-fit">
          <ArrowLeft size={20} color="white"/>
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
      "
      >
        {/* bg-[linear-gradient(0deg,rgba(5,12,26,0.8)_0%,rgba(5,12,26,0.2)_100%)] */}

        <div className="flex-col items-center justify-center 
        px-4
        md:px-10
        lg:px-15

        mt-11
        ">
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-col gap-2.5">
              <div className="flex gap-5 items-center justify-center">
                <div className="text-white border-solid border-1 rounded-[5px] px-4.5 py-1.5 border-white">
                  <CountdownTimer targetDate={"2025-06-30T23:59:59"}/>
                </div>

                <div>
                  <p className="text-[var(--color-neutral-50)] bg-[var(--color-primary-800)] font-bold px-4.5 py-3 rounded-[5px]
                  text-[12px]
                  sm:text-[18px]
                  ">
                    Intermediate Level
                  </p>
                </div>
              </div>

              <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center font-bold
              text-[22px]
              md:text-[30px]
              lg:text-[46px]
              ">
                {title}
              </p>
              <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center 
              text-[14px]
              md:text-[20px]
              lg:text-[27px]
              ">
                {description}
              </p>
            </div>

            <Link href="/register">
              <Button>Begin Your Journey Here!</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntermediateHero;
