import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use more secure filename generation
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // Remove any potentially dangerous characters from original filename
    const safeFilename = path.basename(file.originalname).replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `csv-${uniqueSuffix}-${safeFilename}`);
  }
});

// File filter for CSV files - stricter validation
const fileFilter = (req, file, cb) => {
  // Check MIME type AND extension
  const isCSV = 
    (file.mimetype === 'text/csv' || file.mimetype === 'application/csv') && 
    file.originalname.toLowerCase().endsWith('.csv');
  
  if (isCSV) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed'), false);
  }
};

// Export multer middleware with stricter limits
export const uploadCSV = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit (reduced from 5MB)
    files: 1 // Only 1 file at a time
  }
}).single('file');