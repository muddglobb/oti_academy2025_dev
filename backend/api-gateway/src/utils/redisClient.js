import Redis from 'ioredis';
import config from '../config/index.js';
import logger from './logger.js';

// Create Redis client using configuration from config file
const redisClient = new Redis({
  host: config.REDIS.host,
  port: config.REDIS.port,
  password: config.REDIS.password || undefined
});

// Handle connection events
redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('error', (err) => {
  logger.error(`Redis client error: ${err.message}`);
});

// No need for explicit connect with ioredis, it connects automatically

export default redisClient;