import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// Data dummy untuk packages
const packages = [
  {
    name: 'Paket Beginner',
    type: 'BEGINNER',
    price: 100000
  },
  {
    name: 'Paket Intermediate',
    type: 'INTERMEDIATE',
    price: 150000
  },
  {
    name: 'Paket Bundle',
    type: 'BUNDLE',
    price: 200000
  }
];

// Data dummy untuk courses yang akan ditambahkan ke packages
const courseDummyData = [
  // Course untuk BEGINNER
  {
    packageIndex: 0, // Index 0 = BEGINNER
    courses: [
      '00000000-0000-0000-0000-000000000001', // Intro to Web Development
      '00000000-0000-0000-0000-000000000002', // HTML & CSS Basics
      '00000000-0000-0000-0000-000000000003'  // JavaScript Fundamentals
    ]
  },
  // Course untuk INTERMEDIATE
  {
    packageIndex: 1, // Index 1 = INTERMEDIATE
    courses: [
      '00000000-0000-0000-0000-000000000004', // Advanced JavaScript
      '00000000-0000-0000-0000-000000000005', // React Basics
      '00000000-0000-0000-0000-000000000006'  // Backend with Node.js
    ]
  },
  // Course untuk BUNDLE (pasangan course)
  {
    packageIndex: 2, // Index 2 = BUNDLE
    // Dalam BUNDLE, courses dikelompokkan berpasangan (2 course per bundle)
    courses: [
      '00000000-0000-0000-0000-000000000007', // Frontend Development
      '00000000-0000-0000-0000-000000000008', // Backend Development
      '00000000-0000-0000-0000-000000000009', // UI/UX Design
      '00000000-0000-0000-0000-000000000010', // Graphic Design
      '00000000-0000-0000-0000-000000000011', // Python Programming
      '00000000-0000-0000-0000-000000000012'  // Data Science
    ]
  }
];

async function main() {
  try {
    console.log('🌱 Starting seeding process...');
    
    console.log('💾 Creating packages...');
    // Truncate existing data
    await prisma.packageCourse.deleteMany({});
    await prisma.package.deleteMany({});
    
    // Create packages and store their IDs
    const createdPackages = await Promise.all(
      packages.map(async (packageData) => {
        const createdPackage = await prisma.package.create({
          data: packageData
        });
        console.log(`✅ Created package: ${createdPackage.name} (${createdPackage.type})`);
        return createdPackage;
      })
    );
    
    console.log('💾 Adding courses to packages...');
    // Add courses to each package
    for (const courseData of courseDummyData) {
      const packageId = createdPackages[courseData.packageIndex].id;
      const packageType = createdPackages[courseData.packageIndex].type;
      
      if (packageType === 'BUNDLE') {
        // For BUNDLE package type, add courses in pairs
        for (let i = 0; i < courseData.courses.length; i += 2) {
          if (i + 1 < courseData.courses.length) {
            // Add the pair of courses
            const course1 = courseData.courses[i];
            const course2 = courseData.courses[i + 1];
            
            await prisma.packageCourse.create({
              data: {
                packageId,
                courseId: course1
              }
            });
            
            await prisma.packageCourse.create({
              data: {
                packageId,
                courseId: course2
              }
            });
            
            console.log(`✅ Added course pair to BUNDLE: ${course1} & ${course2}`);
          }
        }
      } else {
        // For BEGINNER and INTERMEDIATE, add courses individually
        for (const courseId of courseData.courses) {
          await prisma.packageCourse.create({
            data: {
              packageId,
              courseId
            }
          });
          console.log(`✅ Added course to ${packageType}: ${courseId}`);
        }
      }
    }
    
    console.log('🌱 Seeding completed successfully!');
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