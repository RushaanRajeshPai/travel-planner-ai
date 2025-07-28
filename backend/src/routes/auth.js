const express = require('express');
const passport = require('passport');
const { body } = require('express-validator');
const {
  register,
  login,
  getCountries,
  googleCallback,
  logout // Add this import
} = require('../controllers/authController');

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('nationality')
    .notEmpty()
    .withMessage('Nationality is required'),
  
  body('gender')
    .isIn(['Male', 'Female', 'Prefer not to say'])
    .withMessage('Please select a valid gender'),
  
  body('age')
    .isInt({ min: 1, max: 120 })
    .withMessage('Age must be between 1 and 120'),
  
  body('travelMode')
    .isIn(['Relaxation', 'Trekking', 'Exploring cultural heritage', 'Educational', 'Honeymoon'])
    .withMessage('Please select a valid travel mode')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout); // Add logout route
router.get('/countries', getCountries);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/error' }),
  googleCallback
);

module.exports = router;