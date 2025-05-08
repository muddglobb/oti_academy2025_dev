import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// NOTE: QUOTA AND DURATION VALUES ARE PLACEHOLDERS (XX) AND SHOULD BE REPLACED WITH ACTUAL VALUES
// quota 140 per course, nanti bundle bakal dikurangi, session belum.

const prisma = new PrismaClient();

// Helper untuk membuat tanggal
const futureDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date;
};

async function main() {
    try {
        console.log('Starting course service seeding process...');
        
        // Hapus data yang ada untuk menghindari duplikasi
        console.log('Cleaning existing data...');
        await prisma.session.deleteMany({});
        await prisma.course.deleteMany({});
        
        console.log('Creating entry-level courses...');
        // Entry-level courses
        const entryCourses = [
            {
                title: 'Competitive Programming',
                description: 'Learn algorithms and data structures for competitive programming contests.',
                level: 'ENTRY',
                quota: 140,
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
                description: 'Master the basics of graphic design including color theory, typography, and composition.',
                level: 'ENTRY',
                quota: 140,
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
                description: 'Learn the basics of cybersecurity, including threat identification and security principles.',
                level: 'ENTRY',
                quota: 140,
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
                description: 'Introduction to game development concepts, engines, and basic implementation.',
                level: 'ENTRY',
                quota: 140,
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
                description: 'Learn HTML, CSS, and JavaScript to build responsive websites from scratch.',
                level: 'ENTRY',
                quota: 140,
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
                description: 'Introduction to Python programming language, syntax, and basic applications.',
                level: 'ENTRY',
                quota: 140,
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
                description: 'Learn professional software development practices including version control, testing, and CI/CD pipelines.',
                level: 'INTERMEDIATE',
                quota: 140,
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
                description: 'Explore data analysis, machine learning, and artificial intelligence techniques.',
                level: 'INTERMEDIATE',
                quota: 140,
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
                description: 'Advanced security concepts including penetration testing and security architecture.',
                level: 'INTERMEDIATE',
                quota: 140,
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
                description: 'User interface and experience design principles, tools, and methodologies.',
                level: 'INTERMEDIATE',
                quota: 140,
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

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });