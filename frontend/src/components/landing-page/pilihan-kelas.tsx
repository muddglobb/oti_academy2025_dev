import Container from "@/components/container";
import React from "react";
import PilihanKelasSlider from "@/components/pilihan-kelas-slider";
import Image from "next/image";

const PilihanKelas = () => {
  return (
    <div
      className="
                bg-[linear-gradient(0deg,rgba(5,12,26,0.6)_0%,rgba(5,12,26,0.8)_100%)]
                relative
                py-10
pb-20
                "
    >
      <div
        className="flex-col items-center justify-center 
              "
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
        <Container className="w-full px-0 sm:px-0 flex flex-col justify-center relative">
          <Image
            src="/images/stars-hero-programs.png"
            alt="stars"
            layout="fill"
            className="absolute left-0 max-h-screen object-cover -z-100"
            style={{ top: "-26%" }}
          />
          <div className="flex flex-col items-center justify-center">
            <div className="m-1">
              <h1 className="pt-10 lg:w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold">
                Pilihan Kelas untuk Semua Tingkatan
              </h1>
              <p className="pt-0 pb-10 lg:px-24 px-9 text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[12px] sm:text-[18px]">
                Online program ini mencakup{" "}
                <span className="font-bold">6 kelas untuk pemula</span> yang
                dirancang membangun pemahaman dasar IT dari{" "}
                <span className="font-bold">nol</span>, serta{" "}
                <span>4 kelas intermediate</span> untuk peserta yang ingin{" "}
                <span className="font-bold">
                  mendalami keterampilan lebih lanjut
                </span>
                . Kelas berlangsung dari{" "}
                <span className="font-bold">1 Juni hingga 30 Juni 2025</span>{" "}
                dengan materi yang terstruktur dan mudah diikuti.
              </p>
            </div>
            <div className="w-full pt-0 md:pt-10 flex justify-center ">
              <PilihanKelasSlider />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default PilihanKelas;
