import { PrismaClient } from '@prisma/client';
import fs from 'fs';
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

  const results = [];
  const errors = [];
  let importedCount = 0;
  
  // Process CSV file
  await new Promise((resolve, reject) => {
    fs.createReadStream(req.file.path)
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

  // Delete temp file
  fs.unlinkSync(req.file.path);

  // Process data and insert into database
  if (results.length > 0) {
    for (const student of results) {
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