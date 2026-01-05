import express from 'express';
import { body } from 'express-validator';
import {
    signup,
    login,
    getMe,
    updateProfile,
    changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const signupValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/(?=.*[a-z])/)
        .withMessage('Password must contain a lowercase letter')
        .matches(/(?=.*[A-Z])/)
        .withMessage('Password must contain an uppercase letter')
        .matches(/(?=.*\d)/)
        .withMessage('Password must contain a number'),
    body('role')
        .optional()
        .isIn(['candidate', 'employer'])
        .withMessage('Role must be either candidate or employer'),
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

// Public routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
