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
                level: 'BEGINNER',
                quota: XX,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(7),
                            durationHrs: XX,
                            description: 'Introduction to Algorithm Complexity'
                        },
                        {
                            startAt: futureDate(14),
                            durationHrs: XX,
                            description: 'Basic Data Structures'
                        }
                    ]
                }
            },
            {
                title: 'Graphic Design Fundamentals',
                description: 'Master the basics of graphic design including color theory, typography, and composition.',
                level: 'BEGINNER',
                quota: XX,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(5),
                            durationHrs: XX,
                            description: 'Design Principles & Elements'
                        },
                        {
                            startAt: futureDate(12),
                            durationHrs: XX,
                            description: 'Typography & Color Theory'
                        }
                    ]
                }
            },
            {
                title: 'Fundamental Cybersecurity',
                description: 'Learn the basics of cybersecurity, including threat identification and security principles.',
                level: 'BEGINNER',
                quota: XX,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(3),
                            durationHrs: XX,
                            description: 'Security Fundamentals'
                        },
                        {
                            startAt: futureDate(10),
                            durationHrs: XX,
                            description: 'Common Threats & Vulnerabilities'
                        }
                    ]
                }
            },
            {
                title: 'Game Development Basics',
                description: 'Introduction to game development concepts, engines, and basic implementation.',
                level: 'BEGINNER',
                quota: XX,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(8),
                            durationHrs: XX,
                            description: 'Game Design Concepts'
                        },
                        {
                            startAt: futureDate(15),
                            durationHrs: XX,
                            description: 'Introduction to Unity Engine'
                        }
                    ]
                }
            },
            {
                title: 'Web Development Fundamentals',
                description: 'Learn HTML, CSS, and JavaScript to build responsive websites from scratch.',
                level: 'BEGINNER',
                quota: XX,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(4),
                            durationHrs: XX,
                            description: 'HTML & CSS Basics'
                        },
                        {
                            startAt: futureDate(11),
                            durationHrs: XX,
                            description: 'JavaScript Essentials'
                        }
                    ]
                }
            },
            {
                title: 'Python Programming Basics',
                description: 'Introduction to Python programming language, syntax, and basic applications.',
                level: 'BEGINNER',
                quota: XX,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(6),
                            durationHrs: XX,
                            description: 'Python Syntax & Data Types'
                        },
                        {
                            startAt: futureDate(13),
                            durationHrs: XX,
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
                title: 'Software Engineering Practices',
                description: 'Learn professional software development practices including version control, testing, and CI/CD pipelines.',
                level: 'INTERMEDIATE',
                quota: XX,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(9),
                            durationHrs: XX,
                            description: 'Version Control with Git'
                        },
                        {
                            startAt: futureDate(16),
                            durationHrs: XX,
                            description: 'Testing & Quality Assurance'
                        }
                    ]
                }
            },
            {
                title: 'Data Science & AI',
                description: 'Explore data analysis, machine learning, and artificial intelligence techniques.',
                level: 'INTERMEDIATE',
                quota: XX,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(7),
                            durationHrs: XX,
                            description: 'Data Analysis with Pandas'
                        },
                        {
                            startAt: futureDate(14),
                            durationHrs: XX,
                            description: 'Machine Learning Fundamentals'
                        }
                    ]
                }
            },
            {
                title: 'Cybersecurity Advanced Topics',
                description: 'Advanced security concepts including penetration testing and security architecture.',
                level: 'INTERMEDIATE',
                quota: XX,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(10),
                            durationHrs: XX,
                            description: 'Network Security'
                        },
                        {
                            startAt: futureDate(17),
                            durationHrs: XX,
                            description: 'Penetration Testing Basics'
                        }
                    ]
                }
            },
            {
                title: 'UI/UX Design',
                description: 'User interface and experience design principles, tools, and methodologies.',
                level: 'INTERMEDIATE',
                quota: XX,
                sessions: {
                    create: [
                        {
                            startAt: futureDate(8),
                            durationHrs: XX,
                            description: 'User Research Methods'
                        },
                        {
                            startAt: futureDate(15),
                            durationHrs: XX,
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