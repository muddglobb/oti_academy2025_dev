import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';

// Add explicit initial log
console.log('🌱🌱🌱 Assignment seed script starting execution...');

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// Helper for generating dates
const futureDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

// Helper for generating past dates
const pastDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

/**
 * Generate a service token for inter-service communication
 */
function generateServiceToken() {
  const payload = {
    service: 'assignment-service',
    role: 'SERVICE'
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

/**
 * Fetch courses from course service
 */
async function fetchCoursesFromCourseService(maxRetries = 3, retryDelay = 3000) {
  console.log('🔍 Fetching courses from course-service...');
  
  const courseServiceUrl = process.env.COURSE_SERVICE_URL || 'http://course-service-api:8002';
  const serviceToken = generateServiceToken();
  
  let attempts = 0;
  
  while (attempts < maxRetries) {
    try {
      const response = await axios.get(`${courseServiceUrl}/courses`, {
        headers: {
          'Authorization': `Bearer ${serviceToken}`
        },
        timeout: 5000
      });
      
      if (response.data && response.data.status === 'success' && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      throw new Error('Invalid response format from course service');
    } catch (error) {
      attempts++;
      console.warn(`⚠️ Attempt ${attempts}/${maxRetries} failed: ${error.message}`);
      
      if (attempts >= maxRetries) {
        console.error('❌ Failed to fetch courses from course service after maximum retries');
        return [];
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

/**
 * Fetch users from auth service
 */
async function fetchUsersFromAuthService(maxRetries = 3, retryDelay = 3000) {
  console.log('🔍 Fetching users from auth-service...');
  
  const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service-api:8001';
  const serviceToken = generateServiceToken();
  
  let attempts = 0;
  
  while (attempts < maxRetries) {
    try {
      const response = await axios.get(`${authServiceUrl}/users`, {
        headers: {
          'Authorization': `Bearer ${serviceToken}`
        },
        timeout: 5000
      });
      
      if (response.data && response.data.status === 'success' && Array.isArray(response.data.data)) {
        // Filter only student users
        return response.data.data.filter(user => 
          user.role === 'DIKE' || user.role === 'UMUM'
        );
      }
      
      throw new Error('Invalid response format from auth service');
    } catch (error) {
      attempts++;
      console.warn(`⚠️ Attempt ${attempts}/${maxRetries} failed: ${error.message}`);
      
      if (attempts >= maxRetries) {
        console.error('❌ Failed to fetch users from auth service after maximum retries');
        // Return fallback test users
        return [
          { id: 'test-user-1', name: 'Test Student 1', role: 'DIKE' },
          { id: 'test-user-2', name: 'Test Student 2', role: 'UMUM' }
        ];
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

// Single assignment template for each course
const assignmentTemplate = {
  title: 'Course Project',
  description: 'Create a comprehensive project that demonstrates your understanding of the course content. Submit a link to your project repository or documentation.',
  points: 100,
  dueDate: new Date('2025-06-30') // Fixed due date instead of dynamic calculation
};

/**
 * Main seeding function
 */
export async function seedAssignments(options = { force: false }) {
  try {
    console.log('🌱 Starting assignment service seeding process...');
    
    // Check if data already exists
    const existingAssignments = await prisma.assignment.count();
    
    if (existingAssignments > 0) {
      console.log(`💡 Found ${existingAssignments} existing assignments`);
      
      if (!options.force) {
        console.log('ℹ️ Using upsert to add any missing data without duplicates');
        // We'll continue with upsert to ensure data consistency
      } else {
        console.log('🧹 Force option set, cleaning existing data...');
        await prisma.submission.deleteMany({});
        await prisma.assignment.deleteMany({});
      }
    } else {
      console.log('📝 No existing assignments found, creating fresh data');
    }
    
    // Fetch courses from course service
    const courses = await fetchCoursesFromCourseService();
    
    if (!courses.length) {
      console.warn('⚠️ No courses found, creating sample assignments with placeholder course IDs');
    } else {
      console.log(`✅ Retrieved ${courses.length} courses from course service`);
    }
    
    // Fetch users from auth service for submissions
    const students = await fetchUsersFromAuthService();
      console.log(`🧑‍🎓 Retrieved ${students.length} students for sample submissions`);
    
    // Create assignments for each course - only one assignment per course
    const createdAssignments = [];
    
    for (const course of (courses.length ? courses : [{ id: 'placeholder-course-1', title: 'Placeholder Course' }])) {      console.log(`📝 Creating single assignment for course: ${course.title}`);
      // Use the fixed due date from template
      const dueDate = assignmentTemplate.dueDate;
      
      // Create one assignment per course
      const assignmentTitle = `Project - ${course.title}`;
      
      // Create the assignment using upsert to prevent duplicates
      const assignment = await prisma.assignment.upsert({
        where: {
          // Use course ID as a unique identifier since there's only one assignment per course
          id: `${course.id}`
        },
        update: {
          title: assignmentTitle,
          description: assignmentTemplate.description,
          dueDate,
          points: assignmentTemplate.points,
          status: 'ACTIVE',
          resourceUrl: `https://drive.google.com/drive/folders/${Buffer.from(course.id).toString('hex').substring(0, 15)}`
        },
        create: {
          id: `${course.id}`,
          title: assignmentTitle,
          description: assignmentTemplate.description,
          courseId: course.id,
          dueDate,
          points: assignmentTemplate.points,
          status: 'ACTIVE',
          resourceUrl: `https://drive.google.com/drive/folders/${Buffer.from(course.id).toString('hex').substring(0, 15)}`
        }
      });      console.log(`✅ Created assignment: ${assignment.title}`);
      createdAssignments.push(assignment);
      
      // Create one submission per student (ensuring each student has only one submission per assignment)
      if (students.length) {
        // Create a submission for each student (max one submission per student per assignment)
        for (const student of students) {
          // 60% chance of a student having submitted the assignment
          const isSubmitted = Math.random() < 0.6;
          
          if (isSubmitted) {
            const submissionContent = `This is a project submission from ${student.name} for "${assignment.title}"`;
            const submissionStatus = 'SUBMITTED'; // Using only SUBMITTED status as per requirements
            const submittedAt = pastDate(Math.floor(Math.random() * 5) + 1); // 1-5 days ago
            // Use only GitHub URL format for consistency
            const fileUrl = `https://github.com/${student.id}/${course.title.toLowerCase().replace(/\s+/g, '-')}-project`;
            
            const submission = await prisma.submission.upsert({
              where: {
                // Using the unique constraint on assignmentId and userId
                assignmentId_userId: {
                  assignmentId: assignment.id,
                  userId: student.id
                }
              },
              update: {
                content: submissionContent,
                submittedAt: submittedAt,
                status: submissionStatus,
                fileUrl: fileUrl
              },
              create: {
                assignmentId: assignment.id,
                userId: student.id,
                content: submissionContent,
                submittedAt: submittedAt,
                status: submissionStatus,
                fileUrl: fileUrl
              }
            });
            
            console.log(`📄 Created submission from ${student.name} for "${assignment.title}"`);
          }
        }
      }
    }
    
    // Summary
    console.log('📊 Seeding summary:');
    console.log(`  - Created ${createdAssignments.length} assignments`);
    
    const submissionCount = await prisma.submission.count();
    console.log(`  - Created ${submissionCount} submissions`);
    
    console.log('🌱 Assignment service seeding completed successfully!');
    
    return {
      success: true,
      message: 'Assignment seeding completed successfully',
      data: {
        assignments: createdAssignments.length,
        submissions: submissionCount
      }
    };
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    
    return {
      success: false,
      message: `Seeding failed: ${error.message}`,
      error
    };
  } finally {
    // Don't disconnect here when used as a module
    if (import.meta.url.endsWith('/prisma/seed.js') || import.meta.url.includes('/seed.js')) {
      await prisma.$disconnect();
    }
  }
}

// Run main function when script is executed directly
if (import.meta.url.endsWith('/prisma/seed.js') || import.meta.url.includes('/seed.js')) {
  const options = {
    force: process.argv.includes('--force')
  };
  
  seedAssignments(options)
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
}