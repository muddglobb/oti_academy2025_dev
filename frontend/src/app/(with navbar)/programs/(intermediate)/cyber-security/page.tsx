import React from "react";
import IntermediateHero from "@/components/programs/intermediate/intermediate-hero";
import IntermediateClassInfo from "@/components/programs/intermediate/intermediate-class-info";
import IntermediateSessionInfo from "@/components/programs/intermediate/intermediate-session-info";

const hero: [string, string, string] = [
  "CyberSecurity",
  "Masuki dunia ethical hacking dan praktik langsung tahapan penetration testing, dari reconnaissance hingga post-exploitation, lengkap dengan penyusunan laporan uji keamanan secara profesional.",
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
  "/images/teacher/faris.jpg",
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?",
  "https://www.linkedin.com/in/dhimas-sulistio/",

  "Muhammad Ahsan Zaki Wiryawan",
  "/images/class-profile/hako.jpg",
  "Mahasiswa Ilmu Komputer UGM yang antusias di bidang cybersecurity. Telah menyelesaikan Google Cybersecurity Certificate dan terus belajar hal baru di dunia teknologi. Di kelas ini, dia siap jadi teaching assistant yang bisa diandalkan.",
  "https://www.linkedin.com/in/dhimas-sulistio/",

  "30 Juni & 16 Juli – 27 Juli 2025",
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

const CyberSecurity = () => {
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

export default CyberSecurity;
