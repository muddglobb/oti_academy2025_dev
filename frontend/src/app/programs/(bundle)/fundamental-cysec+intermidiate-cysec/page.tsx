import React from "react";
import BundleClassInfo from "@/components/bundle/bundle-classinfo";
import Hero from "@/components/intermediate/intermediate-hero";
// import BundleSessionInfo from "@/components/bundle/bundle-sessioninfo";
import SessionInfo from "@/components/intermediate/intermediate-session-info";

const hero: [string, string, string] = [
  "Web Development + Software Engineering",
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis? fjieofjiojwjefoiejwoi",
  "Bundle",
];
const sessions: [string, string, string, string][] = [
  ["Grand Launching", "30 Juni 2025", "XX.00 – XX.00 WIB", "XXX"],
  [
    "Mengenal Dasar Linux dan Terminal",
    "30 Juni 2025",
    "19.00 – 21.00 WIB | 2 Jam",
    "Dalam sesi ini, kamu akan mempelajari perintah dasar Linux seperti ls, cd, cat, serta cara berpindah direktori dan menggunakan man untuk dokumentasi. Sesi ini akan membantumu memahami cara navigasi dan eksplorasi lewat terminal.",
  ],
  [
    "Dasar Digital Forensics",
    "2 Juli 2025",
    "19.00 – 21.00 WIB | 2 Jam",
    "Masuki dunia forensik digital dengan menguasai teknik-teknik dasar yang penting untuk mengungkap informasi tersembunyi. Dalam sesi ini, kamu akan belajar menggunakan perintah Linux seperti strings dan exiftool untuk mengekstrak data dari file, memahami berbagai format file populer, serta melakukan analisis jaringan dengan Wireshark. Selain itu, kamu akan mengenal konsep steganografi yang sering dipakai untuk menyembunyikan pesan rahasia.",
  ],
  [
    "Mempelajari Fundamental dari Web Exploitation",
    "5 Juli 2025",
    "19.00 – 21.00 WIB | 2 Jam",
    "Pelajari teknik dasar eksploitasi web yang sering digunakan dalam pengujian keamanan aplikasi modern. Dalam sesi ini, kamu akan memahami cara kerja alat powerful seperti Burp Suite, mengenali celah seperti XSS (Cross-Site Scripting), hingga mengeksplorasi risiko pada fitur upload file. Latihan juga didukung langsung dengan platform PortSwigger, jadi kamu bisa belajar sambil praktik dan memahami pola serangan nyata yang sering terjadi di industri.",
  ],
  [
    "Dasar-dasar Cryptography",
    "7 Juli 2025",
    "19.00 – 21.00 WIB | 2 Jam",
    "Dalam sesi ini, kamu akan membahas konsep dasar kriptografi, termasuk perbedaan antara enkripsi simetris dan asimetris. Kamu juga akan berlatih menyelesaikan tantangan di platform Cryptohack untuk memahami bagaimana teknik kriptografi digunakan dalam keamanan data secara nyata.",
  ],
  [
    "Pengenalan OSINT dan Web Scraping",
    "10 Juli 2025",
    "19.00 – 21.00 WIB | 2 Jam",
    "Kamu akan mempelajari dasar-dasar OSINT (Open Source Intelligence), yaitu teknik pengumpulan informasi dari sumber terbuka yang dapat diakses publik. Kamu akan mempelajari berbagai alat OSINT yang digunakan untuk menggali data dari internet secara efektif, serta memahami dasar-dasar web scraping untuk mengekstrak data dari situs web secara otomatis.",
  ],
  [
    "CTF Practice dan Persiapan Final Project",
    "13 Juli 2025",
    " 19.00 – 21.00 WIB | 2 Jam",
    "Di sesi ini, kamu akan mengenal lebih dekat tentang CTF (Capture The Flag), alur kerjanya, dan bagaimana cara berkompetisi di dalamnya. Kamu juga akan berlatih langsung dengan picoCTF untuk mengasah keterampilan hacking dan pemecahan masalah. Di akhir sesi, final project akan diumumkan, memberikan kesempatan untuk mengaplikasikan semua yang telah dipelajari dalam proyek nyata.",
  ],
  [
    "Sesi Konsultasi",
    "15 Juli 2025",
    "13.00 – 15.00 WIB | 2 Jam",
    "Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari siang hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.",
  ],
  [
    "Pengenalan Penetration Testing dan Pre-Engagement",
    "16 Juli 2025",
    "13.00 – 15.00 WIB | 2 Jam",
    "Masuki dunia siber dari sisi penyerang dan pelajari bagaimana para ethical hacker merancang langkah demi langkah untuk menembus sistem secara legal. Sesi ini akan membekali kamu dengan dasar-dasar penetration testing, mulai dari rules of engagement, alur kerja pentest, hingga eksplorasi HackTheBox sebagai medan latihan digital. Kamu juga akan mengenal teknik OSINT untuk menggali informasi target secara strategis sebelum fase eksploitasi dimulai.",
  ],
  [
    "Menembus Permukaan, Seni Enumeration dalam Dunia Siber",
    "17 Juli 2025",
    "13.00 – 15.00 WIB | 2 Jam",
    "Langkah awal yang menentukan dalam ethical hacking dimulai dari seberapa dalam kamu bisa menggali informasi target. Di sesi ini, kamu akan mempelajari teknik enumerasi untuk mengungkap layanan tersembunyi dan celah potensial dalam sistem, khususnya pada SMB dan Windows. Kamu juga akan menggunakan tools andalan seperti smbclient, enum4linux, rpcclient, serta memahami kekuatan Nmap dalam pemindaian jaringan.",
  ],
  [
    "Identifikasi Kerentanan Sebelum Menyerang",
    "18 Juli 2025",
    "14.00 – 16.00 WIB | 2 Jam",
    "Di sesi ini, kamu akan diajak menyelami proses identifikasi kerentanan, mulai dari observasi manual tampilan web (web view analysis) untuk menangkap pola dan anomali, hingga penggunaan automated scanners yang mempercepat deteksi celah keamanan. Sesi ini akan melatih insting analisismu agar lebih tajam dalam membaca potensi eksploitasi di sistem target, kunci penting sebelum masuk ke fase serangan.",
  ],
  [
    "Metasploit dan Seni Menguasai Sistem",
    "23 Juli 2025",
    "13.00 – 15.00 WIB | 2 Jam",
    "Sesi ini membawa kamu langsung ke inti serangan dengan eksplorasi eksploitasi sistem bersama mentor ahli. Kamu akan belajar menggunakan Metasploit untuk menjalankan serangan canggih, memahami berbagai jenis shells dan payloads, serta menguasai teknik eksploitasi celah keamanan pada aplikasi web. Praktik langsung di sesi ini akan mengasah kemampuan kamu dalam mengambil alih sistem secara etis dan terampil.",
  ],
  [
    "Escalating Privilege",
    "24 Juli 2025",
    "13.00 – 15.00 WIB | 2 Jam",
    "Setelah berhasil masuk ke sistem, saatnya menguasai kekuatan penuh dengan teknik privilege escalation yang jadi kunci mengendalikan target secara total. Di sesi ini, kamu akan dibimbing langsung oleh mentor ahli untuk menguasai cara menaikkan hak akses di Linux dan Windows, termasuk penggunaan tools powerful seperti WinPEAS. Selain itu, kamu juga akan mendalami teknik reverse shells untuk menjaga kontrol dan membuka pintu masuk tersembunyi.",
  ],
  [
    "Menguasai Jejak Digital dan Final Challenge",
    "25 Juli 2025",
    "14.00 – 16.00 WIB",
    "Setelah menembus dan menguasai jaringan target lewat teknik pivoting dan tunneling, saatnya menyelesaikan perjalanan dengan menyusun laporan penetration testing yang profesional. Dalam sesi ini, kamu juga akan diumumkan final project yang akan jadi tantangan nyata untuk menguji semua kemampuan ethical hacking yang telah kamu pelajari.",
  ],
  [
    "Mentoring Final Project",
    "26 & 27 Juli 2025",
    "13.00 – 15.00 WIB | 2 Jam",
    "Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari pagi hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.",
  ],
];
const bundle = () => {
  return (
    <>
      <div>
        <Hero hero={hero} />
        <BundleClassInfo
          date="1 - 15 June 2025"
          sesi="6 Sesi"
          jam="2 Jam/Sesi"
          modul="10 Modul"
          mentor="Dhimas Putra"
          mentorImage="/person-placeholder.jpeg"
          mentorDesc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?"
          mentorLink="https://www.linkedin.com"
          TA="Dhimas Putra"
          TAImage="/person-placeholder.jpeg"
          TADesc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?"
          TALink="https://www.linkedin.com"
        ></BundleClassInfo>

        <SessionInfo sessions={sessions} />
      </div>
    </>
  );
};

export default bundle;
