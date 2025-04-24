import React from "react";
import Image from "next/image";

const ProgramsHero = () => {
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
        
        bg-[linear-gradient(0deg,rgba(5,12,26,0.8)_0%,rgba(5,12,26,0.2)_100%)]
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

        <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[46px] font-bold">
        Jelajahi Beragam Program yang Kami Tawarkan
        </p>
        <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[27px]">
          Dari <span className="font-bold">Beginner hingga Intermediate</span>,
          kami menawarkan program yang mencakup keduanya, lengkap{" "}
          <span className="font-bold">
            dengan bundling package untuk pengalaman belajar yang lebih
            menyeluruh!
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProgramsHero;
