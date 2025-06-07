import Link from "next/link";
import CountdownTimer from "@/components/timer";
import { Button } from "@/components/ui/button";

import React from "react";
import Image from "next/image";
import * as motion from "motion/react-client";

const Hero = () => {
  return (
    <div
      className="w-full h-200 md:h-220 lg:h-230 bg-cover bg-center flex flex-col items-center justify-center
        bg-[linear-gradient(0deg,rgba(5,12,26,0.8)_0%,rgba(5,12,26,0.2)_100%)]
        relative
        pt-70
        lg:pt-31
      "
    >
      <div
        className="flex-col items-center justify-center 
      px-2
      lg:px-60"
      >
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
        <div>
          <div className=" flex flex-col items-center justify-center z-0">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2 }}
              className="flex flex-row gap-5 md:flex-col lg:pt-0 pb-7">
              <div className="justify-center items-center flex lg:pt-3">
                <Link
                  href="https://omahti.web.id/"
                  aria-label="Visit OmahTI Website"
                >
                  <Image
                    src="/logo-oti.svg"
                    alt="OmahTI Logo"
                    width={82.828}
                    height={31}
                  />
                </Link>
              </div>
              <div className="text-white border-solid border-1 rounded-[5px] px-4.5 py-1.5 border-white">
                <CountdownTimer targetDate={"2025-06-30T23:59:59"} />
              </div>
            </motion.div>
            <div className="gap-4 flex flex-col px-9">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, type: "spring" }}
                className="lg:leading-17 lg:w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold"
                >
                  Pelatihan IT Terstruktur yang Dirancang untuk Semua Tingkat Keahlian
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 5, type: "spring" }}
                className="lg:px-24 px-9 text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[14px] sm:text-[18px]">
                <span className="font-bold"> Online Mini Bootcamp </span> yang
                menawarkan pengalaman belajar intensif, mengasah keterampilan
                IT, cocok untuk{" "}
                <span className="font-bold">
                  {" "}
                  pemula dan yang ingin mendalami bidang spesifik.
                </span>
              </motion.p>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className="flex justify-center">
                <Link href="/register" aria-label="Register for Bootcamp">
                  <Button className="h-11">Begin Your Journey Here</Button>
                </Link>
              </motion.div>
            </div>
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-20 pt-14">
              <div className="flex flex-row gap-5 lg:gap-20">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 5, delay: 0.1, type: "spring" }}
                  className="flex flex-col w-35 sm:w-55">
                  <p className="flex-inline text-neutral-50 font-bold text-center text-[14px] sm:text-[2em]">
                    500+
                  </p>
                  <p className="flex-inline text-neutral-50 text-center text-[14px] sm:text-[22px] align-stretch tracking-[-0.22px]">
                    Participants
                  </p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 5, delay: 0.3, type: "spring" }}
                  className="flex flex-col w-35 sm:w-55">
                  <p className="flex-inline text-neutral-50 font-bold text-center text-[14px] sm:text-[2em]">
                    4+ Years
                  </p>
                  <p className="flex-inline text-neutral-50 text-center text-[14px] sm:text-[22px] align-stretch tracking-[-0.22px]">
                    Program Running
                  </p>
                </motion.div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 5, delay: 0.5, type: "spring" }}
                className="flex justify-center items-center">
                <div className="flex flex-col w-35 sm:w-55 justify-center items-center">
                  <p className="flex-inline text-neutral-50 font-bold text-center text-[14px] sm:text-[2em]">
                    20+
                  </p>
                  <p className="flex-inline text-neutral-50 text-center text-[14px] sm:text-[22px] align-stretch tracking-[-0.22px]">
                    Industry Connection
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
