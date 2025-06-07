import React from "react";
import EntryClassInfo from "@/components/programs/entry/entry-classinfo";
import Hero from "@/components/programs/intermediate/intermediate-hero";
import SessionInfo from "@/components/programs/intermediate/intermediate-session-info";

const hero: [string, string, string] = [
  "CyberSecurity",
  "Masuki dunia ethical hacking dan praktik langsung tahapan penetration testing, dari reconnaissance hingga post-exploitation, lengkap dengan penyusunan laporan uji keamanan secara profesional.",
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
  "1 - X Juli 2025",
  "8 Sesi",
  "2 Jam/Sesi",
  "5 Modul",
  "Rayhan Firdaus Ardian",
  "/person-placeholder.jpeg",
  "Mahasiswa Ilmu Komputer UGM tahun kedua yang fokus di web development. Siap membimbing dengan cara yang santai dan mudah dipahami, khususnya untuk pemula di dunia web.",
  "https://www.linkedin.com",
];
const sessions: [string, string, string, string][] = [
  [
    "Grand Launching",
    "30 Juni 2025",
    "XX.00 – XX.00 WIB",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis?",
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
];
const WebDevelopment = () => {
  return (
    <div className="flex flex-col items-center">
      <Hero hero={hero} />
      <EntryClassInfo classInfo={classInfo} />
      <SessionInfo sessions={sessions} />
    </div>
  );
};

export default WebDevelopment;
