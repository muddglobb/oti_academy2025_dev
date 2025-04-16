import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 8001,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',
};

export default config;