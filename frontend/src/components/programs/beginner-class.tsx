import React from "react";
import Image from "next/image";
import BeginnerSlider from "@/components/beginner-slider";

const BeginnerClass = () => {
  // bg-[url('/images/background-programs.png')]
  return (
    <>
      <div
            id="entry-class"
            className="invisible h-0 scroll-mt-2 md:scroll-mt-[2rem]"
            aria-hidden="true"
        />
      <div
        className="w-full pb-25 bg-cover bg-center flex flex-col items-center justify-center
          bg-[linear-gradient(0deg,rgba(5,12,26,0.9)_0%,rgba(5,12,26,0.6)_100%)]
          relative
        "
      >
        <div className="flex-col items-center justify-center 
        px-10
        lg:px-60">
          {/* bintang dan planet */}
          <>
            <Image
              src="/images/stars-beginner-programs.png"
              // src="/images/tes_bg.jpg"
              alt="stars"
              fill
              className="absolute top-0 left-0 w-full object-cover -z-1"
            ></Image>
            
          </>

          {/* isi */}
          <>
            <div className="mb-11">
              <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center 
              text-[22px]
              lg:text-[32px] font-bold mt-15">
                Kelas Pemula untuk Memulai Perjalanan Belajarmu
              </p>
              <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center 
              text-[14px]
              lg:text-[18px]">
                Kelas pemula dengan materi esensial buat langkah pertamamu dari{" "}
                <span className="font-bold">1 juni - 15 juni 2025</span>
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="">
                <BeginnerSlider />
              </div>
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default BeginnerClass;
