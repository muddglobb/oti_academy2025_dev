import Joi from 'joi';
import { validate } from '../middlewares/validator.middleware.js';

// Schema for validating profile updates
const updateProfileSchema = Joi.object({
  bio: Joi.string().max(500).allow('', null),
  avatar: Joi.string().uri().allow('', null),
  location: Joi.string().max(100).allow('', null),
  website: Joi.string().uri().max(200).allow('', null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'SUSPENDED') // Admin only
}).min(1);

// Schema for validating profile ID
const profileIdSchema = Joi.object({
  id: Joi.number().integer().required()
});

// Middleware for validating profile update requests
export const validateUpdateProfile = validate(updateProfileSchema);

// Middleware for validating profile ID in params
export const validateProfileId = validate(profileIdSchema, 'params');