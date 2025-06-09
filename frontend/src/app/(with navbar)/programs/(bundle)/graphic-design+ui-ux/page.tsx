import React from "react";
import BundleClassInfo from "@/components/programs/bundle/bundle-classinfo";
import Hero from "@/components/programs/intermediate/intermediate-hero";
import SessionInfo from "@/components/programs/intermediate/intermediate-session-info";

const hero: [string, string, string] = [
  "Graphic Design + UI/UX",
  "Belajar desain dari basic hingga intermediate mulai dari elemen visual, warna, layout, hingga UX, wireframe, dan desain aksesibel. Praktik langsung di Figma, ubah PRD jadi desain, dan bangun portofolio lewat proyek akhir.",
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
    "Intro to Graphic Design & Visual Principles",
    "30 Juni 2025",
    "16.00 – 17.30 WIB | 1.5 Jam",
    "Pelajari elemen-elemen visual penting seperti garis, bentuk, warna, tekstur, dan ruang yang menjadi kunci desain menarik dan efektif. Dalam sesi ini, kamu akan menganalisis desain nyata untuk memahami perbedaan antara desain yang eye-catching dan yang kurang efektif.",
  ],
  [
    "Mengenal Tipografi dan Komposisi Layout",
    "2 Juli 2025",
    "19.00 – 20.30 WIB | 1.5 Jam",
    "Pada sesi ini, kamu akan mempelajari dasar-dasar tipografi dan layout dalam desain grafis. Kamu akan belajar berbagai jenis font serta konsep hierarchy. Selain itu, kamu juga akan mempelajari prinsip-prinsip layout seperti grid system, alignment, dan margin yang efektif.",
  ],
  [
    "Color in Design: Meaning, Strategy & Accessibility",
    "4 Juli 2025",
    "19.00 – 20.30 WIB | 1.5 Jam",
    "Sesi ini membahas peran penting warna dalam desain, mulai dari maknanya terhadap emosi dan persepsi hingga penerapannya dalam strategi branding. Kamu juga akan memahami pentingnya kontras dan aksesibilitas dalam desain visual, serta mengenal tools untuk memastikan desain ramah bagi semua pengguna.",
  ],
  [
    "Pengenalan ke Media Sosial dan Desain Kampanye Digital",
    "7 Juli 2025",
    "19.00 – 20.30 WIB | 1.5 Jam",
    "Sesi ini mengenalkan prinsip dasar visual storytelling untuk menyampaikan pesan secara efektif dan menarik. Kamu akan diajarkan cara menyusun informasi dengan runtut, menjaga konsistensi visual, serta menempatkan Call-to-Action (CTA) yang tepat agar audiens makin tergerak.",
  ],
  [
    "Mempelajari Branding & Visual Identity",
    "9 Juli 2025",
    "19.00 – 20.30 WIB | 1.5 Jam",
    "Sesi ini mengenalkan konsep identitas visual, mulai dari perbedaan antara logo, wordmark, ikon, dan simbol. Kamu akan belajar membangun konsistensi gaya melalui pemilihan warna, font, dan tone visual. Lewat studi kasus, kamu akan memahami penerapan identitas visual secara nyata.",
  ],
  [
    "Mockup & Design Presentation",
    "11 Juli 2025",
    "19.00 – 20.30 WIB | 1.5 Jam",
    "Pelajari cara memukau dengan menampilkan desainmu dalam berbagai mockup keren. Selain itu, kuasai teknik menyusun presentasi desain yang jelas, terstruktur, dan penuh daya tarik, lengkap dengan narasi visual. Di akhir sesi, Final Project akan diumumkan sebagai tantangan utama untuk menerapkan seluruh kemampuan yang telah kamu pelajari.",
  ],
  [
    "Sesi Konsultasi",
    "TBA",
    "TBA",
    "Selama sesi, kamu bisa konsultasi langsung lewat Zoom dengan Teaching Assistant. Ruang konsultasi buka dari pagi sampai sore, jadi bisa tanya kapan saja dalam jam tersebut.",
  ],
  [
    "Dari Ide ke Rencana, Kenali Design Brief dan Dokumen Proyek",
    "17 Juli 2025",
    "18.30 –20.30 WIB | 2.5 Jam",
    "Mulai langkah penting dalam manajemen proyek dengan memahami cara menyusun Project Requirement Document (PRD) dan Design Brief. Sesi ini akan membimbing kamu mengubah PRD menjadi Design Brief yang jelas dan terarah, serta mengaplikasikan dokumen-dokumen tersebut.",
  ],
  [
    "Menggali Kebutuhan Pengguna dengan Wawancara Efektif",
    "18 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Masuki dunia pengguna dengan teknik wawancara yang lebih dari sekadar tanya jawab. Pelajari cara menggali kebutuhan dan motivasi mereka, serta hubungkan hasilnya dengan Hook Model dan Mental Models untuk memahami perilaku secara mendalam dan ciptakan solusi yang tepat.",
  ],
  [
    "Berkreasi dengan How Might We dan Storyboard untuk Solusi User",
    "19 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Sesi ini akan membawamu ke dunia eksplorasi ide, Kamu akan belajar bagaimana menggali solusi inovatif lewat generative design dan memetakan skenario nyata dengan scenario mapping. Kamu bukan hanya menemukan ide, tapi juga merancang pengalaman pengguna yang hidup dan berdampak.",
  ],
  [
    "Desain Bermakna Menciptakan Produk yang Dipakai dan Menguntungkan",
    "20 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Saatnya melihat desain sebagai kekuatan strategis yang mendorong inovasi dan pertumbuhan bisnis. Di sesi ini, kamu akan belajar bagaimana UX terintegrasi dengan marketing, teknologi, dan tujuan bisnis untuk menciptakan solusi yang berdampak.",
  ],
  [
    "Membawa Ide ke Layar dengan Low-fi dan Hi-fi",
    "24 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Sesi ini akan membawamu menyusuri proses visualisasi ide, mulai dari Low-Fidelity hingga High-Fidelity. Kamu akan belajar membuat wireframe dan prototype sebagai alat penting untuk menguji dan menyempurnakan ide sebelum masuk tahap pengembangan.",
  ],
  [
    "Psikologi di Balik Desain Hebat",
    "25 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Desain hebat bukan hanya soal estetika, tapi juga soal memahami bagaimana manusia berpikir dan bertindak. Di sesi ini, kamu akan mempelajari UX Laws, prinsip-prinsip psikologis yang menjadi dasar mengapa desain tertentu terasa intuitif, cepat dipahami, dan menyenangkan digunakan.",
  ],
  [
    "Mengukur Pengalaman dari Feedback ke Insight",
    "26 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Sesi ini mengajak kamu menguak rahasia di balik pengalaman pengguna yang mulus dan memuaskan. Kamu akan belajar cara melakukan pengujian yang tepat untuk mengukur seberapa mudah dan efektif produk digunakan, serta menggunakan metode seperti System Usability Score (SUS) dan Heuristic Analysis.",
  ],
  [
    "Membuat Desain Terlihat dan Dirasakan Semua",
    "27 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Pada sesi ini, kamu akan mempelajari tentang pentingnya menciptakan desain yang aksesibel dan inklusif. Selain itu, kamu juga akan belajar teknik UX pitching yang powerful untuk menyampaikan ide desain dengan meyakinkan ke klien dan tim.",
  ],
  [
    "Mentoring Final Project",
    "28 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Selama sesi ini, kamu bisa konsultasi langsung lewat Zoom dengan Teaching Assistant. Ruang konsultasi buka dari pagi sampai sore, jadi kamu bisa tanya kapan saja dalam jam tersebut untuk mendapatkan arahan dan masukan terhadap Final Project kamu.",
  ],
];

const bundle = () => {
  return (
    <>
      <div>
        <Hero hero={hero} />
        <BundleClassInfo
          date="30 Juni – 28 Juli 2025"
          sesi="17 Sesi"
          jam="2 Jam/Sesi"
          modul="8 Modul"
          mentor="TBA"
          mentorImage="/person-placeholder.jpeg"
          mentorDesc="To be announced"
          mentorLink="https://www.linkedin.com"
          TA="Geraldine Hutagalung"
          TAImage="/images/foto-orang/geradline.webp"
          TADesc="Mahasiswa Ilmu Komputer UGM yang dikenal dengan karya-karya desain grafisnya yang kreatif dan standout. Aktif di berbagai proyek dan siap berbagi sebagai teaching assistant."
          TALink="https://www.linkedin.com"
          title= {hero[0]}
        ></BundleClassInfo>

        <SessionInfo sessions={sessions} />
      </div>
    </>
  );
};

export default bundle;
