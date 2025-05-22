import Container from "@/components/container";
import React from "react";
import PilihanKelasSlider from "@/components/pilihan-kelas-slider";
import Image from "next/image";

const PilihanKelas =() => {
    return (
        <Container className="w-full px-0 sm:px-0 flex flex-col justify-center relative bg-neutral-900/40">
            <Image
                src="/images/stars-hero-programs.png"
                alt="stars"
                layout="fill"
                className="absolute left-0 max-h-screen object-cover -z-100"
                style={{ top: "-26%" }}
            />
            <div className="bg-gradient-to-b from-neutral-900/40 to-neutral-900/40 flex flex-col items-center justify-center">
                <div className="m-1">
                    <h1 className="pt-10 lg:w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold">
                        Pilihan Kelas untuk Semua Tingkatan
                    </h1>
                    <p className="pt-0 pb-10 lg:px-24 px-9 text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[12px] sm:text-[18px]">
                        Online program ini mencakup <span className="font-bold">6 kelas untuk pemula</span> yang dirancang membangun pemahaman dasar IT dari <span className="font-bold">nol</span>, serta <span>4 kelas intermediate</span> untuk peserta yang ingin <span className="font-bold">mendalami keterampilan lebih lanjut</span>. Kelas berlangsung dari <span className="font-bold">1 Juni hingga 30 Juni 2025</span> dengan materi yang terstruktur dan mudah diikuti.
                    </p>
                </div>
                <div className="w-full pt-0 md:pt-10 flex justify-center items-center pb-48">
                    <PilihanKelasSlider />
                </div>
            </div>
        </Container>
    );
}

export default PilihanKelas;
