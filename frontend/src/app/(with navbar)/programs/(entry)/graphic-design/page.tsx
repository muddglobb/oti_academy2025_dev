import React from "react";
import EntryClassInfo from "@/components/programs/entry/entry-classinfo";
import Hero from "@/components/programs/intermediate/intermediate-hero";
import SessionInfo from "@/components/programs/intermediate/intermediate-session-info";

const hero: [string, string, string] = [
  "Graphic Design",
  "Belajar dasar desain grafis mulai dari elemen visual, warna, hingga layout. Lewat studi kasus dan praktik di Figma, kamu akan buat berbagai konten secara terarah dan bermakna.",
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
  "30 Juni – XX Juli 2025",
  "8 Sesi",
  "2 Jam/Sesi",
  "6 Modul",
  "Geraldine Hutagalung",
  "/images/foto-orang/geradline.webp",
  "Seorang mahasiswa Ilmu Komputer UGM yang dikenal dengan karya-karya desain grafisnya yang kreatif dan standout. Aktif di berbagai proyek, ia siap berbagi wawasan visual sebagai teaching assistant di kelas ini.",
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
    "Intro to Graphic Design & Visual Principles",
    "30 Juni 2025",
    "16.00 – 17.30 WIB | 1.5 Jam",
    "Pelajari elemen-elemen visual penting seperti garis, bentuk, warna, tekstur, dan ruang yang menjadi kunci desain menarik dan efektif. Dalam sesi ini, kamu akan menganalisis desain nyata untuk memahami perbedaan antara desain yang eye-catching dan yang kurang efektif. Selanjutnya, langsung praktik membuat kolase visual keren di Figma dengan prinsip desain yang mudah dipahami dan diterapkan.",
  ],
  [
    "Mengenal Tipografi dan Komposisi Layout",
    "2 Juli 2025",
    "19.00 – 20.30 WIB | 1.5 Jam",
    "Pada sesi ini, kamu akan mempelajari dasar-dasar tipografi dan layout dalam desain grafis. Kamu akan belajar berbagai jenis font seperti serif, sans-serif, display, dan monospace, serta konsep hierarchy. Selain itu, kamu juga akan mempelajari prinsip-prinsip layout seperti grid system, alignment, margin, dan struktur baca yang efektif.",
  ],
  [
    "Color in Design: Meaning, Strategy & Accessibility",
    "4 Juli 2025",
    "19.00 – 20.30 WIB | 1.5 Jam",
    "Sesi ini membahas peran penting warna dalam desain, mulai dari maknanya terhadap emosi dan persepsi hingga penerapannya dalam strategi branding seperti penggunaan warna primer, sekunder, dan aksen. Kamu juga akan memahami pentingnya kontras dan aksesibilitas dalam desain visual, serta mengenal tools seperti WebAIM Contrast Checker untuk memastikan desain ramah bagi semua pengguna.",
  ],
  [
    "Pengenalan ke Media Sosial dan Desain Kampanye Digital",
    "7 Juli 2025",
    "19.00 – 20.30 WIB | 1.5 Jam",
    "Dalam sesi ini, kamu akan mengenal format-format desain konten media sosial yang paling populer, seperti carousel, single post, dan story. Pelajari juga prinsip dasar visual storytelling untuk menyampaikan pesan secara efektif dan menarik. Kamu akan diajarkan cara menyusun informasi dengan runtut, menjaga konsistensi visual, serta menempatkan Call-to-Action (CTA) yang tepat agar audiens makin tergerak.",
  ],
  [
    "Mempelajari Branding & Visual Identity",
    "9 Juli 2025",
    "19.00 – 20.30 WIB | 1.5 Jam",
    "Sesi ini mengenalkan konsep identitas visual, mulai dari perbedaan antara logo, wordmark, ikon, dan simbol. Kamu akan belajar membangun konsistensi gaya melalui pemilihan warna, font, dan tone visual. Lewat studi kasus brand besar, kamu akan memahami penerapan identitas visual secara nyata, lalu mempraktikkannya dengan membuat moodboard dan sketsa logo brand fiktif beserta aplikasinya dalam elemen visual sederhana.",
  ],
  [
    "Mockup & Design Presentation",
    "11 Juli 2025",
    "19.00 – 20.30 WIB | 1.5 Jam",
    "Pelajari cara memukau dengan menampilkan desainmu dalam berbagai mockup keren dari poster sampai tampilan di perangkat digital dan media sosial. Selain itu, kuasai teknik menyusun presentasi desain yang jelas, terstruktur, dan penuh daya tarik, lengkap dengan narasi visual yang kuat serta alasan di balik setiap keputusan kreatifmu. Di akhir sesi, Final Project akan diumumkan sebagai tantangan utama untuk menerapkan seluruh kemampuan yang telah kamu pelajari.",
  ],
  [
    "Sesi Konsultasi",
    "TBA",
    "TBA",
    "Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari pagi hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.",
  ],
];
const GraphicDesign = () => {
  return (
    <div className="flex flex-col items-center">
      <Hero hero={hero} />
      <EntryClassInfo classInfo={classInfo} />
      <SessionInfo sessions={sessions} />
    </div>
  );
};

export default GraphicDesign;
