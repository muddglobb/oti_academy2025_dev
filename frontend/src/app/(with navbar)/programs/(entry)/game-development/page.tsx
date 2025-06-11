import React from "react";
import EntryClassInfo from "@/components/programs/entry/entry-classinfo";
import Hero from "@/components/programs/intermediate/intermediate-hero";
import SessionInfo from "@/components/programs/intermediate/intermediate-session-info";

const hero: [string, string, string] = [
  "Game Development",
  "Menjelajahi dunia game development dari merancang ide, Game Design Document (GDD), hingga membangun prototype game dengan GDevelop. Materi lengkap dan mudah diikuti, cocok untuk pemula.",
  "Beginner Level",
];
const classInfo: [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
] = [
  "30 Juni – 11 Juli 2025",
  "6 Sesi",
  "2 Jam/Sesi",
  "5 Modul",
  "Thomas Nadandra",
  "/images/foto-orang/thomas.webp",
  "Mahasiswa tahun pertama Ilmu Komputer UGM dengan minat besar dalam game development. Peraih Best Innovation di Yogyakarta Global Game Jam 2025, siap menjadi teaching assistant yang bisa diandalkan di kelas ini.",
  "",
];
const sessions: [string, string, string, string][] = [
  [
    "Grand Launching",
    "30 Juni 2025",
    "To be announced",
    "",
  ],
  [
    "Mengenal Dasar Game Development dan Game Design",
    "30 Juni 2025",
    "14.00 – 16.00 WIB | 2 Jam",
    "Mulai petualanganmu di dunia game dengan memahami rahasia di balik desain game. Dalam sesi ini, kamu akan belajar bagaimana game dibangun dari konsep hingga jadi pengalaman interaktif yang seru dan memikat. Kamu juga akan diajak untuk menuangkan semua ide kreatifmu ke dalam Game Design Document (GDD), yaitu panduan wajib sebelum coding dimulai.",
  ],
  [
    "Pengenalan MDA Framework",
    "1 Juli 2025",
    "14.00 – 16.00 WIB | 2 Jam",
    "Sesi ini membahas MDA Framework (Mechanics, Dynamics, Aesthetics) sebagai pendekatan untuk merancang pengalaman bermain yang menarik. Kamu akan belajar bagaimana framework ini membantu menyusun desain game yang lebih terarah dan efektif. Sebagai latihan, kamu akan membuat Game Design Document (GDD) dengan mengacu pada konsep MDA.",
  ],
  [
    "GDevelop dan Pembuatan Game Dasar",
    "3 Juli 2025",
    "14.00 – 16.00 WIB | 2 Jam",
    "Dalam sesi ini, kamu akan dikenalkan pada GDevelop yaitu software no-code untuk membuat game 2D. Kamu akan belajar membuat elemen dasar seperti event, movement, sprites, tiles, UI, dan object, serta langsung mempraktekkannya lewat tugas pembuatan Game Prototype I. Sesi ini dirancang agar kamu bisa mulai membangun game pertamamu dengan langkah-langkah yang mudah dipahami.",
  ],
  [
    "Pendalaman Sistem Event di GDevelop",
    "4 Juli 2025",
    "14.00 – 16.00 WIB | 2 Jam",
    "Sesi ini akan mengajak kamu memahami lebih dalam bagaimana sistem event di GDevelop bekerja. Fokus utama mencakup pengelolaan waktu, perubahan state objek, dan penerapan physics untuk menciptakan interaksi yang lebih realistis dan dinamis dalam game. Pemahaman ini akan membantumu menyusun logika game yang lebih kompleks dan responsif.",
  ],
  [
    "Persiapan GameJam",
    "5 Juli 2025",
    "14.00 – 16.00 WIB | 2 Jam",
    "Kenali konsep GameJam sebagai ajang kolaboratif untuk menciptakan game dalam waktu terbatas. Kamu akan memahami alur dan timeline GameJam. Kamu akan mempelajari bagaimana alur kerja dalam GameJam. Sesi ini juga akan membahas roadmap dan timeline GameJam. Di akhir sesi, Final Project akan diumumkan sebagai tantangan utama untuk menerapkan seluruh kemampuan yang telah kamu pelajari.",
  ],
  [
    "Sesi Konsultasi",
    "9 & 11 Juli 2025",
    "15.00 – 17.00 WIB | 2 Jam",
    "Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari pagi hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.",
  ],
];
const GameDevelopment = () => {
  return (
    <div className="flex flex-col items-center">
      <Hero hero={hero} />
      <EntryClassInfo classInfo={classInfo} />
      <SessionInfo sessions={sessions} />
    </div>
  );
};

export default GameDevelopment;
