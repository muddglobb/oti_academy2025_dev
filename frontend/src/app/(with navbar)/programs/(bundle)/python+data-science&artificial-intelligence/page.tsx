import React from "react";
import BundleClassInfo from "@/components/programs/bundle/bundle-classinfo";
import Hero from "@/components/programs/intermediate/intermediate-hero";
import SessionInfo from "@/components/programs/intermediate/intermediate-session-info";

const hero: [string, string, string] = [
  "Basic Python + Data Science and AI",
  "Pelajari pemrograman Python dan Data Science & AI dari basic hingga intermediate. Mulai dari sintaks dasar, OOP, struktur data, hingga membangun model AI siap industri melalui studi kasus menarik dan bimbingan step-by-step untuk persiapan proyek dan kompetisi nyata.",
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
    "Basic Python Workspace Setup",
    "30 Juni 2025",
    "Asinkronus",
    "Dalam sesi ini, kamu akan mendapatkan video panduan lengkap tentang cara menyiapkan workspace Python-mu sendiri. Mulai dari instalasi tools yang dibutuhkan hingga menjalankan kode pertamamu, semua dijelaskan langkah demi langkah!",
  ],
  [
    "Mempelajari Dasar-Dasar Python",
    "1 Juli 2025",
    "09.00 – 11.00 WIB | 2 Jam",
    "Masuk ke inti dunia pemrograman bareng Python! Dalam sesi ini, kamu akan belajar menulis kode pertamamu, memahami sintaks dasar, mencetak output, menulis komentar, serta mengenal variabel, tipe data, input pengguna, dan operasi matematika sederhana. Langsung praktik lewat mini assignment seru yang merangkum semua konsep dasar yang kamu pelajari.",
  ],
  [
    "Logika dan Kontrol Alur Program Python",
    "2 Juli 2025",
    "09.00 – 11.00 WIB | 2 Jam",
    "Sesi ini mengenalkan cara mengontrol alur program menggunakan operator logika, ekspresi kondisional (if, nested if), serta perulangan (for & while). Selain itu, kamu juga akan mengeksplorasi cara manipulasi string dan indexing. Untuk memperdalam pemahaman, kamu akan membangun Password Validator dan berlatih pattern printing.",
  ],
  [
    "Struktur Data dan Fungsi Python",
    "3 Juli 2025",
    "09.00 – 11.00 WIB | 2 Jam",
    "Kenali berbagai struktur data seperti Array, List, Tuple, Set, dan Dictionary yang sangat penting dalam Python. Dalam sesi ini, kamu juga akan mengenal fungsi dan scope dalam Python. Selain itu, kamu akan belajar cara mengimpor library dan menggunakan NumPy untuk perhitungan lebih kompleks. Semua konsep ini akan langsung kamu terapkan dalam studi kasus nyata.",
  ],
  [
    "Pengenalan OOP dan Pemrograman Berbasis Objek",
    "7 Juli 2025",
    "09.00 – 11.00 WIB | 2 Jam",
    "Masuki dunia Object-Oriented Programming (OOP) dan mulai menulis kode Python yang lebih rapi, terstruktur, dan mudah dikembangkan. Dalam sesi ini, kamu akan belajar konsep dasar seperti class, object, method, attribute, hingga method overloading & overriding. OOP adalah fondasi penting untuk membangun program berskala besar dan profesional dan sesi ini akan jadi langkah awalmu ke arah sana.",
  ],
  [
    "Data Structures 101 Dari Linked List ke Tree",
    "8 Juli 2025",
    "09.00 – 11.00 WIB | 2 Jam",
    "Sesi ini akan memperkenalkan konsep dasar struktur data dan algoritma, kamu akan mempelajari cara kerja Linked List dan Tree, serta bagaimana mengimplementasikannya menggunakan Python. Untuk memperdalam pemahaman, kamu akan membangun Organization Tree sebagai studi kasus nyata. Di akhir sesi, akan diumumkan detail Final Project yang akan menjadi tantangan utama dan penutup dari perjalanan belajar kamu.",
  ],
  [
    "Sesi Konsultasi",
    "8 – 13 Juli 2025",
    "TBA",
    "Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari pagi hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.",
  ],
  [
    "Pengumuman Top 3 Proyek",
    "21 Juli 2025",
    "Asinkronus",
    "Di sesi ini, kita akan mengumumkan Top 3 proyek terbaik dari final project yang telah dikumpulkan. Penilaian dilakukan berdasarkan tiga aspek utama: kualitas teknis, fitur yang berjalan baik, serta dokumentasi yang jelas.",
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
const bundle = () => {
  return (
    <>
      <div>
        <Hero hero={hero} />
        <BundleClassInfo
          date="30 June – 21 Juli 2025"
          sesi="9 Sesi"
          jam="2 Jam/Sesi"
          modul="6 Modul"
          mentor="TBA"
          mentorImage="/person-placeholder.jpeg"
          mentorDesc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?"
          mentorLink="https://www.linkedin.com"
          TA="Daffa Aryza Pasya"
          TAImage="/person-placeholder.jpeg"
          TADesc="Mahasiswa tahun pertama Ilmu Komputer UGM yang antusias di dunia coding, khususnya Python, C++, dan JavaScript. Finalis Data Royale Competition 2024 ini siap membimbing kamu dengan cara yang santai dan mudah dipahami."
          TALink="https://www.linkedin.com"
        ></BundleClassInfo>

        <SessionInfo sessions={sessions} />
      </div>
    </>
  );
};

export default bundle;
