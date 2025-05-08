import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisOptions = {
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    // Reconnection strategy
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
};

// Create Redis client
const redisClient = new Redis(redisOptions);

// Handle connection events
redisClient.on('connect', () => {
  console.log('✅ Redis client connected');
});

redisClient.on('error', (err) => {
  console.error(`❌ Redis client error: ${err.message}`);
});

// Redis helpers
export const getCache = async (key) => {
  try {
    const cachedData = await redisClient.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error(`Redis getCache error: ${error.message}`);
    return null;
  }
};

export const setCache = async (key, data, ttl = 3600) => {
  try {
    await redisClient.set(key, JSON.stringify(data), 'EX', ttl);
    return true;
  } catch (error) {
    console.error(`Redis setCache error: ${error.message}`);
    return false;
  }
};

export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error(`Redis deleteCache error: ${error.message}`);
    return false;
  }
};

export const deletePattern = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    console.error(`Redis deletePattern error: ${error.message}`);
    return false;
  }
};

export default redisClient;