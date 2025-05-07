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
    name: 'Bundle Python + Data Science & AI',
    type: 'BUNDLE',
    price: 200000
  },
  {
    name: 'Bundle Web Development + Software Engineering',
    type: 'BUNDLE',
    price: 200000
  },
  {
    name: 'Bundle Fundamental Cyber + Advanced Cybersecurity',
    type: 'BUNDLE',
    price: 200000
  },
  {
    name: 'Bundle Graphic Design + UI/UX',
    type: 'BUNDLE',
    price: 200000
  }
];

async function fetchCoursesFromCourseService() {
  try {
    const courseServiceUrl = process.env.COURSE_SERVICE_URL || 'http://course-service-api:8002';
    const serviceToken = generateServiceToken();
    
    const headers = {
      'Authorization': `Bearer ${serviceToken}`
    };
    
    // Fetch all courses from course service
    console.log('📡 Fetching courses from course service...');
    const response = await axios.get(`${courseServiceUrl}/courses`, { headers });
    
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response from course service');
    }
    
    console.log(`✅ Successfully fetched ${response.data.data.length} courses from course service`);
    return response.data.data;
  } catch (error) {
    console.error('❌ Failed to fetch courses from course service:', error.message);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw error;
  }
}

async function main() {
  try {
    console.log('🌱 Starting seeding process...');
    
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
      // BEGINNER package courses
      {
        packageIndex: 0, // Paket Beginner
        courseFilters: [
          { title: 'competitive', level: 'BEGINNER' },
          { title: 'graphic design fund', level: 'BEGINNER' },
          { title: 'fundamental cyber', level: 'BEGINNER' },
          { title: 'game dev', level: 'BEGINNER' },
          { title: 'web dev', level: 'BEGINNER' },
          { title: 'python', level: 'BEGINNER' }
        ]
      },
      // INTERMEDIATE package courses
      {
        packageIndex: 1, // Paket Intermediate
        courseFilters: [
          { title: 'software eng', level: 'INTERMEDIATE' },
          { title: 'data science', level: 'INTERMEDIATE' },
          { title: 'advance cyber', level: 'INTERMEDIATE' },
          { title: 'ui/ux', level: 'INTERMEDIATE' }
        ]
      },
      // Bundle packages
      {
        packageIndex: 2, // Bundle Python + Data Science & AI
        courseFilters: [
          { title: 'python', level: 'BEGINNER' },
          { title: 'data science', level: 'INTERMEDIATE' }
        ]
      },
      {
        packageIndex: 3, // Bundle Web Development + Software Engineering
        courseFilters: [
          { title: 'web dev', level: 'BEGINNER' },
          { title: 'software eng', level: 'INTERMEDIATE' }
        ]
      },
      {
        packageIndex: 4, // Bundle Fundamental Cyber + Advanced Cybersecurity
        courseFilters: [
          { title: 'fundamental cyber', level: 'BEGINNER' },
          { title: 'advance cyber', level: 'INTERMEDIATE' }
        ]
      },
      {
        packageIndex: 5, // Bundle Graphic Design + UI/UX
        courseFilters: [
          { title: 'graphic design', level: 'BEGINNER' },
          { title: 'ui/ux', level: 'INTERMEDIATE' }
        ]
      }
    ];
    
    console.log('💾 Clearing existing package course relationships...');
    // Only delete the join table to keep relationships clean
    await prisma.packageCourse.deleteMany({});
    
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
    
    console.log('💾 Adding courses to packages...');
    // Add courses to each package
    for (const mapping of packageCoursesMapping) {
      const packageId = createdPackages[mapping.packageIndex].id;
      const packageName = createdPackages[mapping.packageIndex].name;
      const packageType = createdPackages[mapping.packageIndex].type;
      
      console.log(`📚 Adding courses to ${packageName} (${packageType}):`);
      
      // Find course IDs based on filters
      const courseIds = [];
      for (const filter of mapping.courseFilters) {
        try {
          const courseId = findCourseId(filter.title, filter.level);
          courseIds.push(courseId);
          
          // Create the relationship in the database
          await prisma.packageCourse.create({
            data: {
              packageId,
              courseId
            }
          });
          console.log(`  ✅ Added course ${courseId} to ${packageName}`);
        } catch (error) {
          console.error(`  ❌ Failed to add course to ${packageName}:`, error.message);
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