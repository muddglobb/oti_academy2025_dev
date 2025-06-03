import Redis from 'ioredis';
import config from '../config/index.js';
import logger from './logger.js';

// Konfigurasi Redis client
const redisConfig = {
  host: config.REDIS.host || 'redis',
  port: config.REDIS.port || 6379,
  password: config.REDIS.password || undefined,
  family: 0
};

// Buat Redis client
const redisClient = new Redis(redisConfig);

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