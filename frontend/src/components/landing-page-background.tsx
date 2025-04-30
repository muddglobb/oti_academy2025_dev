import React from "react";
import Image from "next/image";

const LandingPageBackground = () => {
  return (
    <div className="absolute inset-0 z-10">
      <Image
        src="/images/stars-beginner-programs.png"
        alt="Background with stars"
        fill
        className="absolute top-0 left-0 w-full object-cover -z-1000"
        priority
      />
      <div className="absolute w-full pointer-events-none left-[60%] md:left-[80%] top-[283px] md:top-[315px]">
        {/* bumi */}
        <Image
          src="/images/planet/bumi.png"
          alt="bumi"
          width={663}
          height={663}
          className="object-contain"
        />
      </div>

      <div className="absolute w-full pointer-events-none left-[-20%] sm:left-[1.5%] top-[179px] md:top-[372px]">
        {/* bulan */}
        <Image
          src="/images/planet/bulan.png"
          alt="bulan"
          width={169}
          height={169}
          className="object-contain"
        />
      </div>

      <div className="absolute w-full pointer-events-none left-[-200px] top-[1350px] md:left-[-450px] md:top-[1562px]">
        {/* mars */}
        <Image
          src="/images/planet/planet-kuning.png"
          alt="mars"
          width={962}
          height={962}
          className="object-contain"
        />
      </div>

      <div className="absolute w-full pointer-events-none left-[620px] top-[3862px]">
        {/* saturnus */}
        <Image
          src="/images/planet/saturnus.png"
          alt="mars"
          width={1462}
          height={1462}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default LandingPageBackground;