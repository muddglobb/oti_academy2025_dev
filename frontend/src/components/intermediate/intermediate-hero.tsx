import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const IntermediateHero = () => {
  // bg-[url('/images/background-programs.png')]
  return (
    <div
      className="
        w-full
        h-133

        bg-cover 
        bg-center
        flex
        flex-col
        items-center
        justify-center
        
        bg-[linear-gradient(0deg,rgba(5,12,26,1.0)_0%,rgba(5,12,26,0.2)_100%)]
        relative
      "
    >
      {/* bg-[linear-gradient(0deg,rgba(5,12,26,0.8)_0%,rgba(5,12,26,0.2)_100%)] */}

      <div className="flex-col items-center justify-center px-[250px]">
        <Image
          src="/images/stars-hero-programs.png"
          alt="stars"
          fill
          className="absolute top-0 left-0 w-full object-cover -z-10"
        ></Image>

        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col gap-2.5">
            <div className="flex gap-5 items-center justify-center">
              <div>
                <p className="text-[var(--color-neutral-50)]">countdown</p>
              </div>
              <div>
                <p className="text-[var(--color-neutral-50)]">tipe kelas</p>
              </div>
            </div>

            <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[46px] font-bold">
              Software Engineering
            </p>
            <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[27px]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi
              suscipit ipsam tenetur temporibus atque velit laudantium animi
              unde eum cum?
            </p>
          </div>

          <Link href="/register">
            <Button>Begin Your Journey Here!</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IntermediateHero;
