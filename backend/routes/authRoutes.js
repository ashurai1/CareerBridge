import express from 'express';
import { body } from 'express-validator';
import {
    signup,
    login,
    getMe,
    updateProfile,
    changePassword,
} from '../controllers/authController.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { protect } from '../middleware/auth.js';

dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

const socialCallback = (req, res) => {
    const token = generateToken(req.user._id);
    const redirectUrl = `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/oauth-success?token=${token}`;
    res.redirect(redirectUrl);
};

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

// OAuth Routes
// Google
// Google
router.get('/google', (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.status(500).json({
            success: false,
            message: 'Google Login not configured. Missing API keys.',
        });
    }
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.status(500).json({
            success: false,
            message: 'Google Login not configured.',
        });
    }
    passport.authenticate('google', { session: false, failureRedirect: '/login' })(req, res, next);
}, socialCallback);

// Twitter


// GitHub
// GitHub
router.get('/github', (req, res, next) => {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
        return res.status(500).json({
            success: false,
            message: 'GitHub Login not configured. Missing API keys.',
        });
    }
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

router.get('/github/callback', (req, res, next) => {
    passport.authenticate('github', { session: false, failureRedirect: '/login' })(req, res, next);
}, socialCallback);

// LinkedIn
router.get('/linkedin', (req, res, next) => {
    if (!process.env.LINKEDIN_KEY || !process.env.LINKEDIN_SECRET) {
        return res.status(500).json({
            success: false,
            message: 'LinkedIn Login not configured. Missing API keys.',
        });
    }
    passport.authenticate('linkedin')(req, res, next);
});

router.get('/linkedin/callback', (req, res, next) => {
    passport.authenticate('linkedin', { session: false, failureRedirect: '/login' })(req, res, next);
}, socialCallback);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
