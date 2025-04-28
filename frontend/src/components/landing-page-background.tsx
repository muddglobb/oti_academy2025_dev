import React from "react";
import Image from "next/image";

const LandingPageBackground = () => {
  return (
    <div>
      <div className="absolute w-full pointer-events-none left-[60%] md:left-[80%] top-[283px] md:top-[315px]">
        {/* bumi */}
        <Image
          src="/images/planet/bumi.png"
          alt="bumi"
          width={663}
          height={663}
          className="object-contain"
        ></Image>
      </div>

      <div className="absolute w-full pointer-events-none left-[-20%] sm:left-[1.5%] top-[179px] md:top-[372px]">
        {/* bulan */}
        <Image
          src="/images/planet/bulan.png"
          alt="bulan"
          width={169}
          height={169}
          className="object-contain"
        ></Image>
      </div>

      <div className="absolute w-full pointer-events-none left-[-500px] top-[862px]">
        {/* mars */}
        <Image
          src="/images/planet/planet-kuning.png"
          alt="bulan"
          width={962}
          height={962}
          className="object-contain"
        ></Image>
      </div>
    </div>
  );
};

export default LandingPageBackground;
