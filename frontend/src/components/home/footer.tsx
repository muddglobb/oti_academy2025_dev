import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <div
      className="     
      relative 
      overflow-hidden
    "
    >
      <div>
        <div className="relative w-full h-full pointer-events-none top-[10%]">
          {/* bumi */}
          <Image
            src="/images/planet/pluto.png"
            alt="pluto"
            width={5000}
            height={5000}
            // fill
            className="object-contain absolute"
          ></Image>
        </div>
      </div>

      <div
        className="
        w-full
        h-screen

        bg-cover 
        bg-center

        flex
        flex-col
        justify-between
        
        bg-[linear-gradient(0deg,rgba(5,12,26,1.0)_0%,rgba(5,12,26,0.4)_100%)]
        relative
      "
      >
        <Image
          src="/images/stars-footer.png"
          alt="stars"
          fill
          // width={1800}
          // height={1800}
          className="absolute left-0 w-full object-cover -z-10
          top-[50px]
          lg:top-0"
        ></Image>

        <div className="flex flex-col items-center justify-center h-full
        px-[30px]
        md:px-[260px]">
          <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center font-bold
          text-[22px]
          lg:text-[46px]">
            Ready to Unlock Your IT Potential and Thrive at Any Level?
          </p>
          <div className="flex justify-center mt-4">
            <Link href="/register">
              <Button className="px-5 py-4 text-[16px] font-white">Get Started</Button>
            </Link>
          </div>
        </div>

        <div className="justify-between 
        p-[10px]
        md:p-[30px]
        flex
        flex-col
        gap-[18px]
        md:flex-row">
          <div className="text-[var(--color-neutral-50)] flex flex-col gap-[20px]
          w-full
          md:w-[33%] ">
            <div>
              <p>
                Gedung Fakultas MIPA UGM Sekip Utara, Bulaksumur, Sinduadi,
                Mlati, Sleman, DI Yogyakarta
              </p>
            </div>
            <div>
              <p>@OmahTI UGM - All Rights Reserved.</p>
            </div>
          </div>

          <div className="flex gap-[20px] items-end">
            <Link href="mailto:omahti.mipa@ugm.ac.id">
              <Mail
                width={28}
                height={28}
                color="#f8f9ff"
              />
            </Link>
            <Link href="https://www.instagram.com/omahti_ugm/">
              <Instagram
                width={28}
                height={28}
                color="#f8f9ff"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
