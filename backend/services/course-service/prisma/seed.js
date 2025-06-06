import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Add explicit initial log
console.log('🌱🌱🌱 Course seed script starting execution...');

// Load environment variables
dotenv.config();

// Total quota is 140 per course
// Game Dev and Competitive Programming have 140 entry quota and 0 bundle quota
// Other courses have 110 entry quota and 30 bundle quota
const DEFAULT_TOTAL_QUOTA = 30;
const DEFAULT_ENTRY_QUOTA = 15;
const DEFAULT_BUNDLE_QUOTA = 15;
const NO_BUNDLE_COURSES = ['Competitive Programming', 'Game Development'];

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

// Helper untuk membuat tanggal
const futureDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date;
};

// Check if data already exists
async function dataExists() {
    const count = await prisma.course.count();
    return count > 0;
}

// Export the seeding function for programmatic use
export async function seedCourses(options = { force: false }) {
    try {
        console.log('Starting course service seeding process...');
        
        // Check if data already exists and we're not forcing a reseed
        if (!options.force) {
            const exists = await dataExists();
            if (exists) {
                console.log('Courses already exist, skipping seed');
                return { 
                    success: true, 
                    message: 'Courses already exist, seeding skipped' 
                };
            }
        }
        
        // Hapus data yang ada jika perlu
        if (options.force) {
            console.log('Cleaning existing data...');
            await prisma.session.deleteMany({});
            await prisma.course.deleteMany({});
        }
        
        console.log('Creating entry-level courses...');
        // Entry-level courses
        const entryCourses = [
            {
                title: 'Competitive Programming',
                description: 'Mengenali dasar-dasar Competitive Programming secara bertahap mulai dari algoritma, struktur data, hingga graf. Dirancang ringkas dan menantang, cocok untuk pemula dan ditutup dengan konteks sebagai tugas akhir.',
                level: 'ENTRY',
                quota: DEFAULT_TOTAL_QUOTA,
                entryQuota: DEFAULT_TOTAL_QUOTA, // Full quota for entry level
                bundleQuota: 0, // No bundle quota
                sessions: {
                    create: [
                        {
                            startAt: futureDate(7),
                            durationHrs: 2,
                            description: 'Introduction to Algorithm Complexity'
                        },
                        {
                            startAt: futureDate(14),
                            durationHrs: 2,
                            description: 'Basic Data Structures'
                        }
                    ]
                }
            },
            {
                title: 'Graphic Design',
                description: 'Belajar dasar desain grafis mulai dari elemen visual, warna, hingga layout. Lewat studi kasus dan praktik di Figma, kamu akan buat berbagai konten secara terarah dan bermakna.',
                level: 'ENTRY',
                quota: DEFAULT_TOTAL_QUOTA,
                entryQuota: DEFAULT_ENTRY_QUOTA,
                bundleQuota: DEFAULT_BUNDLE_QUOTA,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(5),
                            durationHrs: 2,
                            description: 'Design Principles & Elements'
                        },
                        {
                            startAt: futureDate(12),
                            durationHrs: 2,
                            description: 'Typography & Color Theory'
                        }
                    ]
                }
            },
            {
                title: 'Fundamental Cyber Security',
                description: 'Masuki dunia cybersecurity dengan materi praktis dan menyenangkan, mulai dari Linux, forensik, web exploitation, kriptografi, hingga OSINT. Ditutup dengan praktik langsung lewat picoCTF. Materi ringkas dan mudah dipahami, cocok untuk pemula. ',
                level: 'ENTRY',
                quota: DEFAULT_TOTAL_QUOTA,
                entryQuota: DEFAULT_ENTRY_QUOTA,
                bundleQuota: DEFAULT_BUNDLE_QUOTA,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(3),
                            durationHrs: 2,
                            description: 'Security Fundamentals'
                        },
                        {
                            startAt: futureDate(10),
                            durationHrs: 2,
                            description: 'Common Threats & Vulnerabilities'
                        }
                    ]
                }
            },
            {
                title: 'Game Development',
                description: 'Menjelajahi dunia game development dari merancang ide, Game Design Document (GDD), hingga membangun prototype game dengan GDevelop. Materi lengkap dan mudah diikuti, cocok untuk pemula.',
                level: 'ENTRY',
                quota: DEFAULT_TOTAL_QUOTA,
                entryQuota: DEFAULT_TOTAL_QUOTA, // Full quota for entry level
                bundleQuota: 0, // No bundle quota
                sessions: {
                    create: [
                        {
                            startAt: futureDate(8),
                            durationHrs: 2,
                            description: 'Game Design Concepts'
                        },
                        {
                            startAt: futureDate(15),
                            durationHrs: 2,
                            description: 'Introduction to Unity Engine'
                        }
                    ]
                }
            },
            {
                title: 'Web Development',
                description: 'Belajar membuat UI dari nol, mulai dari HTML, CSS, React, hingga Tailwind & MUI. Cocok untuk pemula yang ingin membangun halaman web responsif, memahami dasar komponen React, dan eksplorasi styling modern.',
                level: 'ENTRY',
                quota: DEFAULT_TOTAL_QUOTA,
                entryQuota: DEFAULT_ENTRY_QUOTA,
                bundleQuota: DEFAULT_BUNDLE_QUOTA,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(4),
                            durationHrs: 2,
                            description: 'HTML & CSS Basics'
                        },
                        {
                            startAt: futureDate(11),
                            durationHrs: 2,
                            description: 'JavaScript Essentials'
                        }
                    ]
                }
            },
            {
                title: 'Basic Python',
                description: 'Pelajari dasar-dasar pemrograman Python, mulai dari sintaks dasar hingga OOP dan struktur data. Materi disusun secara bertahap dan mudah diikuti cocok untuk pemula dengan studi kasus menarik.',
                level: 'ENTRY',
                quota: DEFAULT_TOTAL_QUOTA,
                entryQuota: DEFAULT_ENTRY_QUOTA,
                bundleQuota: DEFAULT_BUNDLE_QUOTA,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(6),
                            durationHrs: 2,
                            description: 'Python Syntax & Data Types'
                        },
                        {
                            startAt: futureDate(13),
                            durationHrs: 2,
                            description: 'Control Structures & Functions'
                        }
                    ]
                }
            }
        ];

        console.log('🚀 Creating intermediate courses...');
        // Intermediate courses
        const intermediateCourses = [
            {
                title: 'Software Engineering',
                description: 'Kuasai pembuatan aplikasi web modern lengkap dari autentikasi hingga fitur CRUD lewat praktik langsung dan studi kasus nyata. Jadi developer full-stack handal dengan pengalaman yang keren',
                level: 'INTERMEDIATE',
                quota: DEFAULT_TOTAL_QUOTA,
                entryQuota: DEFAULT_ENTRY_QUOTA,
                bundleQuota: DEFAULT_BUNDLE_QUOTA,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(9),
                            durationHrs: 2,
                            description: 'Version Control with Git'
                        },
                        {
                            startAt: futureDate(16),
                            durationHrs: 2,
                            description: 'Testing & Quality Assurance'
                        }
                    ]
                }
            },
            {
                title: 'Data Science & Artificial Intelligence',
                description: 'Belajar Data Science dan AI dari nol hingga siap ikut proyek dan kompetisi. DSAI Bootcamp membimbingmu step-by-step dari dasar hingga membangun model AI siap industri.',
                level: 'INTERMEDIATE',
                quota: DEFAULT_TOTAL_QUOTA,
                entryQuota: DEFAULT_ENTRY_QUOTA,
                bundleQuota: DEFAULT_BUNDLE_QUOTA,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(7),
                            durationHrs: 2,
                            description: 'Data Analysis with Pandas'
                        },
                        {
                            startAt: futureDate(14),
                            durationHrs: 2,
                            description: 'Machine Learning Fundamentals'
                        }
                    ]
                }
            },
            {
                title: 'Cyber Security',
                description: 'Masuki dunia ethical hacking dan praktik langsung tahapan penetration testing, dari reconnaissance hingga post-exploitation, lengkap dengan penyusunan laporan uji keamanan secara profesional.',
                level: 'INTERMEDIATE',
                quota: DEFAULT_TOTAL_QUOTA,
                entryQuota: DEFAULT_ENTRY_QUOTA,
                bundleQuota: DEFAULT_BUNDLE_QUOTA,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(10),
                            durationHrs: 2,
                            description: 'Network Security'
                        },
                        {
                            startAt: futureDate(17),
                            durationHrs: 2,
                            description: 'Penetration Testing Basics'
                        }
                    ]
                }
            },
            {
                title: 'UI/UX',
                description: 'Mulai dari mengubah PRD jadi desain, membuat mock-up, wireframe, hingga memahami UX laws dan desain yang aksesibel. Belajar secara fleksibel lewat modul online, tugas, konsultasi, dan proyek akhir yang bisa jadi portofolio.',
                level: 'INTERMEDIATE',
                quota: DEFAULT_TOTAL_QUOTA,
                entryQuota: DEFAULT_ENTRY_QUOTA,
                bundleQuota: DEFAULT_BUNDLE_QUOTA,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(8),
                            durationHrs: 2,
                            description: 'User Research Methods'
                        },
                        {
                            startAt: futureDate(15),
                            durationHrs: 2,
                            description: 'Prototyping with Figma'
                        }
                    ]
                }
            }
        ];

        // Create courses
        const createdEntryCourses = await Promise.all(
            entryCourses.map(async (courseData) => {
                // For courses other than Game Dev and Competitive Programming, 
                // update the entry and bundle quotas
                if (!NO_BUNDLE_COURSES.includes(courseData.title)) {
                    courseData.entryQuota = DEFAULT_ENTRY_QUOTA; // 110 for regular courses
                    courseData.bundleQuota = DEFAULT_BUNDLE_QUOTA; // 30 for regular courses
                }
                
                const course = await prisma.course.create({
                    data: courseData,
                    include: {
                        sessions: true
                    }
                });
                console.log(`Created entry course: ${course.title}`);
                return course;
            })
        );

        const createdIntermediateCourses = await Promise.all(
            intermediateCourses.map(async (courseData) => {
                const course = await prisma.course.create({
                    data: courseData,
                    include: {
                        sessions: true
                    }
                });
                console.log(`Created intermediate course: ${course.title}`);
                return course;
            })
        );

        // Log creation summary
        console.log(`Created ${createdEntryCourses.length} entry-level courses.`);
        console.log(`Created ${createdIntermediateCourses.length} intermediate courses.`);
        console.log('Course service seeding completed successfully!');
        
        // Return success result object
        return {
            success: true,
            message: 'Course seeding completed successfully',
            data: {
                entryCourses: createdEntryCourses.length,
                intermediateCourses: createdIntermediateCourses.length,
                totalCourses: createdEntryCourses.length + createdIntermediateCourses.length
            }
        };

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        
        // Return error result object instead of exiting process
        return {
            success: false,
            message: `Seeding failed: ${error.message}`,
            error
        };    } finally {        // Don't disconnect here when used as a module
        if (import.meta.url.endsWith('/prisma/seed.js') || import.meta.url.includes('/seed.js')) {
            console.log('💡 Seed script running from CLI - will disconnect');
            await prisma.$disconnect();
        } else {
            console.log('💡 Seed script imported as module - connection control delegated to importer');
        }
    }
}

// Run main function when script is executed directly
if (import.meta.url.endsWith('/prisma/seed.js') || import.meta.url.includes('/seed.js')) {
    const options = {
        force: process.argv.includes('--force')
    };
    
    seedCourses(options)
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
            process.exit(0);
        });
}