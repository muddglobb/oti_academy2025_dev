import Container from "@/components/container";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "@/components/timer";
import { Button } from "@/components/ui/button";

const Hero = () => {
    return (
        <Container className="bg-gradient-to-b from-[rgba(5,12,26,0.75)] via-[rgba(5,12,26,0.4)] to-[#050C1A] py-40 max-h-screen flex flex-col items-center justify-center">
            <div className="pb-5 flex flex-row gap-5 md:flex-col pb-7 lg:pt-0">
                <div className="justify-center items-center flex lg:pt-3">
                    <Link href="https://omahti.web.id/">
                        <Image
                            src="/logo-oti.svg"
                            alt="Logo"
                            width={82.828}
                            height={31}
                        />
                    </Link>
                </div>
                <div className="text-white border-solid border-1 rounded-[5px] px-4.5 py-1.5 border-white">
                    <CountdownTimer targetDate={"2025-06-30T23:59:59"} />
                </div>
            </div>
            <div className="lg:px-62 gap-4 flex flex-col px-9">
                <h1 className="lg:leading-17 text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[1.375rem] sm:text-[2.5rem] font-bold">
                    Pelatihan IT Terstruktur yang Dirancang untuk Semua Tingkat Keahlian
                </h1>
                <p className="lg:px-24 px-9 text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[14px] sm:text-[18px]">
                    <span className="font-bold"> Online Mini Bootcamp </span> yang menawarkan pengalaman belajar intensif, mengasah keterampilan IT, cocok untuk <span className="font-bold"> pemula dan yang ingin mendalami bidang spesifik.</span>
                </p>
                <Link href="/register" className="flex justify-center">
                    <Button className="h-11">
                        Begin Your Journey Here
                    </Button>
                </Link>
            </div>
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-20 pt-14">
                <div className="flex flex-row gap-5 lg:gap-20">
                    <div className="flex flex-col w-35 sm:w-55">
                        <p className="flex-inline text-neutral-50 font-bold text-center text-[14px] sm:text-[2em]">500+</p>
                        <p className="flex-inline text-neutral-50 text-center text-[14px] sm:text-[22px] align-stretch tracking-[-0.22px]">Participants</p>
                    </div>
                    <div className="flex flex-col w-35 sm:w-55">
                        <p className="flex-inline text-neutral-50 font-bold text-center text-[14px] sm:text-[2em]">4+ Years</p>
                        <p className="flex-inline text-neutral-50 text-center text-[14px] sm:text-[22px] align-stretch tracking-[-0.22px]">Program Running</p>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <div className="flex flex-col w-35 sm:w-55 justify-center items-center">
                        <p className="flex-inline text-neutral-50 font-bold text-center text-[14px] sm:text-[2em]">20+</p>
                        <p className="flex-inline text-neutral-50 text-center text-[14px] sm:text-[22px] align-stretch tracking-[-0.22px]">Industry Connection</p>
                    </div>
                </div>
            </div>

        </Container>
    );
}

export default Hero;