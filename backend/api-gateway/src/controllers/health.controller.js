import axios from 'axios';
import dotenv from 'dotenv';
import config from '../config/index.js';

export const checkHealth = async (req, res) => {
  const services = {
    gateway: { status: 'up' },
    auth: { status: 'unknown' }
  };
  
  try {
    // Check auth service
    const authRes = await axios.get(`${config.AUTH_SERVICE_URL}/health`, { timeout: 3000 });
    services.auth = {
      status: authRes.status === 200 ? 'up' : 'down',
      message: authRes.data?.message || null
    };
  } catch (error) {
    services.auth = {
      status: 'down',
      message: error.message
    };
  }
  
  const overallStatus = Object.values(services).every(s => s.status === 'up') ? 'healthy' : 'degraded';
  
  res.status(200).json({
    status: 'success',
    message: `System is ${overallStatus}`,
    timestamp: new Date().toISOString(),
    services
  });
};