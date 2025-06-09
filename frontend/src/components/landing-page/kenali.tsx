import React from "react";
import Container from "@/components/container";
import KenaliSlider from "@/components/kenali-slider";
import Image from "next/image";
import * as motion from "motion/react-client"
import { fadeIn } from "@/lib/animation";

const Kenali = () => {
  return (
    <>
      <div
          id="about"
          className="invisible h-0 scroll-mt-12 md:scroll-mt-[6.5rem]"
          aria-hidden="true"
      />
      <div
        className="scroll-smooth w-full bg-cover bg-center flex flex-col items-center justify-center
                  bg-[linear-gradient(0deg,rgba(5,12,26,0.6)_0%,rgba(5,12,26,0.8)_100%)]
                  relative
                "
      >
        <div
          className="flex-col items-center justify-center 
                px-20"
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
          </>

          {/* isi */}

          <motion.div
            variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
              }}
            >
            <Container className="flex flex-col items-center justify-center pb-20 md:pb-41">
              <h1 className="pt-10 lg:w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold z-0">
                Kenali Lebih Dekat OmahTI Academy
              </h1>
                  <div className="pt-0 md:pt-10 flex flex-col xl:flex-row justify-center items-center">
                      <KenaliSlider/>
                  </div>
              <p className="pt-0 md:pt-10 lg:px-24 px-9 text-neutral-50 text-center text-[12px] sm:text-[18px]">
                Dulu dikenal sebagai OEM-OEM dan OLC, sekarang OmahTI Academy
                hadir sebagai{" "}
                <span className="font-bold">
                  program belajar IT yang lebih komprehensif
                </span>
                . Di sini, pemula bisa mulai dari dasar, sementara peserta tingkat{" "}
                <span className="font-bold">
                  intermediate bisa mendalami bidang yang mereka minati
                </span>
                . Selain belajar, program ini juga membuka wawasan teknologi dan
                memberi kesempatan untuk terhubung langsung dengan{" "}
                <span className="font-bold">profesional di industri</span>.
              </p>
            </Container>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Kenali;
