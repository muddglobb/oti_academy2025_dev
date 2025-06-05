import Redis from 'ioredis';
import dotenv from 'dotenv';
import logger from './logger.js';

// Load environment variables
dotenv.config();

let redisClient;

if (process.env.REDIS_URL) {
  // Jika menggunakan REDIS_URL, tambahkan family=0 untuk Railway
  const redisUrl = process.env.REDIS_URL.includes('?') 
    ? `${process.env.REDIS_URL}&family=0`
    : `${process.env.REDIS_URL}?family=0`;
    
  redisClient = new Redis(redisUrl);
} else {
  // Fallback ke konfigurasi manual
  redisClient = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    family: 0 // Enable dual stack lookup untuk Railway
  });
}

// Event handlers
redisClient.on('connect', () => {
  logger.info('Redis client connecting');
});

redisClient.on('ready', () => {
  logger.info('Redis client connected and ready');
});

redisClient.on('error', (err) => {
  logger.error(`Redis client error: ${err.message}`);
});

redisClient.on('reconnecting', () => {
  logger.warn('Redis client reconnecting');
});

redisClient.on('end', () => {
  logger.warn('Redis client connection closed');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    if (redisClient.status === 'ready') {
      await redisClient.quit();
      logger.info('Redis connection closed due to application termination');
    }
  } catch (error) {
    logger.error(`Error during Redis shutdown: ${error.message}`);
  } finally {
    process.exit(0);
  }
});

export default redisClient;