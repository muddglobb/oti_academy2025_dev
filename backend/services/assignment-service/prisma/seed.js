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
  
  const courseServiceUrl = process.env.COURSE_SERVICE_URL || 'http://course-service:8002';
  const serviceToken = generateServiceToken();
  
  let attempts = 0;
  
  while (attempts < maxRetries) {
    try {
      const response = await axios.get(`${courseServiceUrl}/api/courses`, {
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
  
  const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:8001';
  const serviceToken = generateServiceToken();
  
  let attempts = 0;
  
  while (attempts < maxRetries) {
    try {
      const response = await axios.get(`${authServiceUrl}/api/users`, {
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

// Sample assignment templates to create assignments for various courses
const assignmentTemplates = [
  {
    title: 'Introduction Assignment',
    description: 'Submit a brief introduction about yourself and your expectations for this course.',
    points: 10,
    daysFromNow: 7,
    durationDays: 7
  },
  {
    title: 'Research Paper',
    description: 'Research and write a paper on a topic related to the course material. Minimum 1000 words with citations.',
    points: 30,
    daysFromNow: 14,
    durationDays: 14
  },
  {
    title: 'Group Project',
    description: 'Work in groups of 3-5 to develop a solution to the provided problem statement.',
    points: 50,
    daysFromNow: 21,
    durationDays: 21
  },
  {
    title: 'Practical Exercise',
    description: 'Complete the practical exercise in the attached worksheet and submit your solutions.',
    points: 20,
    daysFromNow: 10,
    durationDays: 5
  },
  {
    title: 'Final Project',
    description: 'Create a comprehensive final project that demonstrates your understanding of all course concepts.',
    points: 100,
    daysFromNow: 30,
    durationDays: 14
  }
];

/**
 * Main seeding function
 */
export async function seedAssignments(options = { force: false }) {
  try {
    console.log('🌱 Starting assignment service seeding process...');
    
    // Check if data already exists
    const existingAssignments = await prisma.assignment.count();
    
    if (existingAssignments > 0 && !options.force) {
      console.log('💡 Assignments already exist in the database, skipping seed');
      return {
        success: true,
        message: 'Assignments already exist, seeding skipped',
        data: { existingCount: existingAssignments }
      };
    }
    
    // Clean existing data if force option is set
    if (options.force) {
      console.log('🧹 Force option set, cleaning existing data...');
      await prisma.submission.deleteMany({});
      await prisma.assignment.deleteMany({});
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
    
    // Create assignments for each course
    const createdAssignments = [];
    
    for (const course of (courses.length ? courses : [{ id: 'placeholder-course-1', title: 'Placeholder Course' }])) {
      // Create 2-3 random assignments per course
      const assignmentCount = Math.floor(Math.random() * 2) + 2; // 2 to 3 assignments
      
      console.log(`📝 Creating ${assignmentCount} assignments for course: ${course.title}`);
      
      for (let i = 0; i < assignmentCount; i++) {
        // Select a random assignment template
        const template = assignmentTemplates[Math.floor(Math.random() * assignmentTemplates.length)];
        
        // Calculate due date
        const dueDate = futureDate(template.daysFromNow);
        
        // Create the assignment
        const assignment = await prisma.assignment.create({
          data: {
            title: `${template.title} - ${course.title}`,
            description: template.description,
            courseId: course.id,
            dueDate,
            points: template.points,
            status: 'ACTIVE'
          }
        });
        
        console.log(`✅ Created assignment: ${assignment.title}`);
        createdAssignments.push(assignment);
        
        // Create some sample submissions (for assignments with "past" due dates)
        if (students.length && Math.random() > 0.5) {
          const submissionCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 submissions
          
          for (let j = 0; j < submissionCount; j++) {
            // Select a random student
            const student = students[Math.floor(Math.random() * students.length)];
            
            const isSubmitted = Math.random() > 0.3; // 70% chance of being submitted
            
            if (isSubmitted) {
              // Create submission
              const submission = await prisma.submission.create({
                data: {
                  assignmentId: assignment.id,
                  userId: student.id,
                  content: `This is a sample submission from ${student.name} for the assignment "${assignment.title}"`,
                  submittedAt: pastDate(Math.floor(Math.random() * 5) + 1), // 1-5 days ago
                  status: Math.random() > 0.5 ? 'SUBMITTED' : 'GRADED',
                  score: Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 1 : null, // 50% chance of being graded
                  feedback: Math.random() > 0.5 ? 'Good job!' : null
                }
              });
              
              console.log(`📄 Created submission from ${student.name} for "${assignment.title}"`);
            }
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