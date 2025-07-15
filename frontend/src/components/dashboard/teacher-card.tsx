import React from "react";
import Image from "next/image";
import Link from "next/link";

type TeacherCardProps = {
  courseTitle: string;
};

const teacherCardData: Record<
  string,
  Array<[string, string, string, string, string]>
> = {
  "Web Development": [
    [
      "Rayhan Firdaus Ardian",
      "Teaching Assistant",
      "/images/foto-orang/rehund.webp",
      "https://www.linkedin.com/in/rayhan-ardian-270705-rehund/",
      "Mahasiswa Ilmu Komputer UGM tahun kedua, berpengalaman di web development dan aktif mengerjakan proyek-proyek aplikasi web modern.",
    ],
  ],
  "Basic Python": [
    [
      "Daffa Aryza Pasya",
      "Teaching Assistant",
      "/images/foto-orang/daffa.webp",
      "https://www.linkedin.com/in/daffa-ap/",
      "Mahasiswa Ilkom UGM tahun pertama, antusias coding Python, C++, JavaScript. Finalis Data Royale 2024, siap membimbing dengan cara santai dan mudah.",
    ],
  ],
  "Fundamental Cyber Security": [
    [
      "Muhammad Ahsan Zaki Wiryawan",
      "Teaching Assistant",
      "/images/foto-orang/ahsan.webp",
      "https://www.linkedin.com/in/ahsan-wiryawan-35924b326/",
      "Mahasiswa Ilmu Komputer UGM yang antusias di bidang cybersecurity. Telah menyelesaikan Google Cybersecurity Certificate dan siap jadi teaching assistant andal di kelas ini.",
    ],
  ],
  "Game Development": [
    [
      "Thomas Nadandra Aryawida",
      "Teaching Assistant",
      "/images/foto-orang/thomas.webp",
      "",
      "Mahasiswa tahun pertama Ilmu Komputer UGM dengan minat besar dalam game development. Peraih Best Innovation di Yogyakarta Global Game Jam 2025, siap menjadi teaching assistant andal.",
    ],
  ],
  "Graphic Design": [
    [
      "Geraldine Hutagalung",
      "Teaching Assistant",
      "/images/foto-orang/geradline.webp",
      "",
      "Mahasiswa Ilmu Komputer UGM yang dikenal dengan karya-karya desain grafisnya yang kreatif dan standout. Aktif di berbagai proyek dan siap berbagi sebagai teaching assistant.",
    ],
  ],
  "Competitive Programming": [
    [
      "Revy Satya Gunawan",
      "Teaching Assistant",
      "/images/foto-orang/revy.webp",
      "",
      "Mahasiswa Ilmu Komputer UGM dan pemenang OSN Matematika 2023 yang aktif di dunia Competitive Programming. Siap jadi teaching assistant yang andal di kelas ini.",
    ],
  ],
  "Data Science & Artificial Intelligence": [
    [
      "Daffa Aryza Pasya",
      "Teaching Assistant",
      "/images/foto-orang/daffa.webp",
      "https://www.linkedin.com/in/daffa-ap/",
      "Mahasiswa Ilkom UGM tahun pertama, antusias coding Python, C++, JavaScript. Finalis Data Royale 2024, siap membimbing dengan cara santai dan mudah.",
    ],
  ],
  "UI/UX": [
    [
      "Louis Yasmin",
      "Mentor",
      "/images/foto-orang/mentor-uiux.webp",
      "",
      "Solution Architect at iSystem Asia.",
    ],
    [
      "Ken Bima Satria Gandasasmita",
      "Teaching Assistant",
      "/images/foto-orang/ken-bima.webp",
      "https://www.linkedin.com/in/kenbimasatriagandasasmita/",
      "-",
    ],
  ],
  "Software Engineering": [
    [
      "Rifqi Afwan Muslihani",
      "Mentor",
      "/images/foto-orang/mentor-softeng.webp",
      "",
      "Backend Developer at PT Bank Mandiri tbk.",
    ],
    [
      "Rayhan Firdaus Ardian",
      "Teaching Assistant",
      "/images/foto-orang/rehund.webp",
      "https://www.linkedin.com/in/rayhan-ardian-270705-rehund/",
      "Mahasiswa Ilmu Komputer UGM tahun kedua, berpengalaman di web development dan aktif mengerjakan proyek-proyek aplikasi web modern.",
    ],
  ],
  "Cyber Security": [
    ["Hernowo Adi Nugroho", "Mentor", "/images/foto-orang/mentor-cysec.webp", "", "Penetration Tester"],
    [
      "Muhammad Ahsan Zaki Wiryawan",
      "Teaching Assistant",
      "/images/foto-orang/ahsan.webp",
      "https://www.linkedin.com/in/ahsan-wiryawan-35924b326/",
      "Mahasiswa Ilmu Komputer UGM yang antusias di bidang cybersecurity. Telah menyelesaikan Google Cybersecurity Certificate dan siap jadi teaching assistant andal di kelas ini.",
    ],
  ],
  "Mentor Card": [
    ["TBA", "Mentor", "/images/foto-orang/mentor-tba-2.webp", "", "-"],
  ],
  "Graphic Design + UI/UX": [
    [
      "Geraldine Hutagalung",
      "Teaching Assistant",
      "/images/foto-orang/geradline.webp",
      "",
      "Mahasiswa Ilmu Komputer UGM yang dikenal dengan karya-karya desain grafisnya yang kreatif dan standout. Aktif di berbagai proyek dan siap berbagi sebagai teaching assistant.",
    ],
    [
      "Ken Bima Satria Gandasasmita",
      "Teaching Assistant",
      "/images/foto-orang/ken-bima.webp",
      "https://www.linkedin.com/in/kenbimasatriagandasasmita/",
      "-",
    ],
  ],
  "Mentor UI/UX": [
    [
      "Louis Yasmin",
      "Mentor",
      "/images/foto-orang/mentor-uiux.webp",
      "",
      "Solution Architect at iSystem Asia.",
    ],
  ],
  "Mentor DSAI": [
    [
      "Ach Rozikin",
      "Mentor",
      "/images/foto-orang/mentor-dsai-1.webp",
      "",
      "Senior VP of Engineering and Founding Team of Sarana AI.",
    ],
    [
      "Ilham Bachtiar Irfani",
      "Mentor",
      "/images/foto-orang/mentor-dsai-2.webp",
      "",
      "Senior AI Engineer and Founding Team of Sarana AI.",
    ],
  ],
};
const TeacherCard = ({ courseTitle }: TeacherCardProps) => {
  const teachers = teacherCardData[courseTitle] || [];

  return (
    <div className=" border-solid border-2 border-neutral-500 rounded-[20px] p-5">
      <p className="font-bold text-lg text-neutral-50 border-b-2 border-neutral-500 pb-2 mx-2">
        Mentor & Teaching Assistant
      </p>
      <div className="flex flex-col xl:flex-row gap-15 mt-2 items-stretch">
        {teachers.map(([name, role, imageUrl, linkedin, desc], index) =>
          name === "TBA" ? (
            <div
              className={`${teachers.length === 2 ? "lg:w-1/2" : "w-full"}`}
              key={index}
            >
              <div className="w-full max-sm:min-w-68 flex flex-row gap-4 bg-neutral-900 border-2 border-neutral-500 text-neutral-50 rounded-[10px] min-h-34 h-full">
                <div
                  className="w-34 bg-cover bg-center bg-no-repeat flex rounded-l-[10px] mask-r-from-60%"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    position: "relative",
                  }}
                >
                  {linkedin !== "" && (
                    <div className="bg-neutral-200 w-7.5 h-7.5 flex justify-center items-center rounded-[5px] absolute bottom-2 right-2">
                      <Link href={linkedin}>
                        <Image
                          src="/icons/linkedin-icon.svg"
                          alt="linkedin"
                          width={20}
                          height={20}
                        ></Image>
                      </Link>
                    </div>
                  )}
                </div>
                <div className="w-full py-2 md:py-5 px-2">
                  <p className="text-sm font-bold">
                    {name} | {role}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      background:
                        "linear-gradient(180deg, #F8F9FF 0%, #959599 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                    }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`${teachers.length === 2 ? "lg:w-1/2" : "w-full"}`}
              key={index}
            >
              <div className="w-full max-sm:min-w-68 flex flex-row gap-4 bg-neutral-50 text-neutral-900 rounded-[10px] min-h-34 h-full">
                <div
                  className="w-34 bg-cover bg-center bg-no-repeat flex rounded-l-[10px]"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    position: "relative",
                  }}
                >
                  {linkedin !== "" && (
                    <div className="bg-neutral-200 w-7.5 h-7.5 flex justify-center items-center rounded-[5px] absolute bottom-2 right-2">
                      <Link href={linkedin}>
                        <Image
                          src="/icons/linkedin-icon.svg"
                          alt="linkedin"
                          width={20}
                          height={20}
                        ></Image>
                      </Link>
                    </div>
                  )}
                </div>
                <div className="w-full py-2 md:py-5 px-2">
                  <p className="text-sm font-bold">
                    {name} | {role}
                  </p>
                  <p className="text-xs">{desc}</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TeacherCard;
