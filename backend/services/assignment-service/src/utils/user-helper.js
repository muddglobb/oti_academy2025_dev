import axios from 'axios';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

/**
 * Helper class for user data operations
 */
export class UserHelper {
  /**
   * Get user data from user service
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  static async getUserData(userId) {
    try {
      const userServiceUrl = config.AUTH_SERVICE_URL || 'http://auth-service-api:8001';
      const serviceToken = UserHelper.generateServiceToken();
      
      const response = await axios.get(
        `${userServiceUrl}/users/${userId}`,
        { 
          headers: { 'Authorization': `Bearer ${serviceToken}` },
          timeout: 5000 
        }
      );
      
      if (response.data && response.data.status === 'success') {
        return {
          id: response.data.data.id,
          name: response.data.data.name,
          email: response.data.data.email
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching user data for ${userId}:`, error.message);
      return null;
    }
  }

  /**
   * Enhance submissions with user data
   * @param {Array} submissions - Array of submissions
   * @returns {Promise<Array>} Enhanced submissions with user data
   */
  static async enhanceSubmissionsWithUserData(submissions) {
    try {
      // Get unique user IDs
      const userIds = [...new Set(submissions.map(sub => sub.userId))];
      
      // Get user data in parallel
      const userDataPromises = userIds.map(userId => UserHelper.getUserData(userId));
      const userDataResults = await Promise.all(userDataPromises);
      
      // Create a mapping of userId to user data
      const userDataMap = {};
      userIds.forEach((userId, index) => {
        if (userDataResults[index]) {
          userDataMap[userId] = userDataResults[index];
        }
      });
      
      // Enhance submissions with user data
      return submissions.map(submission => ({
        ...submission,
        user: userDataMap[submission.userId] || { id: submission.userId }
      }));
    } catch (error) {
      console.error('Error enhancing submissions with user data:', error);
      return submissions; // Return original submissions if enhancement fails
    }
  }

  /**
   * Generate JWT token for service-to-service communication
   * @returns {string} JWT token
   */
  static generateServiceToken() {
    const payload = {
      service: 'assignment-service',
      role: 'SERVICE'
    };
    
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' });
  }
}