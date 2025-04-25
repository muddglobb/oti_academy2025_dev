import React from "react";
import Image from "next/image";

const IntermediateBackground = () => {
  return (
    <div>
      <div className="absolute w-full pointer-events-none -left-90 top-0">
        {/* mars */}
        <Image
          src="/images/planet/planet-kuning.png"
          alt="bulan"
          width={652}
          height={652}
          className="object-contain"
        ></Image>
      </div>
    </div>
  ); 
};

export default IntermediateBackground;
