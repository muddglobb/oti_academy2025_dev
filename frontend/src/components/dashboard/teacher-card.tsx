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
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "Mahasiswa Ilmu Komputer UGM tahun kedua yang fokus di web development. Siap membimbing dengan cara yang santai dan mudah dipahami, khususnya untuk pemula di dunia web.",
    ],
  ],
  "Basic Python": [
    [
      "Daffa Aryza Pasya",
      "Teaching Assistant",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "Mahasiswa tahun pertama Ilmu Komputer UGM yang antusias di dunia coding, khususnya Python, C++, dan JavaScript. Finalis Data Royale Competition 2024 ini siap membimbing kamu dengan cara yang santai dan mudah dipahami.",
    ],
  ],
  "Fundamental Cyber Security": [
    [
      "Muhammad Ahsan Zaki Wiryawan",
      "Teaching Assistant",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "Mahasiswa Ilmu Komputer UGM yang antusias di bidang cybersecurity. Telah menyelesaikan Google Cybersecurity Certificate dan terus belajar hal baru di dunia teknologi. Di kelas ini, dia siap jadi teaching assistant yang bisa diandalkan.",
    ],
  ],
  "Game Development": [
    [
      "Thomas Nadandra Aryawida",
      "Teaching Assistant",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "Mahasiswa tahun pertama Ilmu Komputer UGM dengan minat besar dalam game development. Peraih Best Innovation di Yogyakarta Global Game Jam 2025, siap menjadi teaching assistant yang bisa diandalkan di kelas ini.",
    ],
  ],
  "Graphic Design": [
    [
      "Geraldine Hutagalung",
      "Teaching Assistant",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "Seorang mahasiswa Ilmu Komputer UGM yang dikenal dengan karya-karya desain grafisnya yang kreatif dan standout. Aktif di berbagai proyek, ia siap berbagi wawasan visual sebagai teaching assistant di kelas ini.",
    ],
  ],
  "Competitive Programming": [
    [
      "Revy Satya Gunawan",
      "Teaching Assistant",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "-",
    ],
  ],
  "Data Science & Artificial Intelligence": [
    [
      "XX",
      "Mentor",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "-",
    ],
    [
      "Daffa Aryza Pasya",
      "Teaching Assistant",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "Mahasiswa tahun pertama Ilmu Komputer UGM yang antusias di dunia coding, khususnya Python, C++, dan JavaScript. Finalis Data Royale Competition 2024 ini siap membimbing kamu dengan cara yang santai dan mudah dipahami.",
    ],
  ],
  "UI/UX": [
    [
      "XX",
      "Mentor",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "-",
    ],
    [
      "Ken Bima Satria Gandasasmita",
      "Teaching Assistant",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "-",
    ],
  ],
  "Software Engineering": [
    [
      "XX",
      "Mentor",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "-",
    ],
    [
      "Rayhan Firdaus Ardian",
      "Teaching Assistant",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "Mahasiswa Ilmu Komputer UGM tahun kedua yang fokus di web development. Siap membimbing dengan cara yang santai dan mudah dipahami, khususnya untuk pemula di dunia web.",
    ],
  ],
  "Cyber Security": [
    [
      "XX",
      "Mentor",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "-",
    ],
    [
      "Muhammad Ahsan Zaki Wiryawan",
      "Teaching Assistant",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "Mahasiswa Ilmu Komputer UGM yang antusias di bidang cybersecurity. Telah menyelesaikan Google Cybersecurity Certificate dan terus belajar hal baru di dunia teknologi. Di kelas ini, dia siap jadi teaching assistant yang bisa diandalkan.",
    ],
  ],
  Mentor: [
    [
      "XX",
      "Mentor",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "-",
    ],
  ],
};
const TeacherCard = ({ courseTitle }: TeacherCardProps) => {
  const teachers = teacherCardData[courseTitle] || [];

  return (
    <div className=" border-solid border-2 border-neutral-500 rounded-[20px] p-5">
      <p className="font-bold text-lg text-neutral-50 border-b-2 border-neutral-500 pb-2 mx-2">
        Teaching Assistant & Mentor
      </p>
      <div className="flex flex-col xl:flex-row gap-15 mt-2 items-stretch">
        {teachers.map(([name, role, imageUrl, linkedin, desc], index) => (
          <div
            className={`${teachers.length === 2 ? "w-1/2" : ""}`}
            key={index}
          >
            <div className="w-full min-w-89 flex flex-row gap-4 bg-neutral-50 text-neutral-900 rounded-[10px] min-h-34 h-full">
              <div
                className="w-34 bg-cover bg-center bg-no-repeat flex rounded-l-[10px]"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  position: "relative",
                }}
              >
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
              </div>
              <div className="w-full py-2 md:py-5 px-2">
                <p className="text-sm font-bold">
                  {name} | {role}
                </p>
                <p className="text-xs">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherCard;
