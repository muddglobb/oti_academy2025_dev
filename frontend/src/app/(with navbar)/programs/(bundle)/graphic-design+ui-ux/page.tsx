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
    "XX.00 – XX.00 WIB",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis?",
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
    "9 Juli 2025 ",
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
  [
    "Dari Ide ke Rencana, Kenali Design Brief dan Dokumen Proyek",
    "17 Juli 2025",
    "18.30 –20.30 WIB | 2.5 Jam",
    "Mulai langkah penting dalam manajemen proyek dengan memahami cara menyusun Project Requirement Document (PRD) dan Design Brief. Sesi ini akan membimbing kamu mengubah PRD menjadi Design Brief yang jelas dan terarah, serta mengaplikasikan dokumen-dokumen tersebut langsung dalam proses desain untuk hasil yang maksimal.",
  ],
  [
    "Menggali Kebutuhan Pengguna dengan Wawancara Efektif",
    "18 Juli 2025",
    "18.30 – 20.30 WIB | 2 Ja",
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
          mentorDesc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?"
          mentorLink="https://www.linkedin.com"
          TA="Geraldine Hutagalung"
          TAImage="/images/foto-orang/geradline.webp"
          TADesc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?"
          TALink="https://www.linkedin.com"
          title= {hero[0]}
        ></BundleClassInfo>

        <SessionInfo sessions={sessions} />
      </div>
    </>
  );
};

export default bundle;
