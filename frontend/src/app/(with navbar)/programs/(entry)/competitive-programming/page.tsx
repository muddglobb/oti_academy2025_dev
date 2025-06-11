import React from "react";
import EntryClassInfo from "@/components/programs/entry/entry-classinfo";
import Hero from "@/components/programs/intermediate/intermediate-hero";
import SessionInfo from "@/components/programs/intermediate/intermediate-session-info";

const hero: [string, string, string] = [
  "Competitive Programming",
  "Mengenali dasar-dasar Competitive Programming secara bertahap mulai dari algoritma, struktur data, hingga graf. Dirancang ringkas dan menantang, cocok untuk pemula dan ditutup dengan konteks sebagai tugas akhir.",
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
  "30 Juni – 13 Juli 2025",
  "X Sesi",
  "2 Jam/Sesi",
  "X Modul",
  "Revy Satya Gunawan",
  "/images/foto-orang/revy.webp",
  "Mahasiswa Ilmu Komputer UGM dan pemenang OSN Matematika 2023 yang aktif di dunia Competitive Programming. Siap jadi teaching assistant yang andal di kelas ini.",
  "",
];
const sessions: [string, string, string, string][] = [
  [
    "Pengenalan Basic C++",
    "",
    "Asinkronus",
    "Sesi ini merupakan pembelajaran mandiri untuk memahami dasar-dasar C++ yang menjadi prasyarat sebelum memasuki materi utama Competitive Programming. Materi dirancang untuk membantu peserta memahami sintaks dan konsep dasar C++ sehingga sesi tatap muka dapat langsung difokuskan pada strategi dan penyelesaian soal-soal kompetitif.",
  ],
  [
    "Grand Launching",
    "30 Juni 2025",
    "To be announced",
    "",
  ],
  [
    "Pengenalan Pencarian & Pengurutan",
    "30 Juni 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Pelajari dua konsep algoritma fundamental yang menjadi fondasi banyak topik lanjutan di pemrograman dan pengembangan perangkat lunak. Sesi ini akan dimulai dengan pemahaman mendalam melalui slide interaktif, lalu dilanjutkan dengan latihan langsung (live coding) bersama mentor.",
  ],
  [
    "Problem Solving 101 dengan Brute Force & Divide and Conquer",
    "2 Juli 2025 ",
    "18.30 – 20.30 WIB | 2 Jam",
    "Dalam sesi ini, kamu akan mempelajari dua strategi pemecahan masalah paling mendasar dalam algoritma. Brute Force sebagai teknik paling pasti dan langsung, serta Divide and Conquer untuk solusi yang lebih efisien dan terstruktur. Materi disampaikan melalui slide interaktif, dilanjutkan dengan live coding bareng mentor untuk langsung praktik.",
  ],
  [
    "Greedy vs Dynamic Programming",
    "4 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Pelajari bagaimana menyelesaikan masalah optimasi dengan Greedy, teknik cepat dan intuitif, serta pahami batasannya. Lalu kenali Dynamic Programming, solusi cerdas untuk kasus yang lebih kompleks dan tidak bisa diselesaikan dengan pendekatan greedy. Materi akan dipaparkan melalui slide interaktif, lalu dilanjutkan dengan live coding bersama mentor untuk langsung memahami penerapannya.",
  ],
  [
    "Mempelajari Struktur Data Dasar STL C++",
    "6 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Kenali struktur data dasar yang paling sering digunakan dalam pemrograman: mulai dari vector, stack, queue, set, hingga map. Pelajari cara kerja, kapan digunakan, dan kenapa penting untuk efisiensi kode. Materi disampaikan lewat slide interaktif, kemudian langsung dipraktikkan lewat live coding bersama mentor agar kamu makin paham penerapannya.",
  ],
  [
    "Graph Exploration, Pengenalan & Penelusuran dengan DFS dan BFS",
    "8 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Masuk ke dunia graf, salah satu struktur data paling penting dalam pemrograman lanjutan. Sesi ini akan mempelajari konsep dasar graf serta dua metode penelusuran utama, yaitu Depth-First Search (DFS) dan Breadth-First Search (BFS). Materi disampaikan secara visual melalui slide interaktif, dan langsung dilanjutkan dengan live coding bersama mentor untuk memahami implementasinya secara nyata.",
  ],
  [
    "Struktur Data Heap & Disjoint Set Union",
    "10 Juli 2025",
    "18.30 – 20.30 WIB | 2 Jam",
    "Sesi akan mengajarkan dua struktur data penting berbasis pohon, yaitu Heap yang sering digunakan untuk optimasi seperti priority queue dan Disjoint Set Union (DSU) yang efisien untuk manajemen kelompok dan penggabungan data. Materi akan disampaikan melalui slide interaktif, lalu langsung dipraktikkan lewat live coding bersama mentor agar kamu paham konsep dan implementasinya secara menyeluruh.",
  ],
  [
    "Pengenalan kepada Shortest Path dan Minimum Spanning Tree",
    "12 Juli 202",
    "18.30 – 20.30 WIB | 2 Jam",
    "Dalam sesi ini, kamu akan mengeksplorasi lebih lanjut dalam topik graf dengan mempelajari dua konsep penting, yaitu Shortest Path untuk menemukan jalur terpendek dan Minimum Spanning Tree (MST) untuk menghubungkan semua node dengan biaya minimum. Sesi ini juga akan mengaplikasikan struktur data seperti Heap dan DSU yang telah dipelajari sebelumnya.",
  ],
  [
    "Matematika untuk Programmer",
    "13 Juli 20255",
    "09.00 – 11.00 WIB | 2 Ja",
    "Pelajari berbagai konsep matematika dasar hingga menengah yang sering muncul dalam soal-soal programming, seperti modular arithmetic, kombinatorik, faktorisasi, hingga logika matematika. Materi disampaikan melalui slide interaktif, lalu dilanjutkan dengan live coding bersama mentor, dan peserta akan langsung mencoba mengerjakan soal juga. Di akhir sesi, Final Contest akan diumumkan sebagai tantangan utama untuk menerapkan seluruh kemampuan yang telah kamu pelajari.",
  ],
];
const CompetitiveProgramming = () => {
  return (
    <div className="flex flex-col items-center">
      <Hero hero={hero} />
      <EntryClassInfo classInfo={classInfo} />
      <SessionInfo sessions={sessions} />
    </div>
  );
};

export default CompetitiveProgramming;
