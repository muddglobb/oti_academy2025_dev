import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

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
        h-245

        bg-cover 
        bg-center

        flex
        flex-col
        justify-between
        
        bg-[linear-gradient(0deg,rgba(5,12,26,1.0)_0%,rgba(5,12,26,0.3)_100%)]
        relative
      "
      >
        {/* bg-[url('/images/footer-background.png')]  */}

        <Image
          src="/images/stars-footer.png"
          alt="stars"
          fill
          className="absolute top-0 left-0 w-full object-cover -z-10"
        ></Image>

        <div className="px-[500px] flex flex-col items-center justify-center h-screen">
          <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[46px] font-bold">
            Ready to Unlock Your IT Potential and Thrive at Any Level?
          </p>
          <div className="flex justify-center mt-4">
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>

        <div className="flex justify-between p-[50px]">
          <div className="text-[var(--color-neutral-50)] w-[33%] flex flex-col gap-[20px]">
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
            <Image
              src="/mail-icon.png"
              alt="Mail Icon"
              width={28}
              height={28}
            ></Image>
            <Image
              src="/instagram-icon.png"
              alt="Mail Icon"
              width={28}
              height={28}
            ></Image>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
