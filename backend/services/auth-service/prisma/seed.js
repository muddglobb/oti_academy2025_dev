import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// Get admin password from environment or use a secure default only for development
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function main() {
  try {
    // Validate password exists
    if (!ADMIN_PASSWORD) {
      console.error('Error: ADMIN_PASSWORD environment variable is required');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'omahtiacademy@gmail.com' }
    });

    // If admin doesn't exist, create it
    if (!existingAdmin) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

      // Create admin user
      const admin = await prisma.user.create({
        data: {
          name: 'OTI Academy',
          email: 'omahtiacademy@gmail.com',
          password: hashedPassword,
          role: 'ADMIN',
          type: 'UMUM', 
        },
      });

      console.log('Admin account created:', admin.email);
    } else {
      console.log('Admin account already exists');
    }
  } catch (error) {
    console.error('Error creating admin account:', error);
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