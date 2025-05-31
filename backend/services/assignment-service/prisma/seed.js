import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

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
          { id: 'test-user-1', name: 'Test Student 1', email: 'test1@example.com', role: 'DIKE' },
          { id: 'test-user-2', name: 'Test Student 2', email: 'test2@example.com', role: 'UMUM' },
          { id: 'test-user-3', name: 'Test Student 3', email: 'test3@example.com', role: 'DIKE' },
          { id: 'test-user-4', name: 'Test Student 4', email: 'test4@example.com', role: 'UMUM' }
        ];
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

/**
 * Create assignment for a specific course
 */
async function createAssignmentForCourse(course, assignmentNumber = 1) {
  const assignmentTitle = `Final Project - ${course.title}`;
  const dueDate = futureDate(30); // 30 days from now
  
  // Generate unique assignment ID based on course ID to ensure one assignment per course
  const assignmentId = `assignment-${course.id}`;
  
  const assignment = await prisma.assignment.upsert({
    where: {
      id: assignmentId
    },
    update: {
      title: assignmentTitle,
      description: `Complete a comprehensive final project for ${course.title}. This project should demonstrate your mastery of the course concepts and practical application of the skills learned.`,
      dueDate,
      points: 100,
      status: 'ACTIVE',
      resourceUrl: `https://drive.google.com/drive/folders/course-${course.id}-resources`
    },
    create: {
      id: assignmentId,
      title: assignmentTitle,
      description: `Complete a comprehensive final project for ${course.title}. This project should demonstrate your mastery of the course concepts and practical application of the skills learned.`,
      courseId: course.id,
      dueDate,
      points: 100,
      status: 'ACTIVE',
      resourceUrl: `https://drive.google.com/drive/folders/course-${course.id}-resources`
    }
  });
  
  return assignment;
}

/**
 * Create submissions for an assignment
 */
async function createSubmissionsForAssignment(assignment, students, course) {
  const submissions = [];
  
  for (const student of students) {
    // 70% chance of a student having submitted the assignment
    const hasSubmitted = Math.random() < 0.7;
    
    if (hasSubmitted) {
      const submittedAt = pastDate(Math.floor(Math.random() * 10) + 1); // 1-10 days ago
      const fileUrl = `https://github.com/${student.id}/${course.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-final-project`;
      
      try {
        const submission = await prisma.submission.upsert({
          where: {
            assignmentId_userId: {
              assignmentId: assignment.id,
              userId: student.id
            }
          },
          update: {
            submittedAt: submittedAt,
            status: 'SUBMITTED',
            fileUrl: fileUrl
          },
          create: {
            assignmentId: assignment.id,
            userId: student.id,
            submittedAt: submittedAt,
            status: 'SUBMITTED',
            fileUrl: fileUrl
          }
        });
        
        submissions.push(submission);
        console.log(`  📄 Created submission from ${student.name || student.email || student.id}`);
      } catch (error) {
        console.warn(`  ⚠️ Failed to create submission for student ${student.id}: ${error.message}`);
      }
    }
  }
  
  return submissions;
}

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
        console.log('ℹ️ Continuing with upsert to ensure data consistency');
      } else {
        console.log('🧹 Force option set, cleaning existing data...');
        await prisma.submission.deleteMany({});
        await prisma.assignment.deleteMany({});
        console.log('✅ Cleaned existing data');
      }
    } else {
      console.log('📝 No existing assignments found, creating fresh data');
    }
    
    // Fetch courses from course service
    const courses = await fetchCoursesFromCourseService();
    
    if (!courses.length) {
      console.warn('⚠️ No courses found from course service, using placeholder courses');
      // Create placeholder courses for testing
      const placeholderCourses = [
        { id: 'course-1', title: 'Data Science Fundamentals' },
        { id: 'course-2', title: 'Web Development Bootcamp' },
        { id: 'course-3', title: 'Machine Learning Basics' }
      ];
      courses.push(...placeholderCourses);
    } else {
      console.log(`✅ Retrieved ${courses.length} courses from course service`);
    }
    
    // Fetch users from auth service for submissions
    const students = await fetchUsersFromAuthService();
    console.log(`🧑‍🎓 Retrieved ${students.length} students for sample submissions`);
    
    // Create assignments and submissions
    const createdAssignments = [];
    let totalSubmissions = 0;
    
    console.log(`\n📚 Creating assignments for ${courses.length} courses...`);
    
    for (const course of courses) {
      console.log(`\n📝 Processing course: ${course.title} (ID: ${course.id})`);
      
      try {
        // Create one assignment for this course
        const assignment = await createAssignmentForCourse(course);
        console.log(`  ✅ Created assignment: ${assignment.title}`);
        createdAssignments.push(assignment);
        
        // Create submissions for this assignment
        const submissions = await createSubmissionsForAssignment(assignment, students, course);
        totalSubmissions += submissions.length;
        console.log(`  📊 Created ${submissions.length} submissions for this assignment`);
        
      } catch (error) {
        console.error(`  ❌ Failed to process course ${course.title}: ${error.message}`);
      }
    }
    
    // Final summary
    console.log('\n📊 Seeding Summary:');
    console.log(`  🎯 Courses processed: ${courses.length}`);
    console.log(`  📝 Assignments created: ${createdAssignments.length}`);
    console.log(`  📄 Submissions created: ${totalSubmissions}`);
    console.log(`  🧑‍🎓 Students available: ${students.length}`);
    
    // Verify final counts
    const finalAssignmentCount = await prisma.assignment.count();
    const finalSubmissionCount = await prisma.submission.count();
    
    console.log('\n🔍 Database Verification:');
    console.log(`  📝 Total assignments in database: ${finalAssignmentCount}`);
    console.log(`  📄 Total submissions in database: ${finalSubmissionCount}`);
    
    console.log('\n🌱 Assignment service seeding completed successfully!');
    
    return {
      success: true,
      message: 'Assignment seeding completed successfully',
      data: {
        coursesProcessed: courses.length,
        assignmentsCreated: createdAssignments.length,
        submissionsCreated: totalSubmissions,
        studentsAvailable: students.length
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