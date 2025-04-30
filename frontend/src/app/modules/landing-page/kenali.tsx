import React from 'react';
import Container from "@/components/container";
import KenaliSlider from '@/components/kenali-slider';

const Kenali = () => {
    return (
        <Container className="flex flex-col items-center justify-center bg-neutral-900 pb-20 md:pb-41">
            <h1 className="pt-10 lg:w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold">
                Kenali Lebih Dekat OmahTI Academy
            </h1>
            <div className="pt-0 md:pt-10 flex flex-col xl:flex-row justify-center items-center">
                <KenaliSlider/>
            </div>
            <p className="pt-0 md:pt-10 lg:px-24 px-9 text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[12px] sm:text-[18px]">
                Dulu dikenal sebagai OEM-OEM dan OLC, sekarang OmahTI Academy hadir sebagai <span className='font-bold'>program belajar IT yang lebih komprehensif</span>. Di sini, pemula bisa mulai dari dasar, sementara peserta tingkat <span className='font-bold'>intermediate bisa mendalami bidang yang mereka minati</span>. Selain belajar, program ini juga membuka wawasan teknologi dan memberi kesempatan untuk terhubung langsung dengan <span className='font-bold'>profesional di industri</span>.
            </p>
        </Container>
    )
}

export default Kenali;