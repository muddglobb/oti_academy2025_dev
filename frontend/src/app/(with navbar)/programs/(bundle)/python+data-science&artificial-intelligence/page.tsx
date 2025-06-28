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
    "TBA",
    ""
  ],
  [
    "Basic Python Workspace Setup",
    "30 Juni 2025",
    "Asinkronus",
    "Dalam sesi ini, kamu akan dapat video panduan lengkap menyiapkan workspace Python. Mulai instalasi tools yang dibutuhkan hingga menjalankan kode pertama, semua dijelaskan langkah demi langkah dengan jelas dan mudah diikuti, supaya kamu siap mulai belajar coding Python tanpa kendala."
  ],
  [
    "Mempelajari Dasar-Dasar Python",
    "1 Juli 2025",
    "09.00 – 11.00 WIB",
    "Masuk ke dunia pemrograman dengan Python. Pelajari sintaks dasar, output, komentar, variabel, tipe data, input pengguna, dan operasi matematika sederhana. Langsung praktik lewat mini assignment seru yang merangkum semua konsep dasar yang kamu pelajari."
  ],
  [
    "Logika dan Kontrol Alur Program Python",
    "2 Juli 2025",
    "09.00 – 11.00 WIB",
    "Sesi ini mengenalkan cara mengontrol alur program menggunakan operator logika, ekspresi kondisional serta perulangan. Selain itu, kamu juga akan mengeksplorasi cara manipulasi string dan indexing. Untuk memperdalam pemahaman, kamu akan membangun Password Validator dan berlatih pattern printing."
  ],
  [
    "Struktur Data dan Fungsi Python",
    "3 Juli 2025",
    "09.00 – 11.00 WIB",
    "Kenali berbagai struktur data seperti Array, List, Tuple, Set, dan Dictionary yang sangat penting dalam Python. Kamu juga akan mengenal fungsi dan scope dalam Python. Selain itu, cara mengimpor library dan menggunakan NumPy untuk perhitungan lebih kompleks."
  ],
  [
    "Pengenalan OOP dan Pemrograman Berbasis Objek",
    "7 Juli 2025",
    "09.00 – 11.00 WIB",
    "Masuki dunia Object-Oriented Programming (OOP) dan mulai menulis kode Python yang lebih rapi, terstruktur, dan mudah dikembangkan. Dalam sesi ini, kamu akan belajar konsep dasar seperti class, object, method, attribute, hingga method overloading & overriding."
  ],
  [
    "Data Structures 101 Dari Linked List ke Tree",
    "8 Juli 2025",
    "09.00 – 11.00 WIB",
    "Sesi ini akan memperkenalkan konsep dasar struktur data dan algoritma, seperti cara kerja Linked List dan Tree, serta bagaimana mengimplementasikannya menggunakan Python. Di akhir sesi, akan diumumkan detail Final Project yang akan menjadi tantangan utama dan penutup dari perjalanan belajar kamu."
  ],
  [
    "Sesi Konsultasi",
    "8 – 13 Juli 2025",
    "TBA",
    "Selama sesi, kamu bisa konsultasi langsung lewat Zoom dengan Teaching Assistant. Ruang konsultasi buka dari pagi sampai sore, jadi bisa tanya kapan saja dalam jam tersebut."
  ],
  [
    "Pengumuman Top 3 Proyek",
    "21 Juli 2025",
    "Asinkronus",
    "Di sesi ini, kita akan mengumumkan Top 3 proyek terbaik dari final project yang telah dikumpulkan. Penilaian dilakukan berdasarkan tiga aspek utama: kualitas teknis, fitur yang berjalan baik, serta dokumentasi yang jelas."
  ],
  [
    "DSAI Workspace Setup (Video)",
    "Asinkronus",
    "Asinkronus",
    "Sesi ini merupakan pembelajaran mandiri yang dirancang untuk membantu peserta menyiapkan lingkungan kerja menggunakan Kaggle. Materi mencakup cara membuat akun, mengenal antarmuka Kaggle, serta mengatur file dan notebook yang akan digunakan selama program."
  ],
  [
    "Langkah Awal di Dunia Data Science & AI",
    "14 Juli 2025",
    "14.00 –16.00 WIB",
    "Mulai perjalananmu di dunia Data Science & AI dengan sesi pembuka yang seru dan penuh wawasan. Di sini kamu akan mengenal konsep dasar DSAI, memahami alur kerjanya, dan belajar menggunakan library penting seperti Pandas dan Matplotlib."
  ],
  [
    "Pengenalan Machine Learning",
    "15 Juli 2025",
    "14.00 – 16.00 WIB",
    "Pada sesi ini, kamu akan membahas konsep dasar Machine Learning, termasuk supervised dan unsupervised learning. Peserta akan mempelajari regresi, klasifikasi, regresi linear, serta klasterisasi menggunakan K-means."
  ],
  [
    "Membongkar Algoritma & Teknik Canggih Machine Learning",
    "16 Juli 2025",
    "14.00 –16.00 WIB",
    "Tingkatkan skill Machine Learning dengan teknik canggih seperti stacking dan algoritma populer K-Nearest Neighbour, Decision Tree, serta Random Forest. Di sesi ini, kamu juga akan langsung memulai kompetisi Kaggle dan praktik dengan data mentah untuk memperkuat kemampuan nyata."
  ],
  [
    "Selami Dunia Deep Learning dari Fondasi sampai Aplikasinya",
    "22 Juli 2025",
    "14.00 –16.00 WIB",
    "Sesi ini memberikan pemahaman dasar tentang Deep Learning, mencakup definisi, perbedaan dengan Machine Learning tradisional, serta konsep dasar seperti neuron, layers, weights, dan fungsi aktivasi. Termasuk juga demo singkat membangun jaringan saraf sederhana menggunakan Keras Dengan pendekatan Sequential."
  ],
  [
    "Dari Kata ke Kode, Petualangan di Dunia Natural Language Processing (NLP)",
    "23 Juli 2025",
    "14.00 –16.00 WIB",
    "Mulai petualanganmu di dunia Natural Language Processing (NLP) dengan mengenal teknik dasar yang membuat komputer bisa “mengerti” bahasa manusia. Kamu akan mempelajari cara membersihkan teks, seperti mengubah huruf besar ke kecil, menghapus stopwords, dan tokenisasi."
  ],
  [
    "Representasi Teks dan Klasifikasi dalam NLB",
    "24 Juli 2025",
    "14.00 –16.00 WIB",
    "Sesi ini membahas cara mempresentasikan teks dalam bentuk numerik menggunakan metode Bag of Words dan TF-IDF. Peserta akan belajar melatih model klasifikasi teks sederhana untuk deteksi spam, dengan studi kasus menggunakan algoritma Naive Bayes."
  ],
  [
    "Computer Vision 101 dengan Convolutional Neural Networks (CNN)",
    "25 Juli 2025",
    "14.00 –16.00 WIB",
    "Jelajahi dunia di mana komputer bisa ‘melihat’ dan mengenali gambar seperti manusia. Di sesi ini, kamu akan memahami rahasia di balik penglihatan mesin lewat konsep Computer Vision dan kekuatan Convolutional Neural Networks (CNN). Selain itu, di sesi ini akan diumumkan pemenang kompetisi Kaggle."
  ],
  [
    "Rapat Teknis untuk Presentasi Final Round",
    "26 Juli 2025",
    "14.00 –15.00 WIB",
    "Sesi briefing terakhir untuk menyambut babak presentasi akhir. Kamu akan mendapatkan arahan teknis serta panduan presentasi agar dapat menampilkan hasil proyekmu dengan maksimal di hadapan juri."
  ],
  [
    "Presentasi Final Round",
    "28 Juli 2025",
    "14.00 –16.00 WIB",
    "Sesi puncak untuk mempresentasikan final project kamu di hadapan juri dan peserta lainnya. Tunjukkan hasil kerja kerasmu dan raih apresiasi tertinggi!"
  ]
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
          mentorDesc="To be announced"
          mentorLink="https://www.linkedin.com"
          TA="Daffa Aryza Pasya"
          TAImage="/images/foto-orang/daffa.webp"
          TADesc="Mahasiswa tahun pertama Ilmu Komputer UGM yang antusias di dunia coding, khususnya Python, C++, dan JavaScript. Finalis Data Royale Competition 2024 ini siap membimbing kamu dengan cara yang santai dan mudah dipahami."
          TALink="https://www.linkedin.com/in/daffa-ap/"
          title= ""
        ></BundleClassInfo>

        <SessionInfo sessions={sessions} />
      </div>
    </>
  );
};

export default bundle;
