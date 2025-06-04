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
    
    // Set time to 00:00:00.000 in WIB (UTC+7)
    // Since we want 00:00 WIB to be stored as UTC, we need to subtract 7 hours
    const wibDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 0, 0, 0, 0);
    
    // Convert WIB to UTC by subtracting 7 hours (7 * 60 * 60 * 1000 = 25200000 ms)
    const utcDate = new Date(wibDate.getTime() - (7 * 60 * 60 * 1000));
    
    return utcDate;
  } catch (error) {
    console.error(`Failed to parse date: ${dateStr}`, error);
    // Return a default date if parsing fails (June 30, 2025 00:00 WIB converted to UTC)
    const defaultWibDate = new Date(2025, 5, 30, 0, 0, 0, 0);
    return new Date(defaultWibDate.getTime() - (7 * 60 * 60 * 1000));
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
      
      console.warn(`⚠️ Invalid response format from ${baseUrl}`);
    } catch (error) {
      lastError = error;
      console.error(`❌ Failed to fetch courses from ${baseUrl}: ${error.message}`);
    }
  }
  
  // If we reached here, none of the URLs worked
  console.log('⚠️ All connection attempts failed, falling back to hardcoded course IDs');
  console.log('⚠️ WARNING: These IDs may not match your actual course database!');
  console.log('⚠️ Consider manually updating the IDs in getHardcodedCourses() function');
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

  const materialsData = [
    // ---------- Basic Python ----------
    {
      courseTitle: 'Basic Python',
      items: [
        { 
          date: '30 Juni 2025', 
          title: 'Basic Python Workspace Setup', 
          description: 'Dalam sesi ini, kamu akan mendapatkan video panduan lengkap tentang cara menyiapkan workspace Python-mu sendiri. Mulai dari instalasi tools yang dibutuhkan hingga menjalankan kode pertamamu, semua dijelaskan langkah demi langkah!'
        },
        { 
          date: '1 Juli 2025', 
          title: 'Mempelajari Dasar-Dasar Python', 
          description: 'Masuk ke inti dunia pemrograman bareng Python! Dalam sesi ini, kamu akan belajar menulis kode pertamamu, memahami sintaks dasar, mencetak output, menulis komentar, serta mengenal variabel, tipe data, input pengguna, dan operasi matematika sederhana. Langsung praktik lewat mini assignment seru yang merangkum semua konsep dasar yang kamu pelajari.'
        },
        { 
          date: '2 Juli 2025', 
          title: 'Logika dan Kontrol Alur Program Python', 
          description: 'Sesi ini mengenalkan cara mengontrol alur program menggunakan operator logika, ekspresi kondisional (if, nested if), serta perulangan (for & while). Selain itu, kamu juga akan mengeksplorasi cara manipulasi string dan indexing. Untuk memperdalam pemahaman, kamu akan membangun Password Validator dan berlatih pattern printing.'
        },
        { 
          date: '3 Juli 2025', 
          title: 'Struktur Data dan Fungsi Python', 
          description: 'Kenali berbagai struktur data seperti Array, List, Tuple, Set, dan Dictionary yang sangat penting dalam Python. Dalam sesi ini, kamu juga akan mengenal fungsi dan scope dalam Python. Selain itu, kamu akan belajar cara mengimpor library dan menggunakan NumPy untuk perhitungan lebih kompleks. Semua konsep ini akan langsung kamu terapkan dalam studi kasus nyata.'
        },
        { 
          date: '7 Juli 2025', 
          title: 'Pengenalan OOP dan Pemrograman Berbasis Objek', 
          description: 'Masuki dunia Object-Oriented Programming (OOP) dan mulai menulis kode Python yang lebih rapi, terstruktur, dan mudah dikembangkan. Dalam sesi ini, kamu akan belajar konsep dasar seperti class, object, method, attribute, hingga method overloading & overriding. OOP adalah fondasi penting untuk membangun program berskala besar dan profesional dan sesi ini akan jadi langkah awalmu ke arah sana.'
        },
        { 
          date: '8 Juli 2025', 
          title: 'Data Structures 101 Dari Linked List ke Tree', 
          description: 'Sesi ini akan memperkenalkan konsep dasar struktur data dan algoritma, kamu akan mempelajari cara kerja Linked List dan Tree, serta bagaimana mengimplementasikannya menggunakan Python. Untuk memperdalam pemahaman, kamu akan membangun Organization Tree sebagai studi kasus nyata. Di akhir sesi, akan diumumkan detail Final Project yang akan menjadi tantangan utama dan penutup dari perjalanan belajar kamu.'
        },
        { 
          date: '8 Juli 2025', 
          title: 'Sesi Konsultasi', 
          description: 'Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari pagi hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.'
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
        description: 'Sesi ini merupakan pembelajaran mandiri untuk memahami dasar-dasar C++ yang menjadi prasyarat sebelum memasuki materi utama Competitive Programming. Materi dirancang untuk membantu peserta memahami sintaks dan konsep dasar C++ sehingga sesi tatap muka dapat langsung difokuskan pada strategi dan penyelesaian soal-soal kompetitif.'
      },
      { 
        date: '30 Juni 2025', 
        title: 'Pengenalan Pencarian & Pengurutan', 
        description: 'Pelajari dua konsep algoritma fundamental yang menjadi fondasi banyak topik lanjutan di pemrograman dan pengembangan perangkat lunak. Sesi ini akan dimulai dengan pemahaman mendalam melalui slide interaktif, lalu dilanjutkan dengan latihan langsung (live coding) bersama mentor.'
      },
      { 
        date: '2 Juli 2025', 
        title: 'Problem Solving 101 dengan Brute Force & Divide and Conquer', 
        description: 'Dalam sesi ini, kamu akan mempelajari dua strategi pemecahan masalah paling mendasar dalam algoritma. Brute Force sebagai teknik paling pasti dan langsung, serta Divide and Conquer untuk solusi yang lebih efisien dan terstruktur. Materi disampaikan melalui slide interaktif, dilanjutkan dengan live coding bareng mentor untuk langsung praktik.'
      },
      { 
        date: '4 Juli 2025', 
        title: 'Greedy vs Dynamic Programming', 
        description: 'Pelajari bagaimana menyelesaikan masalah optimasi dengan Greedy, teknik cepat dan intuitif, serta pahami batasannya. Lalu kenali Dynamic Programming, solusi cerdas untuk kasus yang lebih kompleks dan tidak bisa diselesaikan dengan pendekatan greedy. Materi akan dipaparkan melalui slide interaktif, lalu dilanjutkan dengan live coding bersama mentor untuk langsung memahami penerapannya.'
      },
      { 
        date: '6 Juli 2025', 
        title: 'Mempelajari Struktur Data Dasar STL C++', 
        description: 'Kenali struktur data dasar yang paling sering digunakan dalam pemrograman: mulai dari vector, stack, queue, set, hingga map. Pelajari cara kerja, kapan digunakan, dan kenapa penting untuk efisiensi kode. Materi disampaikan lewat slide interaktif, kemudian langsung dipraktikkan lewat live coding bersama mentor agar kamu makin paham penerapannya.'
      },
      { 
        date: '8 Juli 2025', 
        title: 'Graph Exploration, Pengenalan & Penelusuran dengan DFS dan BFS', 
        description: 'Masuk ke dunia graf, salah satu struktur data paling penting dalam pemrograman lanjutan. Sesi ini akan mempelajari konsep dasar graf serta dua metode penelusuran utama, yaitu Depth-First Search (DFS) dan Breadth-First Search (BFS). Materi disampaikan secara visual melalui slide interaktif, dan langsung dilanjutkan dengan live coding bersama mentor untuk memahami implementasinya secara nyata.'
      },
      { 
        date: '10 Juli 2025', 
        title: 'Struktur Data Heap & Disjoint Set Union', 
        description: 'Sesi akan mengajarkan dua struktur data penting berbasis pohon, yaitu Heap yang sering digunakan untuk optimasi seperti priority queue dan Disjoint Set Union (DSU) yang efisien untuk manajemen kelompok dan penggabungan data. Materi akan disampaikan melalui slide interaktif, lalu langsung dipraktikkan lewat live coding bersama mentor agar kamu paham konsep dan implementasinya secara menyeluruh.'
      },
      { 
        date: '12 Juli 2025', 
        title: 'Pengenalan kepada Shortest Path dan Minimum Spanning Tree', 
        description: 'Dalam sesi ini, kamu akan mengeksplorasi lebih lanjut dalam topik graf dengan mempelajari dua konsep penting, yaitu Shortest Path untuk menemukan jalur terpendek dan Minimum Spanning Tree (MST) untuk menghubungkan semua node dengan biaya minimum. Sesi ini juga akan mengaplikasikan struktur data seperti Heap dan DSU yang telah dipelajari sebelumnya.'
      },
      { 
        date: '13 Juli 2025', 
        title: 'Matematika untuk Programmer', 
        description: 'Pelajari berbagai konsep matematika dasar hingga menengah yang sering muncul dalam soal-soal programming, seperti modular arithmetic, kombinatorik, faktorisasi, hingga logika matematika. Materi disampaikan melalui slide interaktif, lalu dilanjutkan dengan live coding bersama mentor, dan peserta akan langsung mencoba mengerjakan soal juga. Di akhir sesi, Final Contest akan diumumkan sebagai tantangan utama untuk menerapkan seluruh kemampuan yang telah kamu pelajari.'
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
          description: 'Mulai perjalanan codingmu dengan memahami pondasi utama pembuatan halaman web. Dalam sesi ini, kamu akan belajar menyusun elemen-elemen penting HTML seperti header, section, dan footer, lalu membuat tampilan lebih menarik dengan sentuhan CSS. Tidak hanya teori, kamu juga langsung praktek lewat mini challenge seru dengan membuat layout profil sederhana. Cara terbaik untuk menguasai struktur dan styling web secara nyata dan menyenangkan.'
        },
        { 
          date: '2 Juli 2025', 
          title: 'Mempelajari Layouting dan Responsive Design', 
          description: 'Pelajari cara menyusun tampilan web yang rapi, fleksibel, dan nyaman dilihat di semua perangkat. Sesi ini dimulai dengan konsep dasar Box Model (margin, padding, dan border) lalu berlanjut ke Flexbox untuk membuat layout yang lebih dinamis dan terstruktur. Kamu juga akan belajar membuat desain responsif yang otomatis menyesuaikan tampilan, baik di laptop maupun smartphone.'
        },
        { 
          date: '3 Juli 2025', 
          title: 'Mengenal JavaScript Dasar', 
          description: 'Sesi ini mengenalkan dasar-dasar JavaScript yang jadi kunci membuat web interaktif. Kamu akan belajar variabel, tipe data, operator, function, conditional, dan loop. Lalu lanjut ke praktik manipulasi DOM untuk mengubah elemen di halaman. Melalui hands-on mini project, kamu akan membuat tombol interaktif sebagai latihan logika dan fungsionalitas.'
        },
        { 
          date: '6 Juli 2025', 
          title: 'Introduction to React.js', 
          description: 'Dalam sesi ini, kamu akan mulai membangun UI interaktif dengan React. Kita bahas konsep dasar seperti komponen, JSX, dan props, kemudian lanjut ke hooks seperti useState dan useEffect. Langsung praktik dengan membuat komponen kartu produk, lengkap dengan tombol interaktif yang bisa mengubah tampilannya secara real-time.'
        },
        { 
          date: '7 Juli 2025', 
          title: 'Mempelajari Styling Modern dengan Tailwind & Material UI', 
          description: 'Kenalan dengan dua pendekatan populer untuk mempercantik tampilan React-mu, yaitu Tailwind CSS dan Material UI. Kamu akan belajar cara menggunakan utility-first CSS di Tailwind, styling komponen dengan efisien, serta bagaimana melakukan setup dan eksplorasi komponen dari MUI. Lewat latihan langsung, kamu akan membangun dua versi kartu produk lalu membandingkan kelebihan dan kekurangannya secara langsung'
        },
        { 
          date: '10 Juli 2025', 
          title: 'Live Coding Session', 
          description: 'Dalam sesi ini, kamu akan menggabungkan semua materi dari pertemuan sebelumnya dalam satu sesi live coding. Kita akan membangun satu halaman web lengkap dengan pendekatan modular menggunakan komponen. Sesi ini juga jadi pondasi untuk Final Project. Plus, dalam sesi ini akan ada pengumuman tema dan tantangan Final Project yang akan dikumpulkan nanti.'
        },
        { 
          date: '11 Juli 2025', 
          title: 'Sesi Konsultasi', 
          description: 'Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari pagi hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.'
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
          description: 'Masuki dunia forensik digital dengan menguasai teknik-teknik dasar yang penting untuk mengungkap informasi tersembunyi. Dalam sesi ini, kamu akan belajar menggunakan perintah Linux seperti strings dan exiftool untuk mengekstrak data dari file, memahami berbagai format file populer, serta melakukan analisis jaringan dengan Wireshark. Selain itu, kamu akan mengenal konsep steganografi yang sering dipakai untuk menyembunyikan pesan rahasia.'
        },
        { 
          date: '5 Juli 2025', 
          title: 'Mempelajari Fundamental dari Web Exploitation', 
          description: 'Pelajari teknik dasar eksploitasi web yang sering digunakan dalam pengujian keamanan aplikasi modern. Dalam sesi ini, kamu akan memahami cara kerja alat powerful seperti Burp Suite, mengenali celah seperti XSS (Cross-Site Scripting), hingga mengeksplorasi risiko pada fitur upload file. Latihan juga didukung langsung dengan platform PortSwigger, jadi kamu bisa belajar sambil praktik dan memahami pola serangan nyata yang sering terjadi di industri.'
        },
        { 
          date: '7 Juli 2025', 
          title: 'Dasar-dasar Cryptography', 
          description: 'Dalam sesi ini, kamu akan membahas konsep dasar kriptografi, termasuk perbedaan antara enkripsi simetris dan asimetris. Kamu juga akan berlatih menyelesaikan tantangan di platform Cryptohack untuk memahami bagaimana teknik kriptografi digunakan dalam keamanan data secara nyata.'
        },
        { 
          date: '10 Juli 2025', 
          title: 'Pengenalan OSINT dan Web Scraping', 
          description: 'Kamu akan mempelajari dasar-dasar OSINT (Open Source Intelligence), yaitu teknik pengumpulan informasi dari sumber terbuka yang dapat diakses publik. Kamu akan mempelajari berbagai alat OSINT yang digunakan untuk menggali data dari internet secara efektif, serta memahami dasar-dasar web scraping untuk mengekstrak data dari situs web secara otomatis.'
        },
        { 
          date: '13 Juli 2025', 
          title: 'CTF Practice dan Persiapan Final Project', 
          description: 'Di sesi ini, kamu akan mengenal lebih dekat tentang CTF (Capture The Flag), alur kerjanya, dan bagaimana cara berkompetisi di dalamnya. Kamu juga akan berlatih langsung dengan picoCTF untuk mengasah keterampilan hacking dan pemecahan masalah. Di akhir sesi, final project akan diumumkan, memberikan kesempatan untuk mengaplikasikan semua yang telah dipelajari dalam proyek nyata.'
        },
        { 
          date: '15 Juli 2025', 
          title: 'Sesi Konsultasi', 
          description: 'Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari siang hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.'
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
          description: 'Mulai petualanganmu di dunia game dengan memahami rahasia di balik desain game. Dalam sesi ini, kamu akan belajar bagaimana game dibangun dari konsep hingga jadi pengalaman interaktif yang seru dan memikat. Kamu juga akan diajak untuk menuangkan semua ide kreatifmu ke dalam Game Design Document (GDD), yaitu panduan wajib sebelum coding dimulai.'
        },
        { 
          date: '1 Juli 2025', 
          title: 'Pengenalan MDA Framework', 
          description: 'Sesi ini membahas MDA Framework (Mechanics, Dynamics, Aesthetics) sebagai pendekatan untuk merancang pengalaman bermain yang menarik. Kamu akan belajar bagaimana framework ini membantu menyusun desain game yang lebih terarah dan efektif. Sebagai latihan, kamu akan membuat Game Design Document (GDD) dengan mengacu pada konsep MDA.'
        },
        { 
          date: '3 Juli 2025', 
          title: 'GDevelop dan Pembuatan Game Dasar', 
          description: 'Dalam sesi ini, kamu akan dikenalkan pada GDevelop yaitu software no-code untuk membuat game 2D. Kamu akan belajar membuat elemen dasar seperti event, movement, sprites, tiles, UI, dan object, serta langsung mempraktekkannya lewat tugas pembuatan Game Prototype I. Sesi ini dirancang agar kamu bisa mulai membangun game pertamamu dengan langkah-langkah yang mudah dipahami.'
        },
        { 
          date: '4 Juli 2025', 
          title: 'Pendalaman Sistem Event di GDevelop', 
          description: 'Sesi ini akan mengajak kamu memahami lebih dalam bagaimana sistem event di GDevelop bekerja. Fokus utama mencakup pengelolaan waktu, perubahan state objek, dan penerapan physics untuk menciptakan interaksi yang lebih realistis dan dinamis dalam game. Pemahaman ini akan membantumu menyusun logika game yang lebih kompleks dan responsif.'
        },
        { 
          date: '5 Juli 2025', 
          title: 'Persiapan GameJam', 
          description: 'Kenali konsep GameJam sebagai ajang kolaboratif untuk menciptakan game dalam waktu terbatas. Kamu akan memahami alur dan timeline GameJam. Kamu akan mempelajari bagaimana alur kerja dalam GameJam. Sesi ini juga akan membahas roadmap dan timeline GameJam. Di akhir sesi, Final Project akan diumumkan sebagai tantangan utama untuk menerapkan seluruh kemampuan yang telah kamu pelajari.'
        },
        { 
          date: '9 Juli 2025', 
          title: 'Sesi Konsultasi', 
          description: 'Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari pagi hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.'
        },
        { 
          date: '11 Juli 2025', 
          title: 'Sesi Konsultasi', 
          description: 'Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari pagi hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.'
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
          description: 'Pelajari elemen-elemen visual penting seperti garis, bentuk, warna, tekstur, dan ruang yang menjadi kunci desain menarik dan efektif. Dalam sesi ini, kamu akan menganalisis desain nyata untuk memahami perbedaan antara desain yang eye-catching dan yang kurang efektif. Selanjutnya, langsung praktik membuat kolase visual keren di Figma dengan prinsip desain yang mudah dipahami dan diterapkan.'
        },
        { 
          date: '2 Juli 2025', 
          title: 'Mengenal Tipografi dan Komposisi Layout', 
          description: 'Pada sesi ini, kamu akan mempelajari dasar-dasar tipografi dan layout dalam desain grafis. Kamu akan belajar berbagai jenis font seperti serif, sans-serif, display, dan monospace, serta konsep hierarchy. Selain itu, kamu juga akan mempelajari prinsip-prinsip layout seperti grid system, alignment, margin, dan struktur baca yang efektif.'
        },
        { 
          date: '4 Juli 2025', 
          title: 'Color in Design: Meaning, Strategy & Accessibility', 
          description: 'Sesi ini membahas peran penting warna dalam desain, mulai dari maknanya terhadap emosi dan persepsi hingga penerapannya dalam strategi branding seperti penggunaan warna primer, sekunder, dan aksen. Kamu juga akan memahami pentingnya kontras dan aksesibilitas dalam desain visual, serta mengenal tools seperti WebAIM Contrast Checker untuk memastikan desain ramah bagi semua pengguna.'
        },
        { 
          date: '7 Juli 2025', 
          title: 'Pengenalan ke Media Sosial dan Desain Kampanye Digital', 
          description: 'Dalam sesi ini, kamu akan mengenal format-format desain konten media sosial yang paling populer, seperti carousel, single post, dan story. Pelajari juga prinsip dasar visual storytelling untuk menyampaikan pesan secara efektif dan menarik. Kamu akan diajarkan cara menyusun informasi dengan runtut, menjaga konsistensi visual, serta menempatkan Call-to-Action (CTA) yang tepat agar audiens makin tergerak.'
        },
        { 
          date: '9 Juli 2025', 
          title: 'Mempelajari Branding & Visual Identity', 
          description: 'Sesi ini mengenalkan konsep identitas visual, mulai dari perbedaan antara logo, wordmark, ikon, dan simbol. Kamu akan belajar membangun konsistensi gaya melalui pemilihan warna, font, dan tone visual. Lewat studi kasus brand besar, kamu akan memahami penerapan identitas visual secara nyata, lalu mempraktikkannya dengan membuat moodboard dan sketsa logo brand fiktif beserta aplikasinya dalam elemen visual sederhana.'
        },
        { 
          date: '11 Juli 2025', 
          title: 'Mockup & Design Presentation', 
          description: 'Pelajari cara memukau dengan menampilkan desainmu dalam berbagai mockup keren dari poster sampai tampilan di perangkat digital dan media sosial. Selain itu, kuasai teknik menyusun presentasi desain yang jelas, terstruktur, dan penuh daya tarik, lengkap dengan narasi visual yang kuat serta alasan di balik setiap keputusan kreatifmu. Di akhir sesi, Final Project akan diumumkan sebagai tantangan utama untuk menerapkan seluruh kemampuan yang telah kamu pelajari.'
        },
        { 
          date: '15 Juli 2025', 
          title: 'Sesi Konsultasi', 
          description: 'Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan untuk final project, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari pagi hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.'
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
          description: 'Sesi ini merupakan pembelajaran mandiri yang dirancang untuk membantu peserta menyiapkan lingkungan kerja menggunakan Kaggle. Materi mencakup cara membuat akun, mengenal antarmuka Kaggle, serta mengatur file dan notebook yang akan digunakan selama program. Dengan menyelesaikan sesi ini, peserta diharapkan siap untuk mengikuti sesi pembelajaran DSAI secara optimal tanpa kendala teknis.'
        },
        { 
          date: '14 Juli 2025', 
          title: 'Langkah Awal di Dunia Data Science & AI', 
          description: 'Mulai perjalananmu di dunia Data Science & AI dengan sesi pembuka yang seru dan penuh wawasan! Di sini kamu akan mengenal konsep dasar DSAI, memahami alur kerjanya, dan belajar menggunakan library penting seperti Pandas dan Matplotlib. Tak hanya teori, kamu juga akan langsung praktik mengolah data mentah lewat sesi hands-on yang aplikatif.'
        },
        { 
          date: '15 Juli 2025', 
          title: 'Pengenalan Machine Learning', 
          description: 'Pada sesi ini, kamu akan membahas konsep dasar Machine Learning, termasuk supervised dan unsupervised learning. Peserta akan mempelajari regresi, klasifikasi, regresi linear, serta klasterisasi menggunakan K-means. Terdapat juga studi kasus praktik langsung dengan data mentah untuk kedua jenis pembelajaran tersebut'
        },
        { 
          date: '16 Juli 2025', 
          title: 'Membongkar Algoritma & Teknik Canggih Machine Learning', 
          description: 'Tingkatkan skill Machine Learning dengan teknik canggih seperti stacking dan algoritma populer K-Nearest Neighbour, Decision Tree, serta Random Forest. Di sesi ini, kamu juga akan langsung memulai kompetisi Kaggle dan praktik dengan data mentah untuk memperkuat kemampuan nyata.'
        },
        { 
          date: '22 Juli 2025', 
          title: 'Selami Dunia Deep Learning dari Fondasi sampai Aplikasinya', 
          description: 'Sesi ini memberikan pemahaman dasar tentang Deep Learning, mencakup definisi, perbedaan dengan Machine Learning tradisional, serta konsep dasar seperti neuron, lapisan (layers), bobot (weights), dan fungsi aktivasi. Termasuk juga demo singkat membangun jaringan saraf sederhana menggunakan Keras Dengan pendekatan Sequential'
        },
        { 
          date: '23 Juli 2025', 
          title: 'Dari Kata ke Kode, Petualangan di Dunia Natural Language Processing (NLP)', 
          description: 'Mulai petualanganmu di dunia Natural Language Processing (NLP) dengan mengenal teknik-teknik dasar yang membuat komputer bisa "mengerti" bahasa manusia. Dalam sesi ini, kamu akan belajar cara membersihkan teks, seperti mengubah huruf besar ke kecil, menghapus kata-kata umum yang tidak penting (stopwords), dan memecah kalimat menjadi potongan-potongan kecil (tokenisasi).'
        },
        { 
          date: '24 Juli 2025', 
          title: 'Representasi Teks dan Klasifikasi dalam NLB', 
          description: 'Sesi ini membahas cara mempresentasikan teks dalam bentuk nemurik menggunakan metode Bag of Words dan TF-IDF. Peserta akan belajar melatih model klasifikasi teks sederhana untuk deteksi spam, dengan studi kasus menggunakan algoritma Naive Bayes'
        },
        { 
          date: '25 Juli 2025', 
          title: 'Computer Vision 101 dengan Convolutional Neural Networks (CNN)', 
          description: 'Jelajahi dunia di mana komputer bisa \'melihat\' dan mengenali gambar seperti manusia. Di sesi ini, kamu akan memahami rahasia di balik penglihatan mesin lewat konsep Computer Vision dan kekuatan Convolutional Neural Networks (CNN). Mulai dari piksel hingga model canggih, kamu juga akan langsung praktik klasifikasi gambar. Selain itu, di sesi ini akan diumumkan pemenang kompetisi Kaggle untuk melakukan presentasi hasil terbaik mereka.'
        },
        { 
          date: '26 Juli 2025', 
          title: 'Rapat Teknis untuk Presentasi Final Round', 
          description: 'Sesi persiapan teknis untuk final round presentation! Dalam rapat ini, kamu akan mendapatkan briefing lengkap tentang format presentasi, timeline, kriteria penilaian, dan ekspektasi untuk final round. Tim juga akan membahas technical requirements, setup presentation, dan memberikan tips untuk menyampaikan hasil proyek Data Science dengan confident dan professional.'
        },
        { 
          date: '28 Juli 2025', 
          title: 'Presentasi Final Round', 
          description: 'Saatnya showcase kemampuan Data Science & AI-mu di hadapan panel juri! Dalam final round ini, kamu akan mempresentasikan complete project mulai dari problem statement, data analysis process, model development, hingga insights dan recommendations. Ini adalah kesempatan untuk mendemonstrasikan technical skills, communication abilities, dan problem-solving approach yang telah kamu kembangkan selama program.'
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
          description: 'Mulai langkah penting dalam manajemen proyek dengan memahami cara menyusun Project Requirement Document (PRD) dan Design Brief. Sesi ini akan membimbing kamu mengubah PRD menjadi Design Brief yang jelas dan terarah, serta mengaplikasikan dokumen-dokumen tersebut langsung dalam proses desain untuk hasil yang maksimal.'
        },
        { 
          date: '18 Juli 2025', 
          title: 'Menggali Kebutuhan Pengguna dengan Wawancara Efektif', 
          description: 'Masuki dunia pengguna dengan cara yang tepat, kamu akan belajar teknik wawancara yang bukan sekadar tanya jawab biasa, tapi cara menggali kebutuhan dan motivasi terdalam pengguna. Dengan menghubungkan hasil interview ke Hook Model dan Mental Models, kamu akan mampu memahami perilaku mereka secara mendalam dan menciptakan solusi yang benar-benar menyentuh.'
        },
        { 
          date: '19 Juli 2025', 
          title: 'Berkreasi dengan How Might We dan Storyboard untuk Solusi User', 
          description: 'Sesi ini akan membawamu ke dunia eksplorasi ide tanpa batas, Kamu akan belajar bagaimana menggali solusi inovatif lewat generative design dan memetakan skenario nyata dengan scenario mapping. Dengan alat seperti How Might We matrix dan storyboard, kamu bukan hanya menemukan ide, tapi juga merancang pengalaman pengguna yang hidup dan berdampak.'
        },
        { 
          date: '20 Juli 2025', 
          title: 'Desain Bermakna Menciptakan Produk yang Dipakai dan Menguntungkan', 
          description: 'Saatnya melihat desain sebagai kekuatan strategis yang mendorong inovasi dan pertumbuhan bisnis. Di sesi ini, kamu akan belajar bagaimana UX terintegrasi dengan marketing, teknologi, dan tujuan bisnis untuk menciptakan solusi yang berdampak. Sesi ini juga akan membuka wawasanmu pada potensi UX masa depan lewat teknologi seperti AI, AR, dan VR.'
        },
        { 
          date: '24 Juli 2025', 
          title: 'Membawa Ide ke Layar dengan Low-fi dan Hi-fi', 
          description: 'Sesi ini akan membawamu menyusuri proses visualisasi ide, mulai dari Low-Fidelity (sketsa awal yang cepat dan sederhana) hingga High-Fidelity (desain detail yang mendekati tampilan akhir produk). Kamu akan belajar membuat wireframe dan prototype sebagai alat penting untuk menguji dan menyempurnakan ide sebelum masuk tahap pengembangan.'
        },
        { 
          date: '25 Juli 2025', 
          title: 'Psikologi di Balik Desain Hebat', 
          description: 'Desain hebat bukan hanya soal estetika, tapi juga soal memahami bagaimana manusia berpikir dan bertindak. Di sesi ini, kamu akan mempelajari UX Laws, prinsip-prinsip psikologis yang menjadi dasar mengapa desain tertentu terasa intuitif, cepat dipahami, dan menyenangkan digunakan. Dengan memahami hukum-hukum ini, kamu bisa membuat desain yang tidak hanya menarik secara visual, tetapi juga efektif secara fungsional dan mudah digunakan.'
        },
        { 
          date: '26 Juli 2025', 
          title: 'Mengukur Pengalaman dari Feedback ke Insight', 
          description: 'Sesi ini mengajak kamu menguak rahasia di balik pengalaman pengguna yang mulus dan memuaskan. Kamu akan belajar cara melakukan pengujian yang tepat untuk mengukur seberapa mudah dan efektif produk digunakan, serta menggunakan metode seperti System Usability Score (SUS) dan Heuristic Analysis untuk menemukan dan memperbaiki kendala sebelum produk benar-benar diluncurkan.'
        },
        { 
          date: '27 Juli 2025', 
          title: 'Membuat Desain Terlihat dan Dirasakan Semua', 
          description: 'Pada sesi ini, kamu akan mempelajari tentang pentingnya menciptakan desain yang aksesibel dan inklusif, sehingga semua orang termasuk mereka dengan kebutuhan khusus bisa merasakan manfaatnya. Selain itu, kamu juga akan belajar teknik UX pitching yang powerful untuk menyampaikan ide desain dengan meyakinkan ke klien dan tim, serta strategi kolaborasi efektif dengan tim development agar desainmu bisa terwujud dengan sempurna.'
        },
        { 
          date: '28 Juli 2025', 
          title: 'Mentoring Final Project', 
          description: 'Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari pagi hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.'
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
          description: 'Di sesi ini, kamu akan diajak mengenal teknologi-teknologi keren yang jadi tulang punggung proyek, mulai dari Next.js hingga Prisma dan Tailwind CSS. Kamu akan memahami peran penting masing-masing tools, alasan kenapa mereka dipilih, serta bagaimana semuanya bersinergi untuk menciptakan produk yang solid dan efisien. Plus, ada diskusi interaktif dan sesi tanya jawab seru untuk menggali lebih dalam.'
        },
        { 
          date: '17 Juli 2025', 
          title: 'Memahami React Hooks dan Pengelolaan Data', 
          description: 'Masuk ke inti React dengan menguasai lifecycle dan Hooks yang jadi kunci bikin aplikasi kamu hidup dan responsif. Di sesi ini, kamu bakal belajar cara pakai useState, useEffect, dan teknik pengelolaan data asinkron yang membuat aplikasi mampu menangani perubahan secara real-time. Semua disajikan dengan praktik seru yang langsung bisa kamu terapkan untuk membuat aplikasi lebih dinamis dan interaktif.'
        },
        { 
          date: '18 Juli 2025', 
          title: 'Mendalami Arsitektur Next.js: Routing, API, dan Middleware', 
          description: 'Sesi ini membawa kamu menjelajahi struktur folder dan sistem routing di Next.js yang powerful dan fleksibel. Kamu akan mempelajari cara membuat API Routes untuk backend ringan, memahami peran Middleware dalam mengelola request, serta menguasai Dynamic Routes untuk membangun aplikasi yang dinamis.'
        },
        { 
          date: '19 Juli 2025', 
          title: 'Kode Cerdas dengan TypeScript', 
          description: 'Kuak rahasia membuat kode lebih kuat, rapi, dan bebas bug dengan TypeScript yang semakin populer di kalangan developer profesional! Di sesi ini, kamu akan diajak memahami konsep dasar seperti type inference, type aliases, interface, narrowing, dan type assertion dengan cara yang mudah dan aplikatif.'
        },
        { 
          date: '22 Juli 2025', 
          title: 'Rahasia Autentikasi Mulus untuk Aplikasi Next.js', 
          description: 'Bangun sistem autentikasi canggih dan seamless yang siap melindungi aplikasi kamu. Di sesi ini, kamu akan belajar langkah demi langkah membuat halaman login dan registrasi menggunakan Clerk atau Kinde di Next.js, lalu mengintegrasikannya dengan mulus ke dalam aplikasi.'
        },
        { 
          date: '23 Juli 2025', 
          title: 'Membangun Fondasi Data Kuat dengan Prisma', 
          description: 'Bangun pondasi aplikasi yang tangguh melalui penguasaan Prisma ORM. Di sesi ini, kamu akan belajar mengatur database dari awal, membuat schema, menjalankan migrasi, dan melakukan operasi CRUD secara efisien. Kamu juga akan mengintegrasikan Prisma dengan API Route Handlers untuk membangun endpoint CRUD Notes.'
        },
        { 
          date: '26 Juli 2025', 
          title: 'Mentoring Final Project', 
          description: 'Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari pagi hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.'
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
          description: 'Masuki dunia siber dari sisi penyerang dan pelajari bagaimana para ethical hacker merancang langkah demi langkah untuk menembus sistem secara legal. Sesi ini akan membekali kamu dengan dasar-dasar penetration testing, mulai dari rules of engagement, alur kerja pentest, hingga eksplorasi HackTheBox sebagai medan latihan digital. Kamu juga akan mengenal teknik OSINT untuk menggali informasi target secara strategis sebelum fase eksploitasi dimulai.'
        },
        { 
          date: '17 Juli 2025', 
          title: 'Menembus Permukaan, Seni Enumeration dalam Dunia Siber', 
          description: 'Langkah awal yang menentukan dalam ethical hacking dimulai dari seberapa dalam kamu bisa menggali informasi target. Di sesi ini, kamu akan mempelajari teknik enumerasi untuk mengungkap layanan tersembunyi dan celah potensial dalam sistem, khususnya pada SMB dan Windows. Kamu juga akan menggunakan tools andalan seperti smbclient, enum4linux, rpcclient, serta memahami kekuatan Nmap dalam pemindaian jaringan.'
        },
        { 
          date: '18 Juli 2025', 
          title: 'Identifikasi Kerentanan Sebelum Menyerang', 
          description: 'Di sesi ini, kamu akan diajak menyelami proses identifikasi kerentanan, mulai dari observasi manual tampilan web (web view analysis) untuk menangkap pola dan anomali, hingga penggunaan automated scanners yang mempercepat deteksi celah keamanan. Sesi ini akan melatih insting analisismu agar lebih tajam dalam membaca potensi eksploitasi di sistem target, kunci penting sebelum masuk ke fase serangan.'
        },
        { 
          date: '23 Juli 2025', 
          title: 'Metasploit dan Seni Menguasai Sistem', 
          description: 'Sesi ini membawa kamu langsung ke inti serangan dengan eksplorasi eksploitasi sistem bersama mentor ahli. Kamu akan belajar menggunakan Metasploit untuk menjalankan serangan canggih, memahami berbagai jenis shells dan payloads, serta menguasai teknik eksploitasi celah keamanan pada aplikasi web. Praktik langsung di sesi ini akan mengasah kemampuan kamu dalam mengambil alih sistem secara etis dan terampil.'
        },
        { 
          date: '24 Juli 2025', 
          title: 'Escalating Privilege', 
          description: 'Setelah berhasil masuk ke sistem, saatnya menguasai kekuatan penuh dengan teknik privilege escalation yang jadi kunci mengendalikan target secara total. Di sesi ini, kamu akan dibimbing langsung oleh mentor ahli untuk menguasai cara menaikkan hak akses di Linux dan Windows, termasuk penggunaan tools powerful seperti WinPEAS. Selain itu, kamu juga akan mendalami teknik reverse shells untuk menjaga kontrol dan membuka pintu masuk tersembunyi.'
        },
        { 
          date: '25 Juli 2025', 
          title: 'Menguasai Jejak Digital dan Final Challenge', 
          description: 'Setelah menembus dan menguasai jaringan target lewat teknik pivoting dan tunneling, saatnya menyelesaikan perjalanan dengan menyusun laporan penetration testing yang profesional. Dalam sesi ini, kamu juga akan diumumkan final project yang akan jadi tantangan nyata untuk menguji semua kemampuan ethical hacking yang telah kamu pelajari.'
        },
        { 
          date: '26 Juli 2025', 
          title: 'Mentoring Final Project', 
          description: 'Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari pagi hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.'
        },
        { 
          date: '27 Juli 2025', 
          title: 'Mentoring Final Project', 
          description: 'Selama sesi ini, kamu juga bisa konsultasi langsung lewat Zoom. Kalau ada pertanyaan atau butuh arahan, silahkan masuk ke ruang Zoom dan bertanya langsung dengan Teaching Assistant kami. Ruang konsultasi ini akan dibuka dari pagi hingga sore, jadi kamu bisa tanya kapan pun selama jam tersebut.'
        }
      ]
    }
  ];

  let successCount = 0;
  let skipCount = 0;

  for (const group of materialsData) {
    const course = courseMap[group.courseTitle];
    if (!course) {
      console.warn(`⚠️ Course not found: ${group.courseTitle}, skipped`);
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
