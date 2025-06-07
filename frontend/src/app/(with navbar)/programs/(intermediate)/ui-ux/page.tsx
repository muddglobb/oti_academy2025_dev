import React from "react";
import IntermediateHero from "@/components/programs/intermediate/intermediate-hero";
import IntermediateClassInfo from "@/components/programs/intermediate/intermediate-class-info";
import IntermediateSessionInfo from "@/components/programs/intermediate/intermediate-session-info";

const hero: [string, string, string] = [
  "UI/UX",
  "Mulai dari mengubah PRD jadi desain, membuat mock-up, wireframe, hingga memahami UX laws dan desain yang aksesibel. Belajar secara fleksibel lewat modul online, tugas, konsultasi, dan proyek akhir yang bisa jadi portofolio.",
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

  "Ken Bima Satria Gandasasmita",
  "/images/class-profile/hako.jpg",
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?",
  "https://www.linkedin.com/in/dhimas-sulistio/",

  "30 Juni & 17 Juli – 28 Juli 2025",
  "10 Sesi",
  "2 Jam/Sesi",
  "8 Modul",
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
    "Dari Ide ke Rencana, Kenali Design Brief dan Dokumen Proyek",
    "17 Juli 2025",
    "18.30 – 20.30 WIB | 2.5 Jam",
    "Mulai langkah penting dalam manajemen proyek dengan memahami cara menyusun Project Requirement Document (PRD) dan Design Brief. Sesi ini akan membimbing kamu mengubah PRD menjadi Design Brief yang jelas dan terarah, serta mengaplikasikan dokumen-dokumen tersebut langsung dalam proses desain untuk hasil yang maksimal.",
  ],
  [
    "Menggali Kebutuhan Pengguna dengan Wawancara Efektif",
    "18 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Masuki dunia pengguna dengan cara yang tepat, kamu akan belajar teknik wawancara yang bukan sekadar tanya jawab biasa, tapi cara menggali kebutuhan dan motivasi terdalam pengguna. Dengan menghubungkan hasil interview ke Hook Model dan Mental Models, kamu akan mampu memahami perilaku mereka secara mendalam dan menciptakan solusi yang benar-benar menyentuh.",
  ],
  [
    "Berkreasi dengan How Might We dan Storyboard untuk Solusi User",
    "19 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Sesi ini akan membawamu ke dunia eksplorasi ide tanpa batas, Kamu akan belajar bagaimana menggali solusi inovatif lewat generative design dan memetakan skenario nyata dengan scenario mapping. Dengan alat seperti How Might We matrix dan storyboard, kamu bukan hanya menemukan ide, tapi juga merancang pengalaman pengguna yang hidup dan berdampak.",
  ],
  [
    "Desain Bermakna Menciptakan Produk yang Dipakai dan Menguntungkan",
    "20 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Saatnya melihat desain sebagai kekuatan strategis yang mendorong inovasi dan pertumbuhan bisnis. Di sesi ini, kamu akan belajar bagaimana UX terintegrasi dengan marketing, teknologi, dan tujuan bisnis untuk menciptakan solusi yang berdampak. Sesi ini juga akan membuka wawasanmu pada potensi UX masa depan lewat teknologi seperti AI, AR, dan VR.",
  ],
  [
    "Membawa Ide ke Layar dengan Low-fi dan Hi-fi",
    "24 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Sesi ini akan membawamu menyusuri proses visualisasi ide, mulai dari Low-Fidelity (sketsa awal yang cepat dan sederhana) hingga High-Fidelity (desain detail yang mendekati tampilan akhir produk). Kamu akan belajar membuat wireframe dan prototype sebagai alat penting untuk menguji dan menyempurnakan ide sebelum masuk tahap pengembangan.",
  ],
  [
    "Psikologi di Balik Desain Hebat",
    "25 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Desain hebat bukan hanya soal estetika, tapi juga soal memahami bagaimana manusia berpikir dan bertindak. Di sesi ini, kamu akan mempelajari UX Laws, prinsip-prinsip psikologis yang menjadi dasar mengapa desain tertentu terasa intuitif, cepat dipahami, dan menyenangkan digunakan. Dengan memahami hukum-hukum ini, kamu bisa membuat desain yang tidak hanya menarik secara visual, tetapi juga efektif secara fungsional dan mudah digunakan.",
  ],
  [
    "Mengukur Pengalaman dari Feedback ke Insight",
    "26 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Sesi ini mengajak kamu menguak rahasia di balik pengalaman pengguna yang mulus dan memuaskan. Kamu akan belajar cara melakukan pengujian yang tepat untuk mengukur seberapa mudah dan efektif produk digunakan, serta menggunakan metode seperti System Usability Score (SUS) dan Heuristic Analysis untuk menemukan dan memperbaiki kendala sebelum produk benar-benar diluncurkan.",
  ],
  [
    "Membuat Desain Terlihat dan Dirasakan Semua",
    "27 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Pada sesi ini, kamu akan mempelajari tentang pentingnya menciptakan desain yang aksesibel dan inklusif, sehingga semua orang termasuk mereka dengan kebutuhan khusus bisa merasakan manfaatnya. Selain itu, kamu juga akan belajar teknik UX pitching yang powerful untuk menyampaikan ide desain dengan meyakinkan ke klien dan tim, serta strategi kolaborasi efektif dengan tim development agar desainmu bisa terwujud dengan sempurna.",
  ],
  [
    "Mentoring Final Project",
    "28 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari pagi hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.",
  ],
];

const UIUX = () => {
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

export default UIUX;
