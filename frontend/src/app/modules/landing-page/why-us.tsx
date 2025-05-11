import Container from "@/components/container";
import { SquarePen, Database, Clipboard, UserPlus } from "lucide-react";
import Image from "next/image";

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

const Sponsors =[
    {
        src: "/images/sponsors/sponsor1.jpeg",
        alt: "sponsor 1",
    },
    {
        src: "/images/sponsors/sponsor2.jpg",
        alt: "sponsor 2",
    },
    {
        src: "/images/sponsors/sponsor3.JPG",
        alt: "sponsor 3",
    },
    {
        src: "/images/sponsors/sponsor1.jpeg",
        alt: "sponsor 4",
    },
    {
        src: "/images/sponsors/sponsor2.jpg",
        alt: "sponsor 5",
    },
    {
        src: "/images/sponsors/sponsor3.JPG",
        alt: "sponsor 6",
    }
]

const WhyUs = () => {
    return (
        <Container className="items-center gap-4 lg:gap-10 bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-900/40">
            <Image
                src="/images/stars-hero-programs.png"
                alt="stars"
                layout="fill"
                className="absolute left-0 max-h-screen object-cover -z-100"
                style={{ top: "26%" }}
            />
            <h1 className="pt-10 lg:w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold">
                Mengapa Kami Pilihan Tepat untuk Kamu
            </h1>
            <div className="z-100 flex flex-col justify-center gap-2 lg:gap-6 pb-6 lg:pb-15">
                {WhyUsContent.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            className="z-100 flex items-center flex-row gap-3 p-6 max-w-screen xl:w-260 border border-white rounded-xl text-neutral-50"
                        >
                            <Icon size={48} />
                            <div className="z-100 flex flex-col">
                                <h2 className="text-[14px] lg:text-[22px] font-bold">{item.header}</h2>
                                <p className="text-[12px] lg:text-[18px]">{item.content}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-9 max-w-screen w-auto">
                {Sponsors.map((img) => (
                    <div key={img.alt} className="w-auto">
                        <Image
                            src={img.src}
                            alt={img.alt}
                            width={103}
                            height={1000}
                            className="rounded-1 object-cover w-auto h-[103px]"
                        />
                    </div>
                ))}
            </div>
        </Container>
    )
}

export default WhyUs;