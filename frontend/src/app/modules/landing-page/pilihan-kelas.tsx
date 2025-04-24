import Container from "@/components/container";
import Image from "next/image";
import Card from "@/components/card";

const PilihanKelas =() => {
    return (
        <Container className="items-center">
            <div className="flex flex-col ">   
                <h1 className="leading-[69px] text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-4xl lg:text-[2rem] font-bold">
                    Pilihan Kelas untuk Semua Tingkatan
                </h1>
                <p className="px-[235px] text-neutral-50 text-center text-[14px] lg:text-[18px]">
                    Online program ini mencakup <span className="font-bold">6 kelas untuk pemula</span> yang dirancang membangun pemahaman dasar IT dari <span className="font-bold">nol</span>, serta <span>4 kelas intermediate</span> untuk peserta yang ingin <span className="font-bold">mendalami keterampilan lebih lanjut</span>. Kelas berlangsung dari <span className="font-bold">1 Juni hingga 30 Juni 2025</span> dengan materi yang terstruktur dan mudah diikuti.
                </p>
            </div>

            <div className="flex flex-row w-[1327px] justify-between pt-[45px]">
                <Card
                    type="Beginner"
                    image="/images/class-profile/hako.jpg"
                    teacher1="/images/teacher/faris.jpg"
                    title="Web Development"
                    href="https://www.youtube.com/watch?v=chWiR1H_6AY"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporut labore..."
                />
                <Card
                    type="Beginner"
                    image="/images/class-profile/hako.jpg"
                    teacher1="/images/teacher/faris.jpg"
                    title="Web Development"
                    href="https://www.youtube.com/watch?v=chWiR1H_6AY"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporut labore..."
                />
                <Card
                    type="Intermediate"
                    image="/images/class-profile/hako.jpg"
                    teacher1="/images/teacher/faris.jpg"
                    teacher2="/images/teacher/faris.jpg"
                    title="Web Development"
                    href="https://www.youtube.com/watch?v=chWiR1H_6AY"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporut labore..."
                />
                <Card
                    type="Intermediate"
                    image="/images/class-profile/hako.jpg"
                    teacher1="/images/teacher/faris.jpg"
                    teacher2="/images/teacher/faris.jpg"
                    title="Web Development"
                    href="https://www.youtube.com/watch?v=chWiR1H_6AY"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporut labore..."
                />
            </div>
        </Container>
    )
}

export default PilihanKelas;