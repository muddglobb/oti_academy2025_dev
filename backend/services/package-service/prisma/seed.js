import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// Generate service JWT token for inter-service communication
function generateServiceToken() {
  const payload = {
    id: 'package-service',
    role: 'SERVICE'
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
}

// Package data to be seeded
const packages = [
  {
    name: 'Paket Entry',
    type: 'ENTRY',
    price: 49000
  },
  {
    name: 'Paket Intermediate',
    type: 'INTERMEDIATE',
    price: 90000
  },
  {
    name: 'Bundle Python + Data Science & Artificial Intelligence',
    type: 'BUNDLE',
    price: 130000
  },
  {
    name: 'Bundle Web Development + Software Engineering',
    type: 'BUNDLE',
    price: 130000
  },
  {
    name: 'Bundle Fundamental Cyber Security + Cyber Security',
    type: 'BUNDLE',
    price: 130000
  },
  {
    name: 'Bundle Graphic Design + UI/UX',
    type: 'BUNDLE',
    price: 130000
  }
];

// Check if data already exists
async function dataExists() {
  const count = await prisma.package.count();
  return count > 0;
}

async function fetchCoursesFromCourseService(maxRetries = 3, retryDelay = 3000) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const courseServiceUrl = process.env.COURSE_SERVICE_URL || 'http://course-service-api:8002';
      const serviceToken = generateServiceToken();
      
      const headers = {
        'Authorization': `Bearer ${serviceToken}`
      };
      
      console.log(`📡 Attempt ${retries + 1}: Fetching courses from course service at ${courseServiceUrl}/courses...`);
      const response = await axios.get(`${courseServiceUrl}/courses`, { headers });
      
      if (!response.data || !response.data.data) {
        throw new Error('Invalid response from course service');
      }
      
      console.log(`✅ Successfully fetched ${response.data.data.length} courses from course service`);
      return response.data.data;
    } catch (error) {
      retries++;
      
      if (retries >= maxRetries) {
        console.error('❌ Failed to fetch courses from course service after maximum retries:', error.message);
        throw error;
      }
      
      console.log(`⏳ Course service not available (attempt ${retries}/${maxRetries}). Retrying in ${retryDelay/1000} seconds...`);
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

// Export the seeding function for programmatic use
export async function seedPackages(options = { force: false }) {
  try {
    console.log('🌱 Starting package service seeding process...');
    
    // Check if data already exists and we're not forcing a reseed
    if (!options.force) {
      const exists = await dataExists();
      if (exists) {
        console.log('Packages already exist, skipping seed');
        return { 
          success: true, 
          message: 'Packages already exist, seeding skipped' 
        };
      }
    }
    
    console.log('💾 Clearing existing package course relationships...');
    // Only delete the join table to keep relationships clean
    await prisma.packageCourse.deleteMany({});
    
    // If force is true, also delete existing packages
    if (options.force) {
      console.log('💾 Clearing existing packages...');
      await prisma.package.deleteMany({});
    }
    
    console.log('💾 Upserting packages...');
    // Use upsert for each package with name as unique key
    const createdPackages = await Promise.all(
      packages.map(async (packageData) => {
        const createdPackage = await prisma.package.upsert({
          where: { name: packageData.name },
          update: {
            // Update price and type if they change
            price: packageData.price,
            type: packageData.type
          },
          create: packageData
        });
        console.log(`✅ Upserted package: ${createdPackage.name} (${createdPackage.type})`);
        return createdPackage;
      })
    );
    
    // Fetch all courses from course service
    const allCourses = await fetchCoursesFromCourseService();
    
    // Map courses by title for easy lookup
    const courseMap = {};
    allCourses.forEach(course => {
      courseMap[course.title.toLowerCase()] = course;
    });
    
    console.log('📋 Course mapping:');
    Object.entries(courseMap).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value.id} (${value.level})`);
    });
    
    // Define course relationships based on actual titles
    function findCourseId(title, level) {
      const course = Object.values(courseMap).find(c => 
        c.title.toLowerCase().includes(title.toLowerCase()) && 
        (level ? c.level === level : true)
      );
      
      if (!course) {
        throw new Error(`Could not find course with title "${title}" and level "${level || 'any'}"`);
      }
      
      return course.id;
    }
    
    // Define mappings for packages
    const packageCoursesMapping = [
      // ENTRY package courses
      {
        packageIndex: 0, // Paket Entry
        courseFilters: [
          { title: 'Competitive Programming', level: 'ENTRY' },
          { title: 'Graphic Design', level: 'ENTRY' },
          { title: 'Fundamental Cyber Security', level: 'ENTRY' },
          { title: 'Game Development', level: 'ENTRY' },
          { title: 'Web Development', level: 'ENTRY' },
          { title: 'Basic Python', level: 'ENTRY' }
        ]
      },
      // INTERMEDIATE package courses
      {
        packageIndex: 1, // Paket Intermediate
        courseFilters: [
          { title: 'Software Engineering', level: 'INTERMEDIATE' },
          { title: 'Data Science & Artificial Intelligence', level: 'INTERMEDIATE' },
          { title: 'Cyber Security', level: 'INTERMEDIATE' },
          { title: 'UI/UX', level: 'INTERMEDIATE' }
        ]
      },
      // Bundle packages
      {
        packageIndex: 2, // Bundle Python + Data Science & Artificial Intelligence
        courseFilters: [
          { title: 'Basic Python', level: 'ENTRY' },
          { title: 'Data Science & Artificial Intelligence', level: 'INTERMEDIATE' }
        ]
      },
      {
        packageIndex: 3, // Bundle Web Development + Software Engineering
        courseFilters: [
          { title: 'Web Development', level: 'ENTRY' },
          { title: 'Software Engineering', level: 'INTERMEDIATE' }
        ]
      },
      {
        packageIndex: 4, // Bundle Fundamental Cyber Security + Cyber Security
        courseFilters: [
          { title: 'Fundamental Cyber Security', level: 'ENTRY' },
          { title: 'Cyber Security', level: 'INTERMEDIATE' }
        ]
      },
      {
        packageIndex: 5, // Bundle Graphic Design + UI/UX
        courseFilters: [
          { title: 'Graphic Design', level: 'ENTRY' },
          { title: 'UI/UX', level: 'INTERMEDIATE' }
        ]
      }
    ];
    
    console.log('💾 Adding courses to packages...');
    // Add courses to each package
    const mappingResults = [];
    
    for (const mapping of packageCoursesMapping) {
      const packageId = createdPackages[mapping.packageIndex].id;
      const packageName = createdPackages[mapping.packageIndex].name;
      const packageType = createdPackages[mapping.packageIndex].type;
      
      console.log(`📚 Adding courses to ${packageName} (${packageType}):`);
      // Find course IDs based on filters
      const courseIds = [];
      const mappingResult = {
        packageName,
        packageType,
        addedCourses: [],
        failedCourses: []
      };
      
      for (const filter of mapping.courseFilters) {
        try {
          const courseId = findCourseId(filter.title, filter.level);
          courseIds.push(courseId);
          
          // Use upsert to prevent duplicates - will create or ignore based on unique constraint
          await prisma.packageCourse.upsert({
            where: {
              packageId_courseId: {
                packageId,
                courseId
              }
            },
            update: {}, // No updates needed if it exists
            create: {
              packageId,
              courseId
            }
          });
          console.log(`  ✅ Added course ${courseId} to ${packageName}`);
          mappingResult.addedCourses.push({ courseId, title: filter.title });
        } catch (error) {
          console.error(`  ❌ Failed to add course to ${packageName}:`, error.message);
          mappingResult.failedCourses.push({ title: filter.title, error: error.message });
        }
      }
      
      mappingResults.push(mappingResult);
    }
    
    console.log('🌱 Seeding completed successfully!');
    
    // Return success result object
    return {
      success: true,
      message: 'Package seeding completed successfully',
      data: {
        packages: createdPackages.length,
        mappingResults
      }
    };
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    
    // Return error result object instead of exiting process
    return {
      success: false,
      message: `Seeding failed: ${error.message}`,
      error
    };  } finally {
    // Don't disconnect here when used as a module
    if (import.meta.url === `file://${process.cwd()}/prisma/seed.js`) {
      await prisma.$disconnect();
    }
  }
}

// Import fileURLToPath for ES modules script detection
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

// Run main function when script is executed directly
if (import.meta.url === `file://${__filename}`) {
  const options = {
    force: process.argv.includes('--force')
  };
  
  seedPackages(options)
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
}