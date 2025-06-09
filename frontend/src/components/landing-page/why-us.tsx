"use client";

import Container from "@/components/container";
import { SquarePen, Database, Clipboard, UserPlus } from "lucide-react";
import Image from "next/image";
import * as motion from "motion/react-client"
import { fadeIn, fadeInComp, slideInComp } from "@/lib/animation";

const WhyUsContent = [
  {
    icon: SquarePen,
    header: "Belajar dengan Praktik",
    content: "Tak hanya teori - aplikasikan skill lewat proyek dunia nyata",
  },
  {
    icon: Database,
    header: "Membangun Skill Langkah demi Langkah",
    content: "Mulai dari fundamental sampai mahir dengan modul jelas",
  },
  {
    icon: Clipboard,
    header: "Validasi Keterampilan Praktis",
    content: "Pencapaian menyelesaikan program beserta proyek akhir",
  },
  {
    icon: UserPlus,
    header: "Akses Langsung ke Mentor",
    content: "Dapatkan feedback dari praktisi aktif",
  },
];

const Sponsors = [
  {
    src: "/images/sponsors/s-mvr.webp",
    alt: "sponsor 1",
    width: 103,
    height: 103,
    displaySize: "h-[103px]"
  },
  {
    src: "/images/sponsors/l-asn.webp",
    alt: "sponsor 2",
    width: 180,
    height: 180,
    displaySize: "h-[180px]"
  },
];

const WhyUs = () => {
  return (
    <div
      className="w-full bg-cover bg-center flex flex-col  justify-center
                bg-[linear-gradient(0deg,rgba(5,12,26,0.6)_0%,rgba(5,12,26,0.8)_100%)]
                relative
                md:pb-20
              "
    >
      <div
        className="flex-col w-full justify-center 
              px-10"
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

          <div className="absolute w-full pointer-events-none left-[-400px] lg:left-[-300px] -z-1">
            {/* mars */}
            <Image
              src="/images/planet/planet-kuning.png"
              alt="mars"
              width={902}
              height={902}
              className="object-contain"
            />
          </div>
        </>

        {/* isi */}
        <Container className="gap-4 lg:gap-10 ">
          <motion.h1 
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
            }}
            className="pt-10 lg:w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold"
          >
              Mengapa Kami Pilihan Tepat untuk Kamu
          </motion.h1>
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
            }}
            className="z-0 flex flex-col justify-center gap-2 lg:gap-6 pb-6 lg:pb-15 items-center"
          >
            {WhyUsContent.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  variants={fadeInComp}
                  initial="hidden"
                  whileInView="visible"
                  custom={index}
                  viewport={{
                    once: true,
                  }}
                  key={index}
                  className="z-100 flex flex-row gap-3 p-6 max-w-screen w-full xl:w-260 border border-white rounded-xl text-neutral-50"
                >
                  <Icon size={48} />
                  <div className="z-100 flex flex-col">
                    <h2 className="text-[14px] lg:text-[22px] font-bold">
                      {item.header}
                    </h2>
                    <p className="text-[12px] lg:text-[18px]">{item.content}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div 
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
            }}
            className="flex flex-wrap justify-center gap-4 md:gap-9 max-w-screen w-auto items-center">
            {Sponsors.map((img, index) => (
              <motion.div 
                variants={slideInComp}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                }}
                transition={{ delay: 2 }}
                custom={index}
                key={index} 
                className={`w-auto ${img.displaySize} flex`}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  className={`rounded-1 object-contain ${img.displaySize} w-auto`}
                />
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </div>
    </div>
  );
};

export default WhyUs;
