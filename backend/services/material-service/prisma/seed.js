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
    const parsed = parse(dateStr, 'd MMMM yyyy', new Date(), { locale: id });
    
    if (isNaN(parsed.getTime())) {
      // Fallback if Indonesian locale fails
      const [day, month, year] = dateStr.split(' ');
      const monthMap = {
        'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5,
        'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
      };
      
      return new Date(parseInt(year), monthMap[month], parseInt(day));
    }
    
    return parsed;
  } catch (error) {
    console.error(`Failed to parse date: ${dateStr}`, error);
    // Return a default date if parsing fails (June 30, 2025)
    return new Date(2025, 5, 30);
  }
}

// Generate service token for inter-service communication
function generateServiceToken() {
  const payload = {
    service: 'material-service',
    role: 'SERVICE'
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret-key', { expiresIn: '1h' });
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
        { date: '30 Juni 2025', title: 'Workspace Setup',              description: 'Instalasi & pengaturan IDE; Pengenalan Python' },
        { date: '1 Juli 2025',  title: 'Sintaks & Print',              description: 'Sintaks, Print, Komentar; Variabel & Type Casting; Input; Operasi Matematika; Studi Kasus: Kalkulator' },
        { date: '2 Juli 2025',  title: 'Control Flow & Strings',       description: 'Operator Logika & If; Loop; String Methods; Studi Kasus: Password Validator' },
        { date: '3 Juli 2025',  title: 'Struktur Data & Fungsi',       description: 'List, Tuple, Set, Dictionary; Fungsi & Scope; Import Module; Studi Kasus: Manajemen Skor' },
        { date: '7 Juli 2025',  title: 'Object-Oriented Programming',    description: 'Class, Object, Method; Overloading & Overriding; Studi Kasus: Sistem Akun Bank' },
        { date: '8 Juli 2025',  title: 'Struktur Data Lanjutan',       description: 'Linked List; Tree; Studi Kasus: Pohon Organisasi' }
      ]
    },
    // ---------- Competitive Programming ----------
    {
      courseTitle: 'Competitive Programming',
      items: [
        { date: '30 Juni 2025', title: 'C++ Dasar (Mandiri)',           description: 'Prasyarat mandiri' },
        { date: '30 Juni 2025', title: 'Pencarian & Pengurutan',         description: 'Algoritma dasar' },
        { date: '2 Juli 2025',  title: 'Brute Force & Divide and Conquer', description: 'Teknik brute force dan divide & conquer' },
        { date: '4 Juli 2025',  title: 'Greedy & Dynamic Programming',  description: 'Algoritma greedy & DP' },
        { date: '6 Juli 2025',  title: 'Struktur Data Dasar',           description: 'Stack, Queue, Set, Map' },
        { date: '8 Juli 2025',  title: 'Graph Traversal',               description: 'Pengenalan graf & traversal' },
        { date: '10 Juli 2025', title: 'Heap & DSU',                    description: 'Heap & Disjoint Set Union' },
        { date: '12 Juli 2025', title: 'Shortest Path & MST',           description: 'Shortest Path & Minimum Spanning Tree' },
        { date: '13 Juli 2025', title: 'Kontes Akhir',                  description: 'Simulasi final contest' }
      ]
    },
    // ---------- Fundamental Cyber Security ----------
    {
      courseTitle: 'Fundamental Cyber Security',
      items: [
        { date: '30 Juni 2025', title: 'Linux Basics',                description: 'Linux commands (ls, cat, cd); man; navigasi terminal' },
        { date: '2 Juli 2025',  title: 'Forensics',                   description: 'strings, exiftool, Wireshark, Steganography' },
        { date: '5 Juli 2025',  title: 'Web Exploitation',            description: 'Burpsuite, XSS, File Upload, Portswigger' },
        { date: '7 Juli 2025',  title: 'Cryptography',                description: 'Cryptohack; asymmetric & symmetric encryption' },
        { date: '10 Juli 2025', title: 'OSINT & Web Scraping',        description: 'Tools OSINT & scraping' },
        { date: '13 Juli 2025', title: 'CTF Practice',                description: 'Praktik CTF dengan picoCTF' }
      ]
    },
    // ---------- Game Development ----------
    {
      courseTitle: 'Game Development',
      items: [
        { date: '30 Juni 2025', title: 'Intro to Game Dev',            description: 'Game as media; ideation GDD' },
        { date: '1 Juli 2025',  title: 'MDA Framework',                description: 'Pengenalan MDA & tugas GDD' },
        { date: '3 Juli 2025',  title: 'Software Intro: GDevelop',     description: 'Tutorial dasar GDevelop: events, sprites, tiles' },
        { date: '4 Juli 2025',  title: 'Events & Movements',           description: 'Basic events, sprites, tiles' },
        { date: '5 Juli 2025',  title: 'GameJam Intro',                description: 'Pengantar GameJam & final project' },
        { date: '7 Juli 2025',  title: 'Asynchronous Task',            description: 'Jam kerja & submisi dokumen' },
        { date: '9 Juli 2025',  title: 'Mentoring Session I',          description: 'Jam kerja & report' },
        { date: '11 Juli 2025', title: 'Mentoring Session II',         description: 'Final project & evaluasi' }
      ]
    },
    // ---------- Graphic Design ----------
    {
      courseTitle: 'Graphic Design',
      items: [
        { date: '30 Juni 2025', title: 'Intro to Graphic Design',       description: 'Elemen visual & kolase Figma' },
        { date: '2 Juli 2025',  title: 'Typography & Layout',          description: 'Font hierarchy & grid' },
        { date: '4 Juli 2025',  title: 'Color Theory & Accessibility', description: 'Teori warna & aksesibilitas' },
        { date: '7 Juli 2025',  title: 'Social Media Design',          description: 'Carousel & CTA design' },
        { date: '9 Juli 2025',  title: 'Visual Identity',              description: 'Logo & moodboard' },
        { date: '11 Juli 2025', title: 'Mockup & Presentation',        description: 'Mockup poster & tips presentasi' }
      ]
    },
    // ---------- Web Development ----------
    {
      courseTitle: 'Web Development',
      items: [
        { date: '1 Juli 2025',  title: 'HTML & CSS Basics',           description: 'Struktur HTML & styling CSS' },
        { date: '2 Juli 2025',  title: 'Flexbox & Responsive',        description: 'Flexbox & media queries' },
        { date: '3 Juli 2025',  title: 'JavaScript Basics',           description: 'Variabel, DOM manipulation' },
        { date: '6 Juli 2025',  title: 'React Introduction',          description: 'Component, JSX, useState' },
        { date: '7 Juli 2025',  title: 'Tailwind & MUI',              description: 'Utility-first CSS & MUI setup' },
        { date: '10 Juli 2025', title: 'Live Coding Project',         description: 'Mini project dashboard' },
        { date: '11 Juli 2025', title: 'Final Consultation',          description: 'Sesi konsultasi akhir' }
      ]
    },
    // ---------- Software Engineering ----------
    {
      courseTitle: 'Software Engineering',
      items: [
        { date: '16 Juli 2025', title: 'Tech Stack Overview',          description: 'Next.js, Clerk/Kinde, Prisma, Tailwind' },
        { date: '17 Juli 2025', title: 'React Lifecycle & Hooks',      description: 'useState, useEffect, async data' },
        { date: '18 Juli 2025', title: 'Next.js & SSR',                description: 'Client & server rendering' },
        { date: '19 Juli 2025', title: 'TypeScript Basics',            description: 'Inference, aliases, interfaces' },
        { date: '22 Juli 2025', title: 'Auth Implementation',          description: 'Clerk/Kinde integration' },
        { date: '23 Juli 2025', title: 'Database & HTTP Methods',      description: 'Prisma & REST (GET/POST/etc)' },
        { date: '25 Juli 2025', title: 'Landing Page & CRUD',          description: 'Navbar & CRUD integration' },
        { date: '26 Juli 2025', title: 'Final Mentoring',              description: 'Sesi mentoring akhir' }
      ]
    },
    // ---------- Data Science & AI ----------
    {
      courseTitle: 'Data Science & Artificial Intelligence',
      items: [
        { date: '14 Juli 2025', title: 'DSAI Workspace Setup',         description: 'Env & libs (Pandas/Matplotlib)' },
        { date: '14 Juli 2025', title: 'Intro to DSAI',                description: 'Concepts & workflow' },
        { date: '15 Juli 2025', title: 'Machine Learning Basics',      description: 'Supervised vs unsupervised' },
        { date: '16 Juli 2025', title: 'Advanced ML Techniques',       description: 'Stacking, KNN, Trees, RF' },
        { date: '22 Juli 2025', title: 'Deep Learning Intro',          description: 'Neurons, layers, demo Keras' },
        { date: '23 Juli 2025', title: 'Natural Language Processing',  description: 'Tokenisasi & preprocessing' },
        { date: '24 Juli 2025', title: 'Computer Vision',              description: 'CNN intro & practice' },
        { date: '25 Juli 2025', title: 'Kaggle Final Project',         description: 'Kompetisi & finalis' }
      ]
    },
    // ---------- Cyber Security (Intermediate) ----------
    {
      courseTitle: 'Cyber Security',
      items: [
        { date: '16 Juli 2025', title: 'Penetration Testing Intro',    description: 'Rules & HackTheBox' },
        { date: '17 Juli 2025', title: 'Enumeration',                description: 'SMB, Nmap, subdomains' },
        { date: '18 Juli 2025', title: 'Vulnerability Identification', description: 'Web scanners' },
        { date: '23 Juli 2025', title: 'Exploitation',               description: 'Metasploit & payloads' },
        { date: '24 Juli 2025', title: 'Privilege Escalation',       description: 'Linux & Windows' },
        { date: '25 Juli 2025', title: 'Post Exploitation',          description: 'Pivoting & tunneling' },
        { date: '26 Juli 2025', title: 'CTF Final Practice',         description: 'Final project review' }
      ]
    },
    // ---------- UI/UX ----------
    {
      courseTitle: 'UI/UX',
      items: [
        { date: '17 Juli 2025', title: 'Design Brief & Research',     description: 'Project requirements & mental models' },
        { date: '18 Juli 2025', title: 'Interview & Hook Models',      description: 'User research methods' },
        { date: '19 Juli 2025', title: 'Generative Design',            description: 'Scenario mapping' },
        { date: '20 Juli 2025', title: 'External Mentoring',           description: 'Guest mentor session' },
        { date: '24 Juli 2025', title: 'Low-Fi & Hi-Fi',              description: 'Wireframes & prototypes' },
        { date: '25 Juli 2025', title: 'UX Laws',                     description: 'Principles in design' },
        { date: '26 Juli 2025', title: 'Usability Testing',           description: 'System Usability Score' },
        { date: '27 Juli 2025', title: 'Accessible Design',           description: 'Inclusive & presentation' }
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
      try {
        // Convert the date string to a proper Date object
        const unlockDate = parseWIBDate(item.date);
        console.log(`Debug: Parsed date for ${item.title} - ${item.date} => ${unlockDate.toISOString()}`);
        
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