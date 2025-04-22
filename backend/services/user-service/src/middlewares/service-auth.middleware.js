import { ApiResponse } from '../utils/api-response.js';

export const verifyServiceApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // Dapatkan API key yang valid dari environment variable
  const validApiKey = process.env.SERVICE_API_KEY;
  
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json(
      ApiResponse.error('Invalid API key for service-to-service communication')
    );
  }
  
  next();
};