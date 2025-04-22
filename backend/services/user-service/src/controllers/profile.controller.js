import { profileService } from '../services/profile.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { prisma } from '../index.js';

/**
 * Get profile by ID
 * @route GET /profiles/:id
 */
export const getProfileById = async (req, res, next) => {
  try {
    const profileId = parseInt(req.params.id, 10);
    
    // Check if user is requesting own profile or has admin rights
    const isOwnProfile = req.user.id === profileId;
    const isAdmin = req.user.role === 'ADMIN';
    
    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json(
        ApiResponse.error('Access denied. You can only view your own profile')
      );
    }
    
    const profile = await profileService.getProfileById(profileId);
    
    if (!profile) {
      return res.status(404).json(
        ApiResponse.error('Profile not found')
      );
    }
    
    res.status(200).json(
      ApiResponse.success(profile)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all profiles (admin only)
 * @route GET /profiles
 */
export const getAllProfiles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const result = await profileService.getAllProfiles(
      parseInt(page, 10),
      parseInt(limit, 10),
      status
    );
    
    res.status(200).json(
      ApiResponse.success(result)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update profile by ID
 * @route PUT /profiles/:id
 */
export const updateProfile = async (req, res, next) => {
  try {
    const profileId = parseInt(req.params.id, 10);
    const profileData = req.body;
    
    // Check if user is updating own profile or has admin rights
    const isOwnProfile = req.user.id === profileId;
    const isAdmin = req.user.role === 'ADMIN';
    
    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json(
        ApiResponse.error('Access denied. You can only update your own profile')
      );
    }
    
    // Only admin can update status
    if (profileData.status && !isAdmin) {
      delete profileData.status;
    }
    
    // Check if profile exists
    const existingProfile = await profileService.getProfileById(profileId);
    
    if (!existingProfile) {
      return res.status(404).json(
        ApiResponse.error('Profile not found')
      );
    }
    
    const updatedProfile = await profileService.updateProfile(profileId, profileData);
    
    res.status(200).json(
      ApiResponse.success(updatedProfile, 'Profile updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Initialize profile for a new user
 * @route POST /profiles
 * Internal use by Auth Service after user registration
 */
export const initializeProfile = async (req, res, next) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json(
          ApiResponse.error('User ID is required')
        );
      }
      
      // First check if the User record exists in the database
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(userId) }
      });
      
      if (!userExists) {
        return res.status(404).json(
          ApiResponse.error('User not found. Please ensure the user is created in auth-service first')
        );
      }
      
      // Check if profile already exists
      const existingProfile = await profileService.getProfileById(parseInt(userId));
      
      if (existingProfile) {
        return res.status(200).json(
          ApiResponse.success(existingProfile, 'Profile already exists')
        );
      }
      
      const newProfile = await profileService.createProfile(parseInt(userId));
      
      res.status(201).json(
        ApiResponse.success(newProfile, 'Profile initialized successfully')
      );
    } catch (error) {
      console.error(`Profile initialization error: ${error.message}`);
      next(error);
    }
  };

/**
 * Update last login timestamp
 * @route PUT /profiles/:id/login
 * Internal use by Auth Service after successful login
 */
export const updateLastLogin = async (req, res, next) => {
  try {
    const profileId = parseInt(req.params.id, 10);
    
    const updatedProfile = await profileService.updateLastLogin(profileId);
    
    if (!updatedProfile) {
      return res.status(404).json(
        ApiResponse.error('Profile not found')
      );
    }
    
    res.status(200).json(
      ApiResponse.success(updatedProfile, 'Login timestamp updated')
    );
  } catch (error) {
    next(error);
  }
};