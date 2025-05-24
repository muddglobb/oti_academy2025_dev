import Container from "@/components/container";
import ComingSoonCard from "../coming-soon-card";
import Image from "next/image";
const ComingSoon = () => {
    return (
        <Container className="flex flex-col gap-5 lg:gap-10 bg-gradient-to-b from-neutral-900/40 via-neutral-900/70 to-neutral-900/70">
            <Image
                src="/images/stars-hero-programs.png"
                alt="stars"
                layout="fill"
                className="absolute left-0 max-h-screen sm:max-h-fit object-cover -z-100"
                style={{ top: "42.5%" }}
            />
            <Image
                src="/images/stars-hero-programs.png"
                alt="stars"
                layout="fill"
                className="absolute left-0 max-h-screen sm:max-h-fit object-cover -z-100"
                style={{ top: "48%" }}
            />
            <Image
                src="/images/stars-hero-programs.png"
                alt="stars"
                layout="fill"
                className="absolute left-0 max-h-screen sm:max-h-fit object-cover -z-100"
                style={{ top: "56%" }}
            />
            <Image
                src="/images/stars-hero-programs.png"
                alt="stars"
                layout="fill"
                className="absolute left-0 max-h-screen sm:max-h-fit object-cover -z-100"
                style={{ top: "63%" }}
            />
            <div className="z-0 flex flex-col items-center justify-center py-10">
                    <h1 className="pt-10 lg:w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold">Segera Hadir Mentor-Mentor Profesional yang Siap Membimbingmu</h1>
                    <p className="pt-2 lg:px-24 px-9 text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[12px] sm:text-[18px] pb-10">
                        Mereka datang dari berbagai <span className="font-bold"> bidang industri</span>, siap berbagi ilmu dan pengalaman langsung dari dunia nyata. Khusus di <span className="font-bold"> Kelas Intermediate</span>, para mentor ini akan jadi pembimbing kamu untuk naik level dengan<span className="font-bold"> wawasan yang praktis dan relevan</span>!
                    </p>
                    <div className="flex lg:flex-row flex-col justify-center gap-5 pb-4">
                        <ComingSoonCard/>
                        <ComingSoonCard/>
                        <ComingSoonCard/>
                        <ComingSoonCard/>
                    </div>
            </div>
        </Container>
    )
}

export default ComingSoon;