import { prisma } from '../index.js';

export const profileService = {
  /**
   * Get profile by user ID
   * @param {number} id User ID
   * @returns {Promise<Object>} User profile with user data
   */
  getProfileById: async (id) => {
    return prisma.userProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
            type: true,
            nim: true
          }
        }
      }
    });
  },
  
  /**
   * Get all profiles with pagination
   * @param {number} page Page number
   * @param {number} limit Items per page
   * @param {string} status Optional filter by status
   * @returns {Promise<Object>} Paginated profiles
   */
  getAllProfiles: async (page = 1, limit = 10, status = null) => {
    const skip = (page - 1) * limit;
    
    // Build where clause based on filters
    const where = {};
    if (status) {
      where.status = status;
    }
    
    const [profiles, total] = await Promise.all([
      prisma.userProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              role: true,
              type: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      }),
      prisma.userProfile.count({ where })
    ]);
    
    return {
      profiles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  },
  
  /**
   * Update user profile
   * @param {number} id User ID
   * @param {Object} data Profile data to update
   * @returns {Promise<Object>} Updated profile
   */
  updateProfile: async (id, data) => {
    // Filter allowed fields to prevent updating protected fields
    const { bio, avatar, location, website, status } = data;
    
    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;
    if (status !== undefined) updateData.status = status;
    
    return prisma.userProfile.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
            type: true,
            nim: true
          }
        }
      }
    });
  },
  
  /**
   * Create new profile for user
   * @param {number} userId User ID
   * @returns {Promise<Object>} Created profile
   */
  createProfile: async (userId) => {
    return prisma.userProfile.create({
      data: {
        id: userId,
        status: 'ACTIVE'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
  },
  
  /**
   * Update last login timestamp
   * @param {number} id User ID
   * @returns {Promise<Object>} Updated profile
   */
  updateLastLogin: async (id) => {
    return prisma.userProfile.update({
      where: { id },
      data: {
        lastLoginAt: new Date()
      }
    });
  }
};