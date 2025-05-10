import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding enrollment database...');
  
  // Note: In a real application, you would need to ensure that
  // the referenced User, Course, and Package records exist.
  // This is just a placeholder for demonstration purposes.
  
  // You can add sample data here if needed for testing
  
  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
