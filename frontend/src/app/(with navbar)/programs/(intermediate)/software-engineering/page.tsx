import React from "react";
import IntermediateHero from "@/components/programs/intermediate/intermediate-hero";
import IntermediateClassInfo from "@/components/programs/intermediate/intermediate-class-info";
import IntermediateSessionInfo from "@/components/programs/intermediate/intermediate-session-info";

const hero: [string, string, string] = [
  "Software Engineering",
  "Kuasai pembuatan aplikasi web modern lengkap dari autentikasi hingga fitur CRUD lewat praktik langsung dan studi kasus nyata. Jadi developer full-stack handal dengan pengalaman yang keren.",
  "Intermediate Level",
];
const classInfo: [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
] = [
  "TBA",
  "/person-placeholder.jpeg",
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?",
  "https://www.linkedin.com/in/dhimas-sulistio/",

  "Rayhan Firdaus Ardian",
  "/images/foto-orang/rehund.webp",
  "Mahasiswa Ilmu Komputer UGM tahun kedua yang fokus di web development. Siap membimbing dengan cara yang santai dan mudah dipahami, khususnya untuk pemula di dunia web.",
  "https://www.linkedin.com/in/dhimas-sulistio/",

  "30 Juni & 16 Juli – 26 Juli 2025",
  "8 Sesi",
  "2 Jam/Sesi",
  "6 Modul",
  "Memiliki prasyarat",
];
const sessions: [string, string, string, string][] = [
  [
    "Grand Launching",
    "30 Juni 2025",
    "XX.00 – XX.00 WIB",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis?",
  ],
  [
    "Pengenalan Tech Stack",
    "16 Juli 2025",
    "14.00 – 15.00 WIB | 1 Jam",
    "Di sesi ini, kamu akan diajak mengenal teknologi-teknologi keren yang jadi tulang punggung proyek, mulai dari Next.js hingga Prisma dan Tailwind CSS. Kamu akan memahami peran penting masing-masing tools, alasan kenapa mereka dipilih, serta bagaimana semuanya bersinergi untuk menciptakan produk yang solid dan efisien. Plus, ada diskusi interaktif dan sesi tanya jawab seru untuk menggali lebih dalam.",
  ],
  [
    "Memahami React Hooks dan Pengelolaan Data",
    "17 Juli 2025",
    "14.00 – 16.00 WIB | 2 Jam",
    "Masuk ke inti React dengan menguasai lifecycle dan Hooks yang jadi kunci bikin aplikasi kamu hidup dan responsif. Di sesi ini, kamu bakal belajar cara pakai useState, useEffect, dan teknik pengelolaan data asinkron yang membuat aplikasi mampu menangani perubahan secara real-time. Semua disajikan dengan praktik seru yang langsung bisa kamu terapkan untuk membuat aplikasi lebih dinamis dan interaktif.",
  ],
  [
    "Mendalami Arsitektur Next.js: Routing, API, dan Middleware",
    "18 Juli 2025",
    "14.00 – 16.00 WIB | 2 Jam",
    "Sesi ini membawa kamu menjelajahi struktur folder dan sistem routing di Next.js yang powerful dan fleksibel. Kamu akan mempelajari cara membuat API Routes untuk backend ringan, memahami peran Middleware dalam mengelola request, serta menguasai Dynamic Routes untuk membangun aplikasi yang dinamis.",
  ],
  [
    "Kode Cerdas dengan TypeScript",
    "19 Juli 2025",
    "14.00 – 15.30 WIB | 1.5 Jam",
    "Kuak rahasia membuat kode lebih kuat, rapi, dan bebas bug dengan TypeScript yang semakin populer di kalangan developer profesional! Di sesi ini, kamu akan diajak memahami konsep dasar seperti type inference, type aliases, interface, narrowing, dan type assertion dengan cara yang mudah dan aplikatif.",
  ],
  [
    "Rahasia Autentikasi Mulus untuk Aplikasi Next.js",
    "22 Juli 2025",
    "14.00 – 15.00 WIB | 1 Jam",
    "Bangun sistem autentikasi canggih dan seamless yang siap melindungi aplikasi kamu. Di sesi ini, kamu akan belajar langkah demi langkah membuat halaman login dan registrasi menggunakan Clerk atau Kinde di Next.js, lalu mengintegrasikannya dengan mulus ke dalam aplikasi.",
  ],
  [
    "Membangun Fondasi Data Kuat dengan Prisma",
    "23 Juli 2025",
    "14.00 – 16.00 WIB | 2 Jam",
    "Bangun pondasi aplikasi yang tangguh melalui penguasaan Prisma ORM. Di sesi ini, kamu akan belajar mengatur database dari awal, membuat schema, menjalankan migrasi, dan melakukan operasi CRUD secara efisien. Kamu juga akan mengintegrasikan Prisma dengan API Route Handlers untuk membangun endpoint CRUD Notes.",
  ],
  [
    "Mentoring Final Project",
    "26 Juli 2025",
    "10.00 – 16.00 WIB | 2 Jam",
    "Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari pagi hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.",
  ],
];

const SoftwareEngineering = () => {
  return (
    <div
      className="     
      relative 
      overflow-x-hidden
      "
    >
      <div className="relative overflow-x-hidden">
        <IntermediateHero hero={hero} />
        <IntermediateClassInfo classInfo={classInfo} />
        <IntermediateSessionInfo sessions={sessions} />
      </div>
    </div>
  );
};

export default SoftwareEngineering;
