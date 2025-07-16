import Container from "@/components/container";
import LandingPageMentorCard from "@/components/landing-page-mentor";
import Image from "next/image";


const MentorContent = [
    {
        nama: "Rifqi Afwan M.",
        job: "Software Engineering Mentor",
        linkedin: "https://www.linkedin.com/in/rifqiafwan/",
        pic: "/images/teacher/softeng.webp",
        desc: "Backend Developer at PT Bank Mandiri tbk"
    },
    {
        nama: "Ilham Bachtiar I.",
        job: "DSAI Mentor",
        linkedin: "https://www.linkedin.com/in/ilham-bachtiar-irfani/",
        pic: "/images/teacher/dsai1.webp",
        desc: "Senior AI Engineer and Founding Team of Sarana AI"
    },
    {
        nama: "Ach Rozikin",
        job: "DSAI Mentor",
        linkedin: "https://www.linkedin.com/in/achmad-rozikin/",
        pic: "/images/teacher/dsai2.webp",
        desc: "Senior VP of Engineering and Founding Team of Sarana AI"
    },
    {
        nama: "Louis Yasmin",
        job: "UI/UX Mentor",
        linkedin: "https://www.linkedin.com/in/louis-yasmin/",
        pic: "/images/teacher/uiux.webp",
        desc: "Solution Architect at iSystem Asia"
    },
    {
        nama: "Hernowo Adi N.",
        job: "Cyber Security Mentor",
        linkedin: "https://www.linkedin.com/in/hernowoadin/",
        pic: "/images/teacher/cysec.webp",
        desc: "Penetration Tester"
    }
]

// type MentorCardProps = {
//     name: string;
//     role: string;
//     linkedin: string;
//     imageUrl: string;
//     description: string;
//   };

const Mentor = () => {
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
                <div className="flex flex-col gap-2">
                    <h1 className="pt-10 lg:w-full text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 text-center text-[22px] lg:text-[32px] font-bold">Kenali Para Mentor Inspiratif yang Akan Mendampingimu</h1>
                    <p className="pt-2 lg:px-24 px-9 text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[12px] sm:text-[18px] pb-10">
                        Mereka datang dari berbagai <span className="font-bold"> bidang industri</span>, siap berbagi ilmu dan pengalaman langsung dari dunia nyata. Khusus di <span className="font-bold"> Kelas Intermediate</span>, para mentor ini akan jadi pembimbing kamu untuk naik level dengan<span className="font-bold"> wawasan yang praktis dan relevan</span>!
                    </p>
                </div>
                <div className="flex lg:flex-row flex-col justify-center gap-5 pb-40">
                    {MentorContent.map((mentor, index) => (
                            <LandingPageMentorCard
                                key={index}
                                name={mentor.nama}
                                job={mentor.job}
                                pic={mentor.pic}
                                desc={mentor.desc}
                                linkedin={mentor.linkedin}
                            />
                    ))}
                </div>
            </div>
        </Container>
    )
}

export default Mentor;