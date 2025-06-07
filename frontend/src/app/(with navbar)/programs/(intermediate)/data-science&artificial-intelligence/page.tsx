import React from "react";
import IntermediateHero from "@/components/programs/intermediate/intermediate-hero";
import IntermediateClassInfo from "@/components/programs/intermediate/intermediate-class-info";
import IntermediateSessionInfo from "@/components/programs/intermediate/intermediate-session-info";

const hero: [string, string, string] = [
  "Data Science & AI",
  "Belajar Data Science dan AI dari nol hingga siap ikut proyek dan kompetisi. DSAI Bootcamp membimbingmu step-by-step dari dasar hingga membangun model AI siap industri.",
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
  "/person-placeholder.jpeg",
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?",
  "https://www.linkedin.com/in/dhimas-sulistio/",

  "Daffa Aryza",
  "/images/foto-orang/daffa.webp",
  "Mahasiswa tahun pertama Ilmu Komputer UGM yang antusias di dunia coding, khususnya Python, C++, dan JavaScript. Finalis Data Royale Competition 2024 ini siap membimbing kamu dengan cara yang santai dan mudah dipahami.",
  "https://www.linkedin.com/in/dhimas-sulistio/",

  "30 Juni & 14 Juli – 28 Juli 2025",
  "11 Sesi",
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
    "DSAI Workspace Setup (Video)",
    "XX June 2025",
    "Asinkronus",
    "Sesi ini merupakan pembelajaran mandiri yang dirancang untuk membantu peserta menyiapkan lingkungan kerja menggunakan Kaggle. Materi mencakup cara membuat akun, mengenal antarmuka Kaggle, serta mengatur file dan notebook yang akan digunakan selama program. Dengan menyelesaikan sesi ini, peserta diharapkan siap untuk mengikuti sesi pembelajaran DSAI secara optimal tanpa kendala teknis.",
  ],
  [
    "Langkah Awal di Dunia Data Science & AI",
    "14 Juli 2025",
    "14.00 –16.00 WIB | 2 Jam",
    "Mulai perjalananmu di dunia Data Science & AI dengan sesi pembuka yang seru dan penuh wawasan! Di sini kamu akan mengenal konsep dasar DSAI, memahami alur kerjanya, dan belajar menggunakan library penting seperti Pandas dan Matplotlib. Tak hanya teori, kamu juga akan langsung praktik mengolah data mentah lewat sesi hands-on yang aplikatif.",
  ],
  [
    "Pengenalan Machine Learning",
    "15 Juli 2025",
    "14.00 – 16.00 WIB | 2 Jam",
    "Pada sesi ini, kamu akan membahas konsep dasar Machine Learning, termasuk supervised dan unsupervised learning. Peserta akan mempelajari regresi, klasifikasi, regresi linear, serta klasterisasi menggunakan K-means. Terdapat juga studi kasus praktik langsung dengan data mentah untuk kedua jenis pembelajaran tersebut.",
  ],
  [
    "Membongkar Algoritma & Teknik Canggih Machine Learning",
    "16 Juli 2025",
    "14.00 –16.00 WIB | 2 Jam",
    "Tingkatkan skill Machine Learning dengan teknik canggih seperti stacking dan algoritma populer K-Nearest Neighbour, Decision Tree, serta Random Forest. Di sesi ini, kamu juga akan langsung memulai kompetisi Kaggle dan praktik dengan data mentah untuk memperkuat kemampuan nyata.",
  ],
  [
    "Selami Dunia Deep Learning dari Fondasi sampai Aplikasinya",
    "22 Juli 2025",
    "14.00 –16.00 WIB | 2 Jam",
    "Sesi ini memberikan pemahaman dasar tentang Deep Learning, mencakup definisi, perbedaan dengan Machine Learning tradisional, serta konsep dasar seperti neuron, lapisan (layers), bobot (weights), dan fungsi aktivasi. Termasuk juga demo singkat membangun jaringan saraf sederhana menggunakan Keras Dengan pendekatan Sequential.",
  ],
  [
    "Dari Kata ke Kode, Petualangan di Dunia Natural Language Processing (NLP)",
    "23 Juli 2025",
    "14.00 –16.00 WIB | 2 Jam",
    "Mulai petualanganmu di dunia Natural Language Processing (NLP) dengan mengenal teknik-teknik dasar yang membuat komputer bisa “mengerti” bahasa manusia. Dalam sesi ini, kamu akan belajar cara membersihkan teks, seperti mengubah huruf besar ke kecil, menghapus kata-kata umum yang tidak penting (stopwords), dan memecah kalimat menjadi potongan-potongan kecil (tokenisasi).",
  ],
  [
    "Representasi Teks dan Klasifikasi dalam NLB",
    "24 Juli 2025",
    "14.00 –16.00 WIB | 2 Jam",
    "Sesi ini membahas cara mempresentasikan teks dalam bentuk nemurik menggunakan metode Bag of Words dan TF-IDF. Peserta akan belajar melatih model klasifikasi teks sederhana untuk deteksi spam, dengan studi kasus menggunakan algoritma Naive Bayes.",
  ],
  [
    "Computer Vision 101 dengan Convolutional Neural Networks (CNN)",
    "25 Juli 2025",
    "14.00 –16.00 WIB | 2 Jam",
    "Jelajahi dunia di mana komputer bisa ‘melihat’ dan mengenali gambar seperti manusia. Di sesi ini, kamu akan memahami rahasia di balik penglihatan mesin lewat konsep Computer Vision dan kekuatan Convolutional Neural Networks (CNN). Mulai dari piksel hingga model canggih, kamu juga akan langsung praktik klasifikasi gambar. Selain itu, di sesi ini akan diumumkan pemenang kompetisi Kaggle untuk melakukan presentasi hasil terbaik mereka.",
  ],
  [
    "Rapat Teknis untuk Presentasi Final Round",
    "26 Juli 2025",
    "14.00 –15.00 WIB | 1 Jam",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis? fjieofjiojwjefoiejwoi",
  ],
  [
    "Presentasi Final Round",
    "28 Juli 2025",
    "14.00 –16.00 WIB | 2 Jam",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis? fjieofjiojwjefoiejwoi",
  ],
];

const DataScienceAndAI = () => {
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

export default DataScienceAndAI;
