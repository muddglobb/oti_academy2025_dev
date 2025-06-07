import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { parse } from 'date-fns';
import { id } from 'date-fns/locale'; 
import axios from 'axios';
import jwt from 'jsonwebtoken';

dotenv.config();
const prisma = new PrismaClient();

function parseWIBDate(dateStr) {
  try {
    // Parse the date with Indonesian locale
    let parsed = parse(dateStr, 'd MMMM yyyy', new Date(), { locale: id });
    
    if (isNaN(parsed.getTime())) {
      // Fallback if Indonesian locale fails
      const [day, month, year] = dateStr.split(' ');
      const monthMap = {
        'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5,
        'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
      };
      
      parsed = new Date(parseInt(year), monthMap[month], parseInt(day));
    }
    
    // Set time to 00:00:00.000 WIB and store as-is (no UTC conversion)
    const wibDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 0, 0, 0, 0);
    
    // Return date as-is without UTC conversion
    // This will store 2025-06-30 00:00:00 in database (treated as local time)
    return wibDate;
  } catch (error) {
    console.error(`Failed to parse date: ${dateStr}`, error);
    // Return a default date (June 30, 2025 00:00 local time)
    return new Date(2025, 5, 30, 0, 0, 0, 0);
  }
}

// Generate service token for inter-service communication
function generateServiceToken() {
  const payload = {
    service: 'material-service',
    role: 'SERVICE'
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Fetch courses from course service
async function fetchCoursesFromCourseService() {
  console.log('🔍 Fetching courses from course-service...');
    // Try multiple potential service URLs
  const possibleServiceUrls = [
    process.env.COURSE_SERVICE_URL,
    'http://course-service-api:8002', 
  ].filter(Boolean); // Remove undefined values
  
  const serviceToken = generateServiceToken();
  let lastError = null;
  
  // Try each possible URL
  for (const baseUrl of possibleServiceUrls) {
    try {
      console.log(`Attempting to connect to course service at: ${baseUrl}`);
      
      const response = await axios.get(`${baseUrl}/courses`, {
        headers: {
          'Authorization': `Bearer ${serviceToken}`
        },
        timeout: 8000  // Increased timeout
      });
      
      if (response.data && response.data.data) {
        console.log(`✅ Successfully fetched ${response.data.data.length} courses from ${baseUrl}`);
        return response.data.data;
      }
      
      console.warn(`⚠ Invalid response format from ${baseUrl}`);
    } catch (error) {
      lastError = error;
      console.error(`❌ Failed to fetch courses from ${baseUrl}: ${error.message}`);
    }
  }
  
  // If we reached here, none of the URLs worked
  console.log('⚠ All connection attempts failed, falling back to hardcoded course IDs');
  console.log('⚠ WARNING: These IDs may not match your actual course database!');
  console.log('⚠ Consider manually updating the IDs in getHardcodedCourses() function');
  return getHardcodedCourses();
}

// Fallback function to use hardcoded course IDs
function getHardcodedCourses() {
  // These IDs should match the actual course IDs in your database
  // Format: { id: 'actual_db_id', title: 'exact_course_title' }
  // Important: The 'id' values should be string representations of the numeric IDs in your database
  return [
    { id: '1', title: 'Basic Python' },
    { id: '2', title: 'Competitive Programming' },
    { id: '3', title: 'Fundamental Cyber Security' },
    { id: '4', title: 'Game Development' },
    { id: '5', title: 'Graphic Design' },
    { id: '6', title: 'Web Development' },
    { id: '7', title: 'Software Engineering' },
    { id: '8', title: 'Data Science & Artificial Intelligence' },
    { id: '9', title: 'Cyber Security' },
    { id: '10', title: 'UI/UX' }
  ];
}

async function main() {
  console.log('🚀 Starting material seeding with upsert...');
  // Fetch all courses first
  const courses = await fetchCoursesFromCourseService();
  
  // Map courses by title for easy lookup
  const courseMap = {};
  courses.forEach(course => {
    courseMap[course.title] = course;
  });
  
  // Debug output of found courses
  console.log('📊 Course mapping summary:');
  console.log('---------------------------------------');
  Object.entries(courseMap).forEach(([title, course]) => {
    console.log(`✓ ${title} => ID: ${course.id}`);
  });
  console.log('---------------------------------------');

  const materialsData = [    // ---------- Basic Python ----------
    {
      courseTitle: 'Basic Python',
      items: [
        { 
          date: '30 Juni 2025', 
          title: 'Basic Python Workspace Setup', 
          description: 'Dalam sesi ini, kamu akan dapat video panduan lengkap menyiapkan workspace Python. Mulai instalasi tools yang dibutuhkan hingga menjalankan kode pertama, semua dijelaskan langkah demi langkah dengan jelas dan mudah diikuti, supaya kamu siap mulai belajar coding Python tanpa kendala.'
        },
        { 
          date: '1 Juli 2025', 
          title: 'Mempelajari Dasar-Dasar Python', 
          description: 'Masuk ke dunia pemrograman dengan Python. Pelajari sintaks dasar, output, komentar, variabel, tipe data, input pengguna, dan operasi matematika sederhana. Langsung praktik lewat mini assignment seru yang merangkum semua konsep dasar yang kamu pelajari.'
        },
        { 
          date: '2 Juli 2025', 
          title: 'Logika dan Kontrol Alur Program Python', 
          description: 'Sesi ini mengenalkan cara mengontrol alur program menggunakan operator logika, ekspresi kondisional serta perulangan. Selain itu, kamu juga akan mengeksplorasi cara manipulasi string dan indexing. Untuk memperdalam pemahaman, kamu akan membangun Password Validator dan berlatih pattern printing.'
        },
        { 
          date: '3 Juli 2025', 
          title: 'Struktur Data dan Fungsi Python', 
          description: 'Kenali berbagai struktur data seperti Array, List, Tuple, Set, dan Dictionary yang sangat penting dalam Python. Kamu juga akan mengenal fungsi dan scope dalam Python. Selain itu, cara mengimpor library dan menggunakan NumPy untuk perhitungan lebih kompleks.'
        },
        { 
          date: '7 Juli 2025', 
          title: 'Pengenalan OOP dan Pemrograman Berbasis Objek', 
          description: 'Masuki dunia Object-Oriented Programming (OOP) dan mulai menulis kode Python yang lebih rapi, terstruktur, dan mudah dikembangkan. Dalam sesi ini, kamu akan belajar konsep dasar seperti class, object, method, attribute, hingga method overloading & overriding.'
        },
        { 
          date: '8 Juli 2025', 
          title: 'Data Structures 101 Dari Linked List ke Tree', 
          description: 'Sesi ini akan memperkenalkan konsep dasar struktur data dan algoritma, seperti cara kerja Linked List dan Tree, serta bagaimana mengimplementasikannya menggunakan Python. Di akhir sesi, akan diumumkan detail Final Project yang akan menjadi tantangan utama dan penutup dari perjalanan belajar kamu.'
        },
        { 
          date: '9 Juli 2025', 
          title: 'Sesi Konsultasi', 
          description: 'Selama sesi, kamu bisa konsultasi langsung lewat Zoom dengan Teaching Assistant. Ruang konsultasi buka dari pagi sampai sore, jadi bisa tanya kapan saja dalam jam tersebut.'
        },
        { 
          date: '21 Juli 2025', 
          title: 'Pengumuman Top 3 Proyek', 
          description: 'Di sesi ini, kita akan mengumumkan Top 3 proyek terbaik dari final project yang telah dikumpulkan. Penilaian dilakukan berdasarkan tiga aspek utama: kualitas teknis, fitur yang berjalan baik, serta dokumentasi yang jelas.'
        }
      ]
    },
    // ---------- Competitive Programming ----------
    {
      courseTitle: 'Competitive Programming',
      items: [
        { 
          date: '25 Juni 2025', 
          title: 'Pengenalan Basic C++', 
          description: 'Sesi ini merupakan pembelajaran mandiri untuk memahami dasar-dasar C++. Materi dirancang untuk membantu peserta memahami sintaks dan konsep dasar C++ sehingga sesi tatap muka dapat langsung difokuskan pada strategi dan penyelesaian soal-soal kompetitif.'
        },
        { 
          date: '30 Juni 2025', 
          title: 'Pengenalan Pencarian & Pengurutan', 
          description: 'Pelajari dua konsep algoritma fundamental yang menjadi dasar penting dalam pemrograman dan pengembangan perangkat lunak, sebagai pondasi untuk mempelajari topik-topik lanjutan secara efektif.'
        },
        { 
          date: '2 Juli 2025', 
          title: 'Problem Solving 101 dengan Brute Force & Divide and Conquer', 
          description: 'Dalam sesi ini, kamu akan mempelajari dua strategi pemecahan masalah paling mendasar dalam algoritma. Brute Force sebagai teknik paling pasti dan langsung, serta Divide and Conquer untuk solusi yang lebih efisien dan terstruktur.'
        },        { 
          date: '4 Juli 2025',
          title: 'Greedy vs Dynamic Programming', 
          description: 'Pelajari bagaimana menyelesaikan masalah optimasi dengan Greedy, teknik cepat dan intuitif, serta pahami batasannya. Lalu kenali Dynamic Programming, solusi cerdas untuk kasus yang lebih kompleks dan tidak bisa diselesaikan dengan pendekatan greedy.'
        },
      { 
        date: '6 Juli 2025', 
        title: 'Mempelajari Struktur Data Dasar STL C++', 
        description: 'Kenali struktur data dasar yang paling sering digunakan dalam pemrograman: mulai dari vector, stack, queue, set, hingga map. Pelajari cara kerja, kapan digunakan, dan kenapa penting untuk efisiensi kode.'
      },
      { 
        date: '8 Juli 2025', 
        title: 'Graph Exploration, Pengenalan & Penelusuran dengan DFS dan BFS', 
        description: 'Masuk ke dunia graf, salah satu struktur data paling penting dalam pemrograman lanjutan. Sesi ini akan mempelajari konsep dasar graf serta dua metode penelusuran utama, yaitu Depth-First Search (DFS) dan Breadth-First Search (BFS).'
      },
      { 
        date: '10 Juli 2025', 
        title: 'Struktur Data Heap & Disjoint Set Union', 
        description: 'Sesi akan mengajarkan dua struktur data penting berbasis pohon, yaitu Heap yang sering digunakan untuk optimasi seperti priority queue dan Disjoint Set Union (DSU) yang efisien untuk manajemen kelompok dan penggabungan data.'
      },
      { 
        date: '12 Juli 2025', 
        title: 'Pengenalan kepada Shortest Path dan Minimum Spanning Tree', 
        description: 'Dalam sesi ini, kamu akan mengeksplorasi lebih lanjut dalam topik graf dengan mempelajari dua konsep penting, yaitu Shortest Path dan Minimum Spanning Tree (MST). Sesi ini juga akan mengaplikasikan struktur data seperti Heap dan DSU yang telah dipelajari sebelumnya.'
      },
      { 
        date: '13 Juli 2025', 
        title: 'Matematika untuk Programmer', 
        description: 'Pelajari berbagai konsep matematika dasar hingga menengah yang sering muncul dalam soal programming, seperti modular arithmetic, kombinatorik, hingga logika matematika. Di akhir sesi, Final Contest akan diumumkan sebagai tantangan utama untuk menerapkan seluruh kemampuan yang telah kamu pelajari.'
      }
    ]
  },
    // ---------- Web Development ----------
    {
      courseTitle: 'Web Development',
      items: [
        { 
          date: '1 Juli 2025', 
          title: 'Web Dasar tentang Struktur & Styling', 
          description: 'Mulai perjalanan coding dengan memahami dasar HTML & CSS. Pelajari elemen penting seperti header, section, footer, dan hias tampilan dengan CSS. Langsung praktik lewat mini challenge membuat layout profil sederhana dengan cara seru dan kuasai struktur serta styling web.'
        },
        { 
          date: '2 Juli 2025', 
          title: 'Mempelajari Layouting dan Responsive Design', 
          description: 'Pelajari cara menyusun tampilan web yang rapi dan fleksibel dengan memahami konsep Box Model: margin, padding, dan border. Lanjutkan ke Flexbox untuk membuat layout dinamis dan terstruktur. Kamu juga akan membuat membuat desain responsif yang otomatis.'
        },
        { 
          date: '3 Juli 2025', 
          title: 'Mengenal JavaScript Dasar', 
          description: 'Sesi ini mengenalkan dasar JavaScript untuk membuat web interaktif. Kamu belajar variabel, tipe data, operator, fungsi, conditional, dan loop. Lalu praktik manipulasi DOM untuk mengubah elemen halaman dan membuat tombol interaktif sebagai latihan logika dan fungsionalitas.'
        },
        { 
          date: '6 Juli 2025', 
          title: 'Introduction to React.js', 
          description: 'Dalam sesi ini, kamu akan mulai membangun UI interaktif dengan React dengan membahas konsep dasar seperti komponen, JSX, dan props, kemudian lanjut ke hooks. Lanjut praktik membuat komponen kartu produk, lengkap dengan tombol interaktif yang bisa mengubah tampilannya secara real-time.'
        },
        { 
          date: '7 Juli 2025', 
          title: 'Mempelajari Styling Modern dengan Tailwind & Material UI', 
          description: 'Kenalan dengan dua cara populer mempercantik tampilan React: Tailwind CSS dan Material UI. Pelajari utility-first CSS di Tailwind, styling efisien, serta setup dan eksplorasi komponen MUI. Praktik langsung bikin dua versi kartu produk dan bandingkan kelebihan keduanya.'
        },
        { 
          date: '10 Juli 2025', 
          title: 'Live Coding Session', 
          description: 'Dalam sesi ini, kamu akan gabungkan semua materi sebelumnya lewat live coding. Kita bangun halaman web lengkap dengan komponen modular. Sesi ini juga jadi pondasi Final Project sekaligus pengumuman tema dan tantangan yang harus diselesaikan nanti.'
        },
        { 
          date: '11 Juli 2025', 
          title: 'Sesi Konsultasi', 
          description: 'Selama sesi, kamu bisa konsultasi langsung lewat Zoom dengan Teaching Assistant. Ruang konsultasi buka dari pagi sampai sore, jadi bisa tanya kapan saja dalam jam tersebut.'
        }
      ]
    },
    // ---------- Fundamental Cyber Security ----------
    {
      courseTitle: 'Fundamental Cyber Security',
      items: [
        { 
          date: '30 Juni 2025', 
          title: 'Mengenal Dasar Linux dan Terminal', 
          description: 'Dalam sesi ini, kamu akan mempelajari perintah dasar Linux seperti ls, cd, cat, serta cara berpindah direktori dan menggunakan man untuk dokumentasi. Sesi ini akan membantumu memahami cara navigasi dan eksplorasi lewat terminal.'
        },
        { 
          date: '2 Juli 2025', 
          title: 'Dasar Digital Forensics', 
          description: 'Masuki dunia forensik digital dengan teknik dasar untuk mengungkap data tersembunyi. Pelajari perintah Linux seperti strings dan exiftool, analisis file populer, hingga eksplorasi jaringan dengan Wireshark. Selain itu, kenali konsep steganografi untuk sembunyikan pesan rahasia.'
        },
        { 
          date: '5 Juli 2025', 
          title: 'Mempelajari Fundamental dari Web Exploitation', 
          description: 'Pelajari teknik dasar eksploitasi web yang umum di pengujian keamanan. Pahami cara kerja Burp Suite, celah XSS, dan risiko upload file. Praktik langsung di platform PortSwigger untuk mengenal pola serangan nyata yang sering ditemui di dunia industri.'
        },
        { 
          date: '7 Juli 2025', 
          title: 'Dasar-dasar Cryptography', 
          description: 'Dalam sesi ini, kamu akan membahas konsep dasar kriptografi, termasuk perbedaan antara enkripsi simetris dan asimetris. Kamu juga akan berlatih menyelesaikan tantangan di platform Cryptohack untuk memahami bagaimana teknik kriptografi digunakan dalam keamanan data secara nyata.'
        },
        { 
          date: '10 Juli 2025', 
          title: 'Pengenalan OSINT dan Web Scraping', 
          description: 'Kamu akan belajar dasar OSINT (Open Source Intelligence), yaitu teknik mengumpulkan informasi dari sumber terbuka di internet. Pelajari alat-alat OSINT untuk menggali data secara efektif dan kenali dasar web scraping untuk mengekstrak data dari situs secara otomatis.'
        },
        { 
          date: '13 Juli 2025', 
          title: 'CTF Practice dan Persiapan Final Project', 
          description: 'Di sesi ini, kamu akan mengenal CTF (Capture The Flag), alur kompetisinya, dan cara ikut serta. Latihan langsung lewat picoCTF untuk mengasah skill hacking dan problem solving. Di akhir sesi, final project diumumkan untuk menerapkan semua yang telah dipelajari.'
        },
        { 
          date: '15 Juli 2025', 
          title: 'Sesi Konsultasi', 
          description: 'Selama sesi, kamu bisa konsultasi langsung lewat Zoom dengan Teaching Assistant. Ruang konsultasi buka dari pagi sampai sore, jadi bisa tanya kapan saja dalam jam tersebut.'
        }
      ]
    },
    // ---------- Game Development ----------
    {
      courseTitle: 'Game Development',
      items: [
        { 
          date: '30 Juni 2025', 
          title: 'Mengenal Dasar Game Development dan Game Design', 
          description: 'Mulai petualangan di dunia game dengan memahami dasar desain game. Pelajari bagaimana game dibangun dari konsep hingga jadi pengalaman interaktif. Tuangkan ide kreatifmu ke dalam Game Design Document (GDD) sebagai panduan penting sebelum mulai ngoding game.'
        },
        { 
          date: '1 Juli 2025', 
          title: 'Pengenalan MDA Framework', 
          description: 'Sesi ini membahas MDA Framework (Mechanics, Dynamics, Aesthetics) sebagai pendekatan untuk merancang pengalaman bermain yang menarik. Kamu akan belajar bagaimana framework ini membantu menyusun desain game yang lebih terarah dan efektif.'
        },
        { 
          date: '3 Juli 2025', 
          title: 'GDevelop dan Pembuatan Game Dasar', 
          description: 'Dalam sesi ini, kamu akan dikenalkan pada GDevelop yaitu software no-code untuk membuat game 2D. Kamu akan belajar membuat elemen dasar seperti event, movement, sprites, tiles, UI, dan object, serta langsung mempraktekkannya lewat tugas pembuatan Game Prototype I.'
        },
        { 
          date: '4 Juli 2025', 
          title: 'Pendalaman Sistem Event di GDevelop', 
          description: 'Sesi ini akan mengajak kamu memahami lebih dalam bagaimana sistem event di GDevelop bekerja. Fokus utama mencakup pengelolaan waktu, perubahan state objek, dan penerapan physics untuk menciptakan interaksi yang lebih realistis dan dinamis dalam game.'
        },
        { 
          date: '5 Juli 2025', 
          title: 'Persiapan GameJam', 
          description: 'Kenali konsep GameJam sebagai ajang kolaboratif untuk menciptakan game dalam waktu terbatas. Kamu akan mempelajari bagaimana alur kerja, roadmap dan timelinnya. Di akhir sesi, Final Project akan diumumkan sebagai tantangan utama untuk menerapkan seluruh kemampuan yang telah kamu pelajari.'
        },
        { 
          date: '9 Juli 2025', 
          title: 'Sesi Konsultasi', 
          description: 'Selama sesi, kamu bisa konsultasi langsung lewat Zoom dengan Teaching Assistant. Ruang konsultasi buka dari pagi sampai sore, jadi bisa tanya kapan saja dalam jam tersebut.'
        },
        { 
          date: '11 Juli 2025', 
          title: 'Sesi Konsultasi', 
          description: 'Selama sesi, kamu bisa konsultasi langsung lewat Zoom dengan Teaching Assistant. Ruang konsultasi buka dari pagi sampai sore, jadi bisa tanya kapan saja dalam jam tersebut.'
        }
      ]
    },
    // ---------- Graphic Design ----------
    {
      courseTitle: 'Graphic Design',
      items: [
        { 
          date: '30 Juni 2025', 
          title: 'Intro to Graphic Design & Visual Principles', 
          description: 'Pelajari elemen-elemen visual penting seperti garis, bentuk, warna, tekstur, dan ruang yang menjadi kunci desain menarik dan efektif. Dalam sesi ini, kamu akan menganalisis desain nyata untuk memahami perbedaan antara desain yang eye-catching dan yang kurang efektif.'
        },
        { 
          date: '2 Juli 2025', 
          title: 'Mengenal Tipografi dan Komposisi Layout', 
          description: 'Pada sesi ini, kamu akan mempelajari dasar-dasar tipografi dan layout dalam desain grafis. Kamu akan belajar berbagai jenis font serta konsep hierarchy. Selain itu, kamu juga akan mempelajari prinsip-prinsip layout seperti grid system, alignment, dan margin yang efektif.'
        },
        { 
          date: '4 Juli 2025', 
          title: 'Color in Design: Meaning, Strategy & Accessibility', 
          description: 'Sesi ini membahas peran penting warna dalam desain, mulai dari maknanya terhadap emosi dan persepsi hingga penerapannya dalam strategi branding. Kamu juga akan memahami pentingnya kontras dan aksesibilitas dalam desain visual, serta mengenal tools untuk memastikan desain ramah bagi semua pengguna.'
        },
        { 
          date: '7 Juli 2025', 
          title: 'Pengenalan ke Media Sosial dan Desain Kampanye Digital', 
          description: 'Sesi ini mengenalkan prinsip dasar visual storytelling untuk menyampaikan pesan secara efektif dan menarik. Kamu akan diajarkan cara menyusun informasi dengan runtut, menjaga konsistensi visual, serta menempatkan Call-to-Action (CTA) yang tepat agar audiens makin tergerak.'
        },
        { 
          date: '9 Juli 2025', 
          title: 'Mempelajari Branding & Visual Identity', 
          description: 'Sesi ini mengenalkan konsep identitas visual, mulai dari perbedaan antara logo, wordmark, ikon, dan simbol. Kamu akan belajar membangun konsistensi gaya melalui pemilihan warna, font, dan tone visual. Lewat studi kasus, kamu akan memahami penerapan identitas visual secara nyata.'
        },
        { 
          date: '11 Juli 2025', 
          title: 'Mockup & Design Presentation', 
          description: 'Pelajari cara memukau dengan menampilkan desainmu dalam berbagai mockup keren. Selain itu, kuasai teknik menyusun presentasi desain yang jelas, terstruktur, dan penuh daya tarik, lengkap dengan narasi visual. Di akhir sesi, Final Project akan diumumkan sebagai tantangan utama untuk menerapkan seluruh kemampuan yang telah kamu pelajari.'
        },
        { 
          date: '15 Juli 2025', 
          title: 'Sesi Konsultasi', 
          description: 'Selama sesi, kamu bisa konsultasi langsung lewat Zoom dengan Teaching Assistant. Ruang konsultasi buka dari pagi sampai sore, jadi bisa tanya kapan saja dalam jam tersebut.'
        }
      ]
    },
    // ---------- Data Science & AI ----------
    {
      courseTitle: 'Data Science & Artificial Intelligence',
      items: [
        { 
          date: '30 Juni 2025', 
          title: 'DSAI Workspace Setup (Video)', 
          description: 'Sesi ini merupakan pembelajaran mandiri yang dirancang untuk membantu peserta menyiapkan lingkungan kerja menggunakan Kaggle. Materi mencakup cara membuat akun, mengenal antarmuka Kaggle, serta mengatur file dan notebook yang akan digunakan selama program.'
        },
        { 
          date: '14 Juli 2025', 
          title: 'Langkah Awal di Dunia Data Science & AI', 
          description: 'Mulai perjalananmu di dunia Data Science & AI dengan sesi pembuka yang seru dan penuh wawasan. Di sini kamu akan mengenal konsep dasar DSAI, memahami alur kerjanya, dan belajar menggunakan library penting seperti Pandas dan Matplotlib.'
        },
        { 
          date: '15 Juli 2025', 
          title: 'Pengenalan Machine Learning', 
          description: 'Pada sesi ini, kamu akan membahas konsep dasar Machine Learning, termasuk supervised dan unsupervised learning. Peserta akan mempelajari regresi, klasifikasi, regresi linear, serta klasterisasi menggunakan K-means.'
        },
        { 
          date: '16 Juli 2025', 
          title: 'Membongkar Algoritma & Teknik Canggih Machine Learning', 
          description: 'Tingkatkan skill Machine Learning dengan teknik canggih seperti stacking dan algoritma populer K-Nearest Neighbour, Decision Tree, serta Random Forest. Di sesi ini, kamu juga akan langsung memulai kompetisi Kaggle dan praktik dengan data mentah untuk memperkuat kemampuan nyata.'
        },
        { 
          date: '22 Juli 2025', 
          title: 'Selami Dunia Deep Learning dari Fondasi sampai Aplikasinya', 
          description: 'Sesi ini memberikan pemahaman dasar tentang Deep Learning, mencakup definisi, perbedaan dengan Machine Learning tradisional, serta konsep dasar seperti neuron, layers, weights, dan fungsi aktivasi. Termasuk juga demo singkat membangun jaringan saraf sederhana menggunakan Keras dengan pendekatan Sequential.'
        },
        { 
          date: '23 Juli 2025', 
          title: 'Dari Kata ke Kode, Petualangan di Dunia Natural Language Processing (NLP)', 
          description: 'Mulai petualanganmu di dunia Natural Language Processing (NLP) dengan mengenal teknik dasar yang membuat komputer bisa "mengerti" bahasa manusia. Kamu akan mempelajari cara membersihkan teks, seperti mengubah huruf besar ke kecil, menghapus stopwords, dan tokenisasi.'
        },
        { 
          date: '24 Juli 2025', 
          title: 'Representasi Teks dan Klasifikasi dalam NLB', 
          description: 'Sesi ini membahas cara mempresentasikan teks dalam bentuk nemurik menggunakan metode Bag of Words dan TF-IDF. Peserta akan belajar melatih model klasifikasi teks sederhana untuk deteksi spam, dengan studi kasus menggunakan algoritma Naive Bayes.'
        },
        { 
          date: '25 Juli 2025', 
          title: 'Computer Vision 101 dengan Convolutional Neural Networks (CNN)', 
          description: 'Jelajahi dunia di mana komputer bisa "melihat" dan mengenali gambar seperti manusia. Di sesi ini, kamu akan memahami rahasia di balik penglihatan mesin lewat konsep Computer Vision dan kekuatan Convolutional Neural Networks (CNN). Selain itu, di sesi ini akan diumumkan pemenang kompetisi Kaggle.'
        },
        { 
          date: '26 Juli 2025', 
          title: 'Rapat Teknis untuk Presentasi Final Round', 
          description: 'Sesi persiapan teknis untuk final round presentation! Dalam rapat ini, kamu akan mendapatkan briefing lengkap tentang format presentasi, timeline, kriteria penilaian, dan ekspektasi untuk final round.'
        },
        { 
          date: '28 Juli 2025', 
          title: 'Presentasi Final Round', 
          description: 'Saatnya showcase kemampuan Data Science & AI-mu di hadapan panel juri! Dalam final round ini, kamu akan mempresentasikan complete project mulai dari problem statement, data analysis process, model development, hingga insights dan recommendations.'
        }
      ]
    },
    // ---------- UI/UX ----------
    {
      courseTitle: 'UI/UX',
      items: [
        { 
          date: '17 Juli 2025', 
          title: 'Dari Ide ke Rencana, Kenali Design Brief dan Dokumen Proyek', 
          description: 'Mulai langkah penting dalam manajemen proyek dengan memahami cara menyusun Project Requirement Document (PRD) dan Design Brief. Sesi ini akan membimbing kamu mengubah PRD menjadi Design Brief yang jelas dan terarah, serta mengaplikasikan dokumen-dokumen tersebut.'
        },
        { 
          date: '18 Juli 2025', 
          title: 'Menggali Kebutuhan Pengguna dengan Wawancara Efektif', 
          description: 'Masuki dunia pengguna dengan teknik wawancara yang lebih dari sekadar tanya jawab. Pelajari cara menggali kebutuhan dan motivasi mereka, serta hubungkan hasilnya dengan Hook Model dan Mental Models untuk memahami perilaku secara mendalam dan ciptakan solusi yang tepat.'
        },
        { 
          date: '19 Juli 2025', 
          title: 'Berkreasi dengan How Might We dan Storyboard untuk Solusi User', 
          description: 'Sesi ini akan membawamu ke dunia eksplorasi ide, Kamu akan belajar bagaimana menggali solusi inovatif lewat generative design dan memetakan skenario nyata dengan scenario mapping. Kamu bukan hanya menemukan ide, tapi juga merancang pengalaman pengguna yang hidup dan berdampak.'
        },
        { 
          date: '20 Juli 2025', 
          title: 'Desain Bermakna Menciptakan Produk yang Dipakai dan Menguntungkan', 
          description: 'Saatnya melihat desain sebagai kekuatan strategis yang mendorong inovasi dan pertumbuhan bisnis. Di sesi ini, kamu akan belajar bagaimana UX terintegrasi dengan marketing, teknologi, dan tujuan bisnis untuk menciptakan solusi yang berdampak.'
        },
        { 
          date: '24 Juli 2025', 
          title: 'Membawa Ide ke Layar dengan Low-fi dan Hi-fi', 
          description: 'Sesi ini akan membawamu menyusuri proses visualisasi ide, mulai dari Low-Fidelity hingga High-Fidelity. Kamu akan belajar membuat wireframe dan prototype sebagai alat penting untuk menguji dan menyempurnakan ide sebelum masuk tahap pengembangan.'
        },
        { 
          date: '25 Juli 2025', 
          title: 'Psikologi di Balik Desain Hebat', 
          description: 'Desain hebat bukan hanya soal estetika, tapi juga soal memahami bagaimana manusia berpikir dan bertindak. Di sesi ini, kamu akan mempelajari UX Laws, prinsip-prinsip psikologis yang menjadi dasar mengapa desain tertentu terasa intuitif, cepat dipahami, dan menyenangkan digunakan.'
        },
        { 
          date: '26 Juli 2025', 
          title: 'Mengukur Pengalaman dari Feedback ke Insight', 
          description: 'Sesi ini mengajak kamu menguak rahasia di balik pengalaman pengguna yang mulus dan memuaskan. Kamu akan belajar cara melakukan pengujian yang tepat untuk mengukur seberapa mudah dan efektif produk digunakan, serta menggunakan metode seperti System Usability Score (SUS) dan Heuristic Analysis.'
        },
        { 
          date: '27 Juli 2025', 
          title: 'Membuat Desain Terlihat dan Dirasakan Semua', 
          description: 'Pada sesi ini, kamu akan mempelajari tentang pentingnya menciptakan desain yang aksesibel dan inklusif. Selain itu, kamu juga akan belajar teknik UX pitching yang powerful untuk menyampaikan ide desain dengan meyakinkan ke klien dan tim.'
        },
        { 
          date: '28 Juli 2025', 
          title: 'Mentoring Final Project', 
          description: 'Selama sesi, kamu bisa konsultasi langsung lewat Zoom dengan Teaching Assistant. Ruang konsultasi buka dari pagi sampai sore, jadi bisa tanya kapan saja dalam jam tersebut.'
        }
      ]
    },
    // ---------- Software Engineering ----------
    {
      courseTitle: 'Software Engineering',
      items: [
        { 
          date: '16 Juli 2025', 
          title: 'Pengenalan Tech Stack', 
          description: 'Di sesi ini, kamu akan diajak mengenal teknologi-teknologi keren yang jadi tulang punggung proyek, mulai dari Next.js hingga Prisma dan Tailwind CSS. Kamu akan memahami peran penting masing-masing tools, alasan kenapa mereka dipilih, serta bagaimana semuanya bersinergi.'
        },
        { 
          date: '17 Juli 2025', 
          title: 'Memahami React Hooks dan Pengelolaan Data', 
          description: 'Masuk ke inti React dengan menguasai lifecycle dan Hooks yang jadi kunci bikin aplikasi kamu hidup dan responsif. Kamu akan belajar cara pakai useState, useEffect, dan teknik pengelolaan data asinkron yang membuat aplikasi mampu menangani perubahan secara real-time.'
        },
        { 
          date: '18 Juli 2025', 
          title: 'Mendalami Arsitektur Next.js: Routing, API, dan Middleware', 
          description: 'Sesi ini membawa kamu menjelajahi struktur folder dan sistem routing di Next.js yang powerful dan fleksibel. Kamu akan mempelajari cara membuat API Routes untuk backend ringan, memahami peran Middleware dalam mengelola request, serta menguasai Dynamic Routes untuk membangun aplikasi yang dinamis.'
        },
        { 
          date: '19 Juli 2025', 
          title: 'Kode Cerdas dengan TypeScript', 
          description: 'Kuak rahasia membuat kode lebih kuat, rapi, dan bebas bug dengan TypeScript yang semakin populer di kalangan developer profesional. Di sesi ini, kamu akan diajak memahami konsep dasar seperti type inference, type aliases, interface, narrowing, dan type assertion dengan cara yang mudah dan aplikatif.'
        },
        { 
          date: '22 Juli 2025', 
          title: 'Rahasia Autentikasi Mulus untuk Aplikasi Next.js', 
          description: 'Bangun sistem autentikasi canggih dan seamless yang siap melindungi aplikasi kamu. Di sesi ini, kamu akan belajar langkah demi langkah membuat halaman login dan registrasi menggunakan Clerk atau Kinde di Next.js.'
        },
        { 
          date: '23 Juli 2025', 
          title: 'Membangun Fondasi Data Kuat dengan Prisma', 
          description: 'Bangun pondasi aplikasi yang tangguh melalui penguasaan Prisma ORM. Di sesi ini, kamu akan belajar mengatur database dari awal, membuat schema, menjalankan migrasi, dan melakukan operasi CRUD secara efisien. Kamu juga akan mengintegrasikan Prisma dengan API Route Handlers untuk membangun endpoint CRUD Notes.'
        },
        { 
          date: '26 Juli 2025', 
          title: 'Mentoring Final Project', 
          description: 'Selama sesi, kamu bisa konsultasi langsung lewat Zoom dengan Teaching Assistant. Ruang konsultasi buka dari pagi sampai sore, jadi bisa tanya kapan saja dalam jam tersebut.'
        }
      ]
    },
    // ---------- Cyber Security (Advanced) ----------
    {
      courseTitle: 'Cyber Security',
      items: [
        { 
          date: '16 Juli 2025', 
          title: 'Pengenalan Penetration Testing dan Pre-Engagement', 
          description: 'Masuki dunia siber dari sisi penyerang dan pelajari bagaimana para ethical hacker merancang langkah demi langkah untuk menembus sistem secara legal. Sesi ini akan membekali kamu dengan dasar-dasar penetration testing, mulai dari rules of engagement, alur kerja pentest, hingga eksplorasi HackTheBox sebagai medan latihan digital.'
        },
        { 
          date: '17 Juli 2025', 
          title: 'Menembus Permukaan, Seni Enumeration dalam Dunia Siber', 
          description: 'Langkah awal yang menentukan dalam ethical hacking dimulai dari seberapa dalam kamu bisa menggali informasi target. Kamu akan mempelajari teknik enumerasi untuk mengungkap layanan tersembunyi dan celah potensial dalam sistem, khususnya pada SMB dan Windows. Kamu juga akan menggunakan tools andalan seperti smbclient, dan enum4linux.'
        },
        { 
          date: '18 Juli 2025', 
          title: 'Identifikasi Kerentanan Sebelum Menyerang', 
          description: 'Di sesi ini, kamu akan diajak menyelami proses identifikasi kerentanan, mulai dari web view analysis untuk menangkap pola dan anomali, hingga penggunaan automated scanners yang mempercepat deteksi celah keamanan. Sesi ini akan melatih insting analisismu agar lebih tajam dalam membaca potensi eksploitasi di sistem target.'
        },
        { 
          date: '23 Juli 2025', 
          title: 'Metasploit dan Seni Menguasai Sistem', 
          description: 'Sesi ini membawa kamu langsung ke inti serangan dengan eksplorasi eksploitasi sistem bersama mentor ahli. Kamu akan belajar menggunakan Metasploit untuk menjalankan serangan canggih, memahami berbagai jenis shells dan payloads, serta menguasai teknik eksploitasi celah keamanan pada aplikasi web.'
        },
        { 
          date: '24 Juli 2025', 
          title: 'Escalating Privilege', 
          description: 'Setelah berhasil masuk sistem, pelajari teknik privilege escalation untuk menguasai hak akses di Linux dan Windows. Dapat bimbingan mentor ahli serta dalami reverse shells untuk menjaga kontrol dan membuka pintu masuk tersembunyi secara efektif.'
        },
        { 
          date: '25 Juli 2025', 
          title: 'Menguasai Jejak Digital dan Final Challenge', 
          description: 'Setelah menguasai jaringan target lewat pivoting dan tunneling, pelajari cara menyusun laporan penetration testing profesional. Di sesi ini juga diumumkan final project sebagai tantangan nyata untuk menguji kemampuan ethical hackingmu.'
        },
        { 
          date: '26 Juli 2025', 
          title: 'Mentoring Final Project', 
          description: 'Selama sesi, kamu bisa konsultasi langsung lewat Zoom dengan Teaching Assistant. Ruang konsultasi buka dari pagi sampai sore, jadi bisa tanya kapan saja dalam jam tersebut.'
        },
        { 
          date: '27 Juli 2025', 
          title: 'Mentoring Final Project', 
          description: 'Selama sesi, kamu bisa konsultasi langsung lewat Zoom dengan Teaching Assistant. Ruang konsultasi buka dari pagi sampai sore, jadi bisa tanya kapan saja dalam jam tersebut.'
        }
      ]
    }
  ];

  let successCount = 0;
  let skipCount = 0;

  for (const group of materialsData) {
    const course = courseMap[group.courseTitle];
    if (!course) {
      console.warn(`⚠ Course not found: ${group.courseTitle}, skipped`);
      skipCount++;
      continue;
    }

    for (const item of group.items) {
      try {        // Convert the date string to a proper Date object
        const unlockDate = parseWIBDate(item.date);
        console.log(`Debug: Parsed date for ${item.title} - ${item.date} => ${unlockDate.toISOString()} (00:00 WIB converted to UTC)`);
        await prisma.material.upsert({
          where: { 
            courseId_title: { 
              courseId: course.id, 
              title: item.title 
            } 
          },
          update: {
            description: item.description,
            unlockDate: unlockDate,
            resourceUrl: 'https://example.com/dummy-link'
          },
          create: {
            courseId: course.id,
            title: item.title,
            description: item.description,
            unlockDate: unlockDate,
            resourceUrl: 'https://example.com/dummy-link'
          }
        });
        console.log(`✅ Seeded: ${group.courseTitle} - ${item.title}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error seeding ${group.courseTitle} - ${item.title}: ${error.message}`);
      }
    }
  }

  await prisma.$disconnect();
  console.log(`🎉 Material seeding completed! (${successCount} items seeded, ${skipCount} courses skipped)`);
}

main().catch((e) => {
  console.error(`❌ Seed failed: ${e.message}`);
  process.exit(1);
});
