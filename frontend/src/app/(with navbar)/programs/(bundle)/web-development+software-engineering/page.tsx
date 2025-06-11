import React from "react";
import BundleClassInfo from "@/components/programs/bundle/bundle-classinfo";
import Hero from "@/components/programs/intermediate/intermediate-hero";
import SessionInfo from "@/components/programs/intermediate/intermediate-session-info";

const hero: [string, string, string] = [
  "Web Development + Software Engineering",
  "Kuasai UI & web app modern dari basic hingga intermediate dengan React, Tailwind, dan MUI. Praktik bikin halaman responsif, autentikasi, dan fitur CRUD.",
  "Bundle",
];
const sessions: [string, string, string, string][] = [
  [
    "Grand Launching",
    "30 Juni 2025",
    "XX.00 – XX.00 WIB",
    "",
  ],
  [
    "Web Dasar tentang Struktur & Styling",
    "1 Juli 2025",
    "14.00 – 16.00 WIB | 2 Jam",
    "Mulai perjalanan codingmu dengan memahami pondasi utama pembuatan halaman web. Dalam sesi ini, kamu akan belajar menyusun elemen-elemen penting HTML seperti header, section, dan footer, lalu membuat tampilan lebih menarik dengan sentuhan CSS. Tidak hanya teori, kamu juga langsung praktek lewat mini challenge seru dengan membuat layout profil sederhana. Cara terbaik untuk menguasai struktur dan styling web secara nyata dan menyenangkan.",
  ],
  [
    "Mempelajari Layouting dan Responsive Design",
    "2 Juli 2025",
    "14.00 – 16.00 WIB | 2 Jam",
    "Pelajari cara menyusun tampilan web yang rapi, fleksibel, dan nyaman dilihat di semua perangkat. Sesi ini dimulai dengan konsep dasar Box Model (margin, padding, dan border) lalu berlanjut ke Flexbox untuk membuat layout yang lebih dinamis dan terstruktur. Kamu juga akan belajar membuat desain responsif yang otomatis menyesuaikan tampilan, baik di laptop maupun smartphone.",
  ],
  [
    "Mengenal JavaScript Dasar",
    "3 Juli 2025",
    "Asinkronus",
    "Sesi ini mengenalkan dasar-dasar JavaScript yang jadi kunci membuat web interaktif. Kamu akan belajar variabel, tipe data, operator, function, conditional, dan loop. Lalu lanjut ke praktik manipulasi DOM untuk mengubah elemen di halaman. Melalui hands-on mini project, kamu akan membuat tombol interaktif sebagai latihan logika dan fungsionalitas.",
  ],
  [
    "Introduction to React.js",
    "6 Juli 2025",
    "14.00 – 16.00 WIB | 2 Jam",
    "Dalam sesi ini, kamu akan mulai membangun UI interaktif dengan React. Kita bahas konsep dasar seperti komponen, JSX, dan props, kemudian lanjut ke hooks seperti useState dan useEffect. Langsung praktik dengan membuat komponen kartu produk, lengkap dengan tombol interaktif yang bisa mengubah tampilannya secara real-time.",
  ],
  [
    "Mempelajari Styling Modern dengan Tailwind & Material UI",
    "7 Juli 2025",
    "14.00 – 16.00 WIB | 2 Jam",
    "Kenalan dengan dua pendekatan populer untuk mempercantik tampilan React-mu, yaitu Tailwind CSS dan Material UI. Kamu akan belajar cara menggunakan utility-first CSS di Tailwind, styling komponen dengan efisien, serta bagaimana melakukan setup dan eksplorasi komponen dari MUI. Lewat latihan langsung, kamu akan membangun dua versi kartu produk lalu membandingkan kelebihan dan kekurangannya secara langsung.",
  ],
  [
    "Live Coding Session",
    "10 Juli 2025",
    "14.00 – 16.00 WIB | 2 Jam",
    "Dalam sesi ini, kamu akan menggabungkan semua materi dari pertemuan sebelumnya dalam satu sesi live coding. Kita akan membangun satu halaman web lengkap dengan pendekatan modular menggunakan komponen. Sesi ini juga jadi pondasi untuk Final Project. Plus, dalam sesi ini akan ada pengumuman tema dan tantangan Final Project yang akan dikumpulkan nanti.",
  ],
  [
    "Sesi Konsultasi",
    "11 Juli 2025",
    "TBA",
    "Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari pagi hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.",
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
const bundle = () => {
  return (
    <>
      <div>
        <Hero hero={hero} />
        <BundleClassInfo
          date="16 Juli – 26 Juli 2025"
          sesi="7 Sesi"
          jam="2 Jam/Sesi"
          modul="6 Modul"
          mentor="TBA"
          mentorImage="/person-placeholder.jpeg"
          mentorDesc="To be announced"
          mentorLink="https://www.linkedin.com"
          TA="Rayhan Firdaus Ardian"
          TAImage="/images/foto-orang/rehund.webp"
          TADesc="Mahasiswa Ilmu Komputer UGM tahun kedua yang fokus di web development. Siap membimbing dengan cara yang santai dan mudah dipahami, khususnya untuk pemula di dunia web."
          TALink="https://www.linkedin.com/in/rayhan-ardian-270705-rehund/"
          title= ""
        ></BundleClassInfo>

        <SessionInfo sessions={sessions} />
      </div>
    </>
  );
};

export default bundle;
