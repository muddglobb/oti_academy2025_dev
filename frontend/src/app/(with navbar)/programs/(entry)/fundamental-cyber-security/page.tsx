import React from "react";
import EntryClassInfo from "@/components/programs/entry/entry-classinfo";
import Hero from "@/components/programs/intermediate/intermediate-hero";
import SessionInfo from "@/components/programs/intermediate/intermediate-session-info";

const hero: [string, string, string] = [
  "Fundamental Cybersecurity",
  "Masuki dunia cybersecurity dengan materi praktis dan menyenangkan, mulai dari Linux, forensik, web exploitation, kriptografi, hingga OSINT. Ditutup dengan praktik langsung lewat picoCTF. Materi ringkas dan mudah dipahami, cocok untuk pemula.",
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
  "30 Juni – 15 Juli 2025",
  "8 Sesi",
  "2 Jam/Sesi",
  "6 Modul",
  "Ahsan Zaki",
  "/images/foto-orang/ahsan.webp",
  "Mahasiswa Ilmu Komputer UGM yang antusias di bidang cybersecurity. Telah menyelesaikan Google Cybersecurity Certificate dan terus belajar hal baru di dunia teknologi. Di kelas ini, dia siap jadi teaching assistant yang bisa diandalkan.",
  "https://www.linkedin.com/in/ahsan-wiryawan-35924b326/",
];
const sessions: [string, string, string, string][] = [
  [
    "Grand Launching",
    "30 Juni 2025",
    "To be announced",
    "",
  ],
  [
    "Mengenal Dasar Linux dan Terminal",
    "30 Juni 2025",
    "19.00 – 21.00 WIB",
    "Dalam sesi ini, kamu akan mempelajari perintah dasar Linux seperti ls, cd, cat, serta cara berpindah direktori dan menggunakan man untuk dokumentasi. Sesi ini akan membantumu memahami cara navigasi dan eksplorasi lewat terminal.",
  ],
  [
    "Dasar Digital Forensics",
    "2 Juli 2025",
    "19.00 – 21.00 WIB",
    "Masuki dunia forensik digital dengan menguasai teknik-teknik dasar yang penting untuk mengungkap informasi tersembunyi. Dalam sesi ini, kamu akan belajar menggunakan perintah Linux seperti strings dan exiftool untuk mengekstrak data dari file, memahami berbagai format file populer, serta melakukan analisis jaringan dengan Wireshark. Selain itu, kamu akan mengenal konsep steganografi yang sering dipakai untuk menyembunyikan pesan rahasia.",
  ],
  [
    "Mempelajari Fundamental dari Web Exploitation",
    "5 Juli 2025",
    "19.00 – 21.00 WIB",
    "Pelajari teknik dasar eksploitasi web yang sering digunakan dalam pengujian keamanan aplikasi modern. Dalam sesi ini, kamu akan memahami cara kerja alat powerful seperti Burp Suite, mengenali celah seperti XSS (Cross-Site Scripting), hingga mengeksplorasi risiko pada fitur upload file. Latihan juga didukung langsung dengan platform PortSwigger, jadi kamu bisa belajar sambil praktik dan memahami pola serangan nyata yang sering terjadi di industri.",
  ],
  [
    "Dasar-dasar Cryptography",
    "7 Juli 2025",
    "19.00 – 21.00 WIB",
    "Dalam sesi ini, kamu akan membahas konsep dasar kriptografi, termasuk perbedaan antara enkripsi simetris dan asimetris. Kamu juga akan berlatih menyelesaikan tantangan di platform Cryptohack untuk memahami bagaimana teknik kriptografi digunakan dalam keamanan data secara nyata.",
  ],
  [
    "Pengenalan OSINT dan Web Scraping",
    "10 Juli 2025",
    "19.00 – 21.00 WIB",
    "Kamu akan mempelajari dasar-dasar OSINT (Open Source Intelligence), yaitu teknik pengumpulan informasi dari sumber terbuka yang dapat diakses publik. Kamu akan mempelajari berbagai alat OSINT yang digunakan untuk menggali data dari internet secara efektif, serta memahami dasar-dasar web scraping untuk mengekstrak data dari situs web secara otomatis.",
  ],
  [
    "CTF Practice dan Persiapan Final Project",
    "13 Juli 2025",
    "19.00 – 21.00 WIB",
    "Di sesi ini, kamu akan mengenal lebih dekat tentang CTF (Capture The Flag), alur kerjanya, dan bagaimana cara berkompetisi di dalamnya. Kamu juga akan berlatih langsung dengan picoCTF untuk mengasah keterampilan hacking dan pemecahan masalah. Di akhir sesi, final project akan diumumkan, memberikan kesempatan untuk mengaplikasikan semua yang telah dipelajari dalam proyek nyata.",
  ],
  [
    "Sesi Konsultasi",
    "15 Juli 2025",
    "13.00 – 15.00 WIB",
    "Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari siang hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.",
  ],
];
const FundamentalCyberSecurity = () => {
  return (
    <div className="flex flex-col items-center">
      <Hero hero={hero} />
      <EntryClassInfo classInfo={classInfo} />
      <SessionInfo sessions={sessions} />
    </div>
  );
};

export default FundamentalCyberSecurity;
