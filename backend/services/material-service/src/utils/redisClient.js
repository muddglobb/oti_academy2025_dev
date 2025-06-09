import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient;

if (process.env.REDIS_URL) {
  // Menggunakan REDIS_URL dengan family=0 untuk Railway
  const redisUrl = process.env.REDIS_URL.includes('?') 
    ? `${process.env.REDIS_URL}&family=0`
    : `${process.env.REDIS_URL}?family=0`;
    
  redisClient = new Redis(redisUrl);
} else {
  // Fallback ke konfigurasi individual
  redisClient = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    family: 0 // Dual stack lookup untuk Railway
  });
}
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
    
    if (cachedData) {
      return JSON.parse(cachedData);
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Redis getCache error for key ${key}: ${error.message}`);
    return null;
  }
};

export const setCache = async (key, data, ttl = 3600) => {
  try {
    const result = await redisClient.set(key, JSON.stringify(data), 'EX', ttl);
    return result === 'OK';
  } catch (error) {
    console.error(`Redis setCache error for key ${key}: ${error.message}`);
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
      const result = await redisClient.del(...keys); // <- Fix: spread keys
      return result > 0;
    }
    return true;
  } catch (error) {
    console.error(`Redis deletePattern error for pattern ${pattern}: ${error.message}`);
    return false;
  }
};

export default redisClient;