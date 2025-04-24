import React from 'react';
import Container from "@/components/container";
import Image from "next/image";

const Kenali = () => {
    return (
        <Container className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-4xl lg:text-[2.5rem] font-bold">
                Kenali Lebih Dekat OmahTI Academy
            </h1>
            <div className="pt-[45px] flex flex-row gap-[28px]">
                <Image
                    src="/images/kenali-omahti/satyeah-wirawr.jpeg"
                    alt="Kenali OmahTI"
                    width={310.75}
                    height={222}
                    className="rounded-[10px] aspect-[310.75/222] w-[310.75px] h-[222px] object-cover"
                />
                <Image
                    src="/images/kenali-omahti/satyeah-wirawr.jpeg"
                    alt="Kenali OmahTI"
                    width={310.75}
                    height={222}
                    className="rounded-[10px] aspect-[310.75/222] w-[310.75px] h-[222px] object-cover"
                />
                <Image
                    src="/images/kenali-omahti/satyeah-wirawr.jpeg"
                    alt="Kenali OmahTI"
                    width={310.75}
                    height={222}
                    className="rounded-[10px] aspect-[310.75/222] w-[310.75px] h-[222px] object-cover"
                />
                <Image
                    src="/images/kenali-omahti/satyeah-wirawr.jpeg"
                    alt="Kenali OmahTI"
                    width={310.75}
                    height={222}
                    className="rounded-[10px] aspect-[310.75/222] w-[310.75px] h-[222px] object-cover"
                />
            </div>
            <p className="px-[235px] pt-[28.5px] text-neutral-50 text-center text-[14px] lg:text-[18px]">
            Dulu dikenal sebagai OEM-OEM dan OLC, sekarang OmahTI Academy hadir sebagai <span className='font-bold'>program belajar IT yang lebih komprehensif</span>. Di sini, pemula bisa mulai dari dasar, sementara peserta tingkat <span className='font-bold'>intermediate bisa mendalami bidang yang mereka minati</span>. Selain belajar, program ini juga membuka wawasan teknologi dan memberi kesempatan untuk terhubung langsung dengan <span className='font-bold'>profesional di industri</span>.
            </p>
        </Container>
    )
}

export default Kenali;