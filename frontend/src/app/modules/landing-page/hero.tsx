import Container from "@/components/container";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "@/components/timer";
import { Button } from "@/components/ui/button";

const Hero = () => {
    return (
        <Container className="flex flex-col items-center justify-center h-screen">
            <div className="pb-5.5">
                <div className="justify-center items-center flex pb-8.75">
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
            <div className="px-[250px] gap-4 flex flex-col py">
                <h1 className="leading-[69px] text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-4xl lg:text-[2.5rem] font-bold">
                    Pelatihan IT Terstruktur yang Dirancang untuk Semua Tingkat Keahlian
                </h1>
                <p className="px-24 text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[14px] lg:text-[18px]">
                    <span className="font-bold"> Online Mini Bootcamp </span> yang menawarkan pengalaman belajar intensif, mengasah keterampilan IT, cocok untuk <span className="font-bold"> pemula dan yang ingin mendalami bidang spesifik.</span>
                </p>
                <Link href="/register" className="flex justify-center">
                    <Button className="h-[44px]">
                        Begin Your Journey Here
                    </Button>
                </Link>
            </div>
            <div className="flex flex-row gap-20.25 pt-[54.46px]">
                <div className="flex flex-col w-[219px]">
                    <p className="flex-inline text-neutral-50 font-bold text-center text-[14px] lg:text-[2em]">500+</p>
                    <p className="flex-inline text-neutral-50 text-center text-[14px] lg:text-[22px] align-stretch tracking-[-0.22px]">Participants</p>
                </div>
                <div className="flex flex-col w-[219px]">
                    <p className="flex-inline text-neutral-50 font-bold text-center text-[14px] lg:text-[2em]">4+ Years</p>
                    <p className="flex-inline text-neutral-50 text-center text-[14px] lg:text-[22px] align-stretch tracking-[-0.22px]">Program Running</p>
                </div>
                <div className="flex flex-col w-[219px]">
                    <p className="flex-inline text-neutral-50 font-bold text-center text-[14px] lg:text-[2em]">20+</p>
                    <p className="flex-inline text-neutral-50 text-center text-[14px] lg:text-[22px] align-stretch tracking-[-0.22px]">Industry Connection</p>
                </div>
            </div>

        </Container>
    );
}

export default Hero;