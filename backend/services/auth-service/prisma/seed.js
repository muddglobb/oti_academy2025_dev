import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'omahtiacademy@gmail.com' }
    });

    // If admin doesn't exist, create it
    if (!existingAdmin) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Azh@riB3St6969!', salt);

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