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
      "Mahasiswa Ilmu Komputer UGM tahun kedua, berpengalaman di web development dan aktif mengerjakan proyek-proyek aplikasi web modern.",
    ],
  ],
  "Basic Python": [
    [
      "Daffa Aryza Pasya",
      "Teaching Assistant",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "Mahasiswa Ilkom UGM tahun pertama, antusias coding Python, C++, JavaScript. Finalis Data Royale 2024, siap membimbing dengan cara santai dan mudah.",
    ],
  ],
  "Fundamental Cyber Security": [
    [
      "Muhammad Ahsan Zaki Wiryawan",
      "Teaching Assistant",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "Mahasiswa Ilmu Komputer UGM yang antusias di bidang cybersecurity. Telah menyelesaikan Google Cybersecurity Certificate dan siap jadi teaching assistant andal di kelas ini.",
    ],
  ],
  "Game Development": [
    [
      "Thomas Nadandra Aryawida",
      "Teaching Assistant",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "Mahasiswa tahun pertama Ilmu Komputer UGM dengan minat besar dalam game development. Peraih Best Innovation di Yogyakarta Global Game Jam 2025, siap menjadi teaching assistant andal.",
    ],
  ],
  "Graphic Design": [
    [
      "Geraldine Hutagalung",
      "Teaching Assistant",
      "/person-placeholder.jpeg",
      "https://www.linkedin.com/",
      "Mahasiswa Ilmu Komputer UGM yang dikenal dengan karya-karya desain grafisnya yang kreatif dan standout. Aktif di berbagai proyek dan siap berbagi sebagai teaching assistant.",
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
      "Mahasiswa Ilkom UGM tahun pertama, antusias coding Python, C++, JavaScript. Finalis Data Royale 2024, siap membimbing dengan cara santai dan mudah.",
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
      "Mahasiswa Ilmu Komputer UGM tahun kedua, berpengalaman di web development dan aktif mengerjakan proyek-proyek aplikasi web modern.",
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
      "Mahasiswa Ilmu Komputer UGM yang antusias di bidang cybersecurity. Telah menyelesaikan Google Cybersecurity Certificate dan siap jadi teaching assistant andal di kelas ini.",
    ],
  ],
  "Mentor Card": [
    [
      "Mentor ",
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
