import React from 'react';
import Container from "@/components/container";
import KenaliSwiper from '@/components/kenali-swiper';

const Kenali = () => {
    return (
        <Container className="flex flex-col items-center justify-center bg-neutral-900 pb-20 md:pb-41">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-4xl lg:text-[2.5rem] font-bold">
                Kenali Lebih Dekat OmahTI Academy
            </h1>
            <div className="pt-[45px] flex flex-col xl:flex-row justify-center items-center">
                <KenaliSwiper/>
            </div>
            <p className="pt-0 md:pt-10 lg:px-24 px-9 text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[14px] sm:text-[18px]">
            Dulu dikenal sebagai OEM-OEM dan OLC, sekarang OmahTI Academy hadir sebagai <span className='font-bold'>program belajar IT yang lebih komprehensif</span>. Di sini, pemula bisa mulai dari dasar, sementara peserta tingkat <span className='font-bold'>intermediate bisa mendalami bidang yang mereka minati</span>. Selain belajar, program ini juga membuka wawasan teknologi dan memberi kesempatan untuk terhubung langsung dengan <span className='font-bold'>profesional di industri</span>.
            </p>
        </Container>
    )
}

export default Kenali;