import React from "react";
import BundleClassInfo from "@/components/programs/bundle/bundle-classinfo";
import Hero from "@/components/programs/intermediate/intermediate-hero";
import SessionInfo from "@/components/programs/intermediate/intermediate-session-info";

const hero: [string, string, string] = [
  "Fundamental Cyber Security + Intermidiate CyberSecurity",
  "Belajar cybersecurity dan ethical hacking dari basic hingga intermediate, mulai dari OSINT, forensik, web exploit, hingga penetration testing dan pembuatan laporan profesional.",
  "Bundle",
];
const sessions: [string, string, string, string][] = [
  [
    "Grand Launching",
    "30 Juni 2025",
    "TBA",
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
    "Masuki dunia forensik digital dengan teknik dasar untuk mengungkap data tersembunyi. Pelajari perintah Linux seperti strings dan exiftool, analisis file populer, hingga eksplorasi jaringan dengan Wireshark. Selain itu, kenali konsep steganografi untuk sembunyikan pesan rahasia.",
  ],
  [
    "Mempelajari Fundamental dari Web Exploitation",
    "5 Juli 2025",
    "19.00 – 21.00 WIB",
    "Pelajari teknik dasar eksploitasi web yang umum di pengujian keamanan. Pahami cara kerja Burp Suite, celah XSS, dan risiko upload file. Praktik langsung di platform PortSwigger untuk mengenal pola serangan nyata yang sering ditemui di dunia industri.",
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
    "19.00 – 21.00 WIB ",
    "Kamu akan belajar dasar OSINT (Open Source Intelligence), yaitu teknik mengumpulkan informasi dari sumber terbuka di internet. Pelajari alat-alat OSINT untuk menggali data secara efektif dan kenali dasar web scraping untuk mengekstrak data dari situs secara otomatis.",
  ],
  [
    "CTF Practice dan Persiapan Final Project",
    "13 Juli 2025",
    "19.00 – 21.00 WIB",
    "Di sesi ini, kamu akan mengenal CTF (Capture The Flag), alur kompetisinya, dan cara ikut serta. Latihan langsung lewat picoCTF untuk mengasah skill hacking dan problem solving. Di akhir sesi, final project diumumkan untuk menerapkan semua yang telah dipelajari.",
  ],
  [
    "Sesi Konsultasi",
    "15 Juli 2025",
    "13.00 – 15.00 WIB",
    "Selama sesi, kamu bisa konsultasi langsung lewat Zoom dengan Teaching Assistant. Ruang konsultasi buka dari pagi sampai sore, jadi bisa tanya kapan saja dalam jam tersebut.",
  ],
  [
    "Pengenalan Penetration Testing dan Pre-Engagement",
    "16 Juli 2025",
    "13.00 – 15.00 WIB",
    "Masuki dunia siber dari sisi penyerang dan pelajari bagaimana para ethical hacker merancang langkah demi langkah untuk menembus sistem secara legal. Sesi ini akan membekali kamu dengan dasar-dasar penetration testing, mulai dari rules of engagement, alur kerja pentest, hingga eksplorasi HackTheBox sebagai medan latihan digital.",
  ],
  [
    "Menembus Permukaan, Seni Enumeration dalam Dunia Siber",
    "17 Juli 2025",
    "13.00 – 15.00 WIB",
    "Langkah awal yang menentukan dalam ethical hacking dimulai dari seberapa dalam kamu bisa menggali informasi target. Kamu akan mempelajari teknik enumerasi untuk mengungkap layanan tersembunyi dan celah potensial dalam sistem, khususnya pada SMB dan Windows. Kamu juga akan menggunakan tools andalan seperti smbclient, dan enum4linux.",
  ],
  [
    "Identifikasi Kerentanan Sebelum Menyerang",
    "18 Juli 2025",
    "14.00 – 16.00 WIB",
    "Di sesi ini, kamu akan diajak menyelami proses identifikasi kerentanan, mulai dari web view analysis untuk menangkap pola dan anomali, hingga penggunaan automated scanners yang mempercepat deteksi celah keamanan. Sesi ini akan melatih insting analisismu agar lebih tajam dalam membaca potensi eksploitasi di sistem target.",
  ],
  [
    "Metasploit dan Seni Menguasai Sistem",
    "23 Juli 2025",
    "13.00 – 15.00 WIB",
    "Sesi ini membawa kamu langsung ke inti serangan dengan eksplorasi eksploitasi sistem bersama mentor ahli. Kamu akan belajar menggunakan Metasploit untuk menjalankan serangan canggih, memahami berbagai jenis shells dan payloads, serta menguasai teknik eksploitasi celah keamanan pada aplikasi web.",
  ],
  [
    "Escalating Privilege",
    "24 Juli 2025",
    "13.00 – 15.00 WIB",
    "Setelah berhasil masuk sistem, pelajari teknik privilege escalation untuk menguasai hak akses di Linux dan Windows. Dapat bimbingan mentor ahli serta dalami reverse shells untuk menjaga kontrol dan membuka pintu masuk tersembunyi secara efektif.",
  ],
  [
    "Final Project & Menguasai Jejak Digital",
    "25 Juli 2025",
    "14.00 – 16.00 WIB",
    "Setelah menguasai jaringan target lewat pivoting dan tunneling, pelajari cara menyusun laporan penetration testing profesional. Di sesi ini juga diumumkan final project sebagai tantangan nyata untuk menguji kemampuan ethical hackingmu.",
  ],
  [
    "Mentoring Final Project",
    "26 & 27 Juli 2025",
    "13.00 – 15.00 WIB",
    "Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari pagi hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.",
  ],
];

const bundle = () => {
  return (
    <>
      <div>
        <Hero hero={hero} />
        <BundleClassInfo
          date="30 Juni – 15 Juli 2025"
          sesi="8 Sesi"
          jam="2 Jam/Sesi"
          modul="6 Modul"
          mentor="TBA"
          mentorImage="/person-placeholder.jpeg"
          mentorDesc="To be announced"
          mentorLink="https://www.linkedin.com"
          TA="Muhammad Ahsan"
          TAImage="/images/foto-orang/ahsan.webp"
          TADesc="Mahasiswa Ilmu Komputer UGM yang antusias di bidang cybersecurity. Telah menyelesaikan Google Cybersecurity Certificate dan terus belajar hal baru di dunia teknologi. Di kelas ini, dia siap jadi teaching assistant yang bisa diandalkan."
          TALink="https://www.linkedin.com/in/ahsan-wiryawan-35924b326/"
          title=""
        ></BundleClassInfo>

        <SessionInfo sessions={sessions} />
      </div>
    </>
  );
};

export default bundle;
