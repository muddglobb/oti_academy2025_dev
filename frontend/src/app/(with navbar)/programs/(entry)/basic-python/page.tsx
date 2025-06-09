import React from "react";
import EntryClassInfo from "@/components/programs/entry/entry-classinfo";
import Hero from "@/components/programs/intermediate/intermediate-hero";
import SessionInfo from "@/components/programs/intermediate/intermediate-session-info";

const hero: [string, string, string] = [
  "Basic Python",
  "Pelajari dasar-dasar pemrograman Python, mulai dari sintaks dasar hingga OOP dan struktur data. Materi disusun secara bertahap dan mudah diikuti cocok untuk pemula dengan studi kasus menarik.",
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
  "30 June – 21 Juli 2025",
  "6 Sesi",
  "2 Jam/Sesi",
  "6 Modul",
  "Daffa Aryza",
  "/images/foto-orang/daffa.webp",
  "Mahasiswa tahun pertama Ilmu Komputer UGM yang antusias di dunia coding, khususnya Python, C++, dan JavaScript. Finalis Data Royale Competition 2024 ini siap membimbing kamu dengan cara yang santai dan mudah dipahami.",
  "https://www.linkedin.com",
];
const sessions: [string, string, string, string][] = [
  [
    "Grand Launching",
    "30 Juni 2025",
    "To be announced",
    "",
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
    "3 Juli 2025 ",
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
];
const BasicPython = () => {
  return (
    <div className="flex flex-col items-center">
      <Hero hero={hero} />
      <EntryClassInfo classInfo={classInfo} />
      <SessionInfo sessions={sessions} />
    </div>
  );
};

export default BasicPython;
