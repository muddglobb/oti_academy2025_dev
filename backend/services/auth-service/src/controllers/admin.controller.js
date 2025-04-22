import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { asyncHandler } from '../middleware/async.middleware.js';
import { ApiResponse } from '../utils/api-response.js';
import authService from '../services/authService.js';

const prisma = new PrismaClient();

/**
 * Import DikeStudent data from CSV file
 * Expected CSV format: name,nim,email
 */
export const importDikeStudents = asyncHandler(async (req, res) => {
  // Check if file exists
  if (!req.file) {
    return res.status(400).json(
      ApiResponse.error('No CSV file uploaded')
    );
  }

  // Security: Validate file path is within uploads directory
  const uploadDir = path.resolve(process.cwd(), 'uploads');
  const filePath = path.resolve(req.file.path);
  
  if (!filePath.startsWith(uploadDir)) {
    return res.status(400).json(
      ApiResponse.error('Invalid file path')
    );
  }

  const results = [];
  const errors = [];
  let importedCount = 0;
  
  // Process CSV file
  try {
    await new Promise((resolve, reject) => {
      // Security: Now using validated filePath
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => {
          // Validate required fields
          if (!data.name || !data.nim || !data.email) {
            errors.push({
              row: results.length + 1,
              error: 'Missing required fields (name, nim, or email)',
              data
            });
          } else {
            results.push({
              name: data.name.trim(),
              nim: data.nim.trim(),
              email: data.email.trim().toLowerCase()
            });
          }
        })
        .on('end', resolve)
        .on('error', (error) => {
          errors.push({
            error: 'CSV parsing error: ' + error.message
          });
          reject(error);
        });
    });
  } catch (error) {
    return res.status(400).json(
      ApiResponse.error('Error processing CSV file: ' + error.message)
    );
  }

  // Delete temp file - using validated filePath
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Failed to delete temp file:', error);
    // Continue processing even if file deletion fails
  }

  // Process data and insert into database
  if (results.length > 0) {
    // Limit the number of records processed at once
    const BATCH_SIZE = 100;
    const batches = Math.ceil(results.length / BATCH_SIZE);

    for (let i = 0; i < batches; i++) {
      const batch = results.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
      
      for (const student of batch) {
        try {
          // Check if student already exists
          const existingStudent = await prisma.dikeStudent.findFirst({
            where: {
              OR: [
                { nim: student.nim },
                { email: student.email }
              ]
            }
          });

          if (existingStudent) {
            errors.push({
              nim: student.nim,
              email: student.email,
              error: 'Student with this NIM or email already exists'
            });
            continue;
          }

          // Create new student
          await prisma.dikeStudent.create({
            data: student
          });

          importedCount++;
        } catch (error) {
          errors.push({
            data: student,
            error: error.message
          });
        }
      }
    }
  }

  res.status(200).json(
    ApiResponse.success({
      totalProcessed: results.length,
      imported: importedCount,
      errors: errors.length ? errors : null
    }, `Successfully imported ${importedCount} DIKE students`)
  );
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;
  
  if (!userId || !role) {
    return res.status(400).json(
      ApiResponse.error('User ID and role are required')
    );
  }
  
  try {
    const updatedUser = await authService.updateUserRole(userId, role);
    
    res.status(200).json(
      ApiResponse.success(updatedUser, 'User role updated successfully')
    );
  } catch (error) {
    const statusCode = error.message.includes('Invalid role') ? 400 : 500;
    res.status(statusCode).json(
      ApiResponse.error(error.message)
    );
  }
});