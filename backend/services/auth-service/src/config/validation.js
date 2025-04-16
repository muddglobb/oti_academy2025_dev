import { body } from 'express-validator';

export const registerValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
];

export const loginValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
];

export const resetPasswordValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long'),
];

export const changePasswordValidation = [
    body('oldPassword').notEmpty().withMessage('Old password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long'),
];