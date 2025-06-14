import React from "react";
import Image from "next/image";

const ProgramsHero = () => {
  // bg-[url('/images/background-programs.png')]
  return (
    <div
      className="w-full bg-cover bg-center flex flex-col items-center justify-center
        bg-[linear-gradient(0deg,rgba(5,12,26,0.8)_0%,rgba(5,12,26,0.2)_100%)]
        relative
        pt-31
        h-155
        md:h-screen
      "
    >
      <div className="flex-col items-center justify-center 
      px-3
      lg:px-28">
        {/* bintang dan planet */}
        <>
          <Image
            src="/images/stars-hero-programs.png"
            // src="/images/tes_bg.jpg"
            alt="stars"
            fill
            className="absolute top-0 left-0 w-full object-cover -z-1"
          ></Image>

          <div className="absolute w-full pointer-events-none left-[80%] top-[-115px] -z-1">
            {/* bumi */}
            <Image
              src="/images/planet/bumi.png"
              alt="bumi"
              width={663}
              height={663}
              className="object-contain"
            ></Image>
          </div>

          <div className="absolute w-full pointer-events-none left-[1.5%] top-[372px] -z-1">
            {/* bulan */}
            <Image
              src="/images/planet/bulan.png"
              alt="bulan"
              width={169}
              height={169}
              className="object-contain"
            ></Image>
          </div>
        </>

        {/* isi */}
        <>
          <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center font-bold
          text-[22px]
          sm:text-[28px]
          md:text-[32px]
          xl:text-[44px]">
            Jelajahi Beragam Program yang Kami Tawarkan
          </p>
          <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center 
          text-[14px]
          sm:text-[16px]
          lg:text-[18px]">
            Dari <span className="font-bold">Beginner hingga Intermediate</span>
            , kami menawarkan program yang mencakup keduanya, lengkap{" "}
            <span className="font-bold">
              dengan bundling package untuk pengalaman belajar yang lebih
              menyeluruh!
            </span>
          </p>
        </>
      </div>
    </div>
  );
};

export default ProgramsHero;
