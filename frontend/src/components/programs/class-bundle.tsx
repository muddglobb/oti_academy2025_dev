import React from "react";
import Image from "next/image";
import BundleSlider from "@/components/bundle-slider";

const ClassBundle = () => {
  // bg-[url('/images/background-programs.png')]
  return (
    <div
      className="w-full h-200 bg-cover bg-center flex flex-col items-center justify-center
        bg-[linear-gradient(0deg,rgba(5,12,26,0.6)_0%,rgba(5,12,26,0.9)_100%)]
        relative
      "
    >
      <div className="flex-col items-center justify-center 
      px-10
      lg:px-60">
        {/* bintang dan planet */}
        <>
          <Image
            src="/images/stars-bundle-programs.png"
            // src="/images/tes_bg.jpg"
            alt="stars"
            fill
            className="absolute top-0 left-0 w-full object-cover -z-1"
          ></Image>

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
        </>

        {/* isi */}
        <>
          <div className="mb-11">
            <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center 
            text-[22px]
            lg:text-[32px] font-bold">
              Nikmati Dua Keuntungan Sekaligus dengan Bundling Kelas Kami
            </p>
            <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center 
            text-[14px]
            lg:text-[18px]">
              Tingkatkan kemampuanmu dengan paket belajar pemula hingga
              intermediate dari{" "}
              <span className="font-bold">1 Juni - 30 Juni 2025</span>
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="">
              <BundleSlider />
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default ClassBundle;
