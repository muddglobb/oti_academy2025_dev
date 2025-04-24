import Container from "@/components/container";
import { SquarePen, Database, Clipboard, UserPlus } from "lucide-react";
import Image from "next/image";

const WhyUs = () => {
    return (
        <Container className="items-center gap-[45px]">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-4xl lg:text-[32px] font-bold">
                Mengapa Kami Pilihan Tepat untuk Kamu
            </h1>
            <div className="flex flex-col justify-center items-center gap-[30px]">
                <div className="flex flex-row w-[913px] items-center gap-5 p-5 text-white border border-white rounded-lg">
                    <SquarePen className="w-10 h-10" />
                    <div className="flex flex-col gap-[3px] text-neutral-50">
                        <h2 className="text-[22px] font-bold">
                            Belajar dengan Praktik
                        </h2>
                        <p className="text-[18px]">
                            Tak hanya teori - aplikasikan skill lewat proyek dunia nyata
                        </p>
                    </div>
                </div>
                <div className="flex flex-row w-[913px] items-center gap-5 p-5 text-white border border-white rounded-lg">
                    <Database className="w-10 h-10" />
                    <div className="flex flex-col gap-[3px] text-neutral-50">
                        <h2 className="text-[22px] font-bold">
                            Membangun Skill Langkah demi Langkah
                        </h2>
                        <p className="text-[18px]">
                            Mulai dari fundamental sampai mahir dengan modul jelas
                        </p>
                    </div>
                </div>
                <div className="flex flex-row w-[913px] items-center gap-5 p-5 text-white border border-white rounded-lg">
                    <Clipboard className="w-10 h-10" />
                    <div className="flex flex-col gap-[3px] text-neutral-50">
                        <h2 className="text-[22px] font-bold">
                            Validasi Keterampilan Praktis
                        </h2>
                        <p className="text-[18px]">
                            Pencapaian menyelesaikan program beserta proyek akhir
                        </p>
                    </div>
                </div>
                <div className="flex flex-row w-[913px] items-center gap-5 p-5 text-white border border-white rounded-lg">
                    <UserPlus className="w-10 h-10" />
                    <div className="flex flex-col gap-[3px] text-neutral-50">
                        <h2 className="text-[22px] font-bold">
                            Akses Langsung ke Mentor
                        </h2>
                        <p className="text-[18px]">
                            Dapatkan feedback dari praktisi aktif
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-row gap-[36.58px]">
                <Image
                    src="/images/sponsors/sponsor1.jpeg"
                    alt="sponsor 1"
                    height={103}
                    width={1000}
                    className="object-cover h-[103px] w-auto"
                />
                <Image
                    src="/images/sponsors/sponsor2.jpg"
                    alt="sponsor 2"
                    height={103}
                    width={1000}
                    className="object-cover h-[103px] w-auto"    
                />
                <Image
                    src="/images/sponsors/sponsor3.JPG"
                    alt="sponsor 3"
                    height={103}
                    width={1000}
                    className="object-cover h-[103px] w-auto"
                />
                <Image
                    src="/images/sponsors/sponsor1.jpeg"
                    alt="sponsor 1"
                    height={103}
                    width={1000}
                    className="object-cover h-[103px] w-auto"
                />
                <Image
                    src="/images/sponsors/sponsor2.jpg"
                    alt="sponsor 2"
                    height={103}
                    width={1000}
                    className="object-cover h-[103px] w-auto"    
                />
                <Image
                    src="/images/sponsors/sponsor3.JPG"
                    alt="sponsor 3"
                    height={103}
                    width={1000}
                    className="object-cover h-[103px] w-auto"
                />
            </div>
        </Container>
    )
}

export default WhyUs;