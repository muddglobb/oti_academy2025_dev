import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/index.js';
import { ApiResponse } from '../utils/api-response.js';

// Membuat direktori upload jika belum ada
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi storage untuk file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// Filter file berdasarkan tipe yang diizinkan
const fileFilter = (req, file, cb) => {
  const allowedTypes = config.ALLOWED_FILE_TYPES;
  const fileExt = path.extname(file.originalname).substring(1).toLowerCase();
  
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Middleware untuk upload file tugas
export const uploadAssignment = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.MAX_FILE_SIZE
  }
}).single('file');

// Wrapper untuk menangani error
export const handleUpload = (req, res, next) => {
  uploadAssignment(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer error
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json(
          ApiResponse.error(`File too large. Maximum size: ${config.MAX_FILE_SIZE / (1024 * 1024)}MB`)
        );
      }
      return res.status(400).json(ApiResponse.error(err.message));
    } else if (err) {
      // Other errors
      return res.status(400).json(ApiResponse.error(err.message));
    }
    
    // If file was uploaded successfully, add file URL to request
    if (req.file) {
      // In production, this would likely be a cloud storage URL
      req.fileUrl = `/uploads/${req.file.filename}`;
    }
    
    next();
  });
};