const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { sendWelcomeEmail, verifyEmailExists } = require('../services/emailService');
const countries = require('../data/countries');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register new user
const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { fullName, email, password, nationality, gender, age, travelMode } = req.body;

    // Check if email exists
    const emailExists = await verifyEmailExists(email);
    if (!emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Enter correct email id'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      password,
      nationality,
      gender,
      age: parseInt(age),
      travelMode
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Set token as httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send welcome email
    await sendWelcomeEmail(email, fullName);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        nationality: user.nationality,
        gender: user.gender,
        age: user.age,
        travelMode: user.travelMode
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Set token as httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Try to log in with passport for session-based auth compatibility
    // But don't let it block the response if it fails
    if (req.login) {
      req.login(user, (err) => {
        if (err) {
          console.error('Passport login error:', err);
          // Don't return error, continue with JWT-based response
        }
      });
    }

    // Send response immediately (don't wait for passport login)
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        nationality: user.nationality,
        gender: user.gender,
        age: user.age,
        travelMode: user.travelMode
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    // Logout from passport session if exists
    if (req.logout) {
      req.logout((err) => {
        if (err) {
          console.error('Passport logout error:', err);
        }
        
        // Destroy session after passport logout
        if (req.session) {
          req.session.destroy((err) => {
            if (err) {
              console.error('Session destroy error:', err);
            }
            
            // Send response after session is destroyed
            res.json({
              success: true,
              message: 'Logged out successfully'
            });
          });
        } else {
          // No session to destroy, send response
          res.json({
            success: true,
            message: 'Logged out successfully'
          });
        }
      });
    } else {
      // No passport logout needed, just destroy session if exists
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            console.error('Session destroy error:', err);
          }
          
          res.json({
            success: true,
            message: 'Logged out successfully'
          });
        });
      } else {
        // No session to destroy
        res.json({
          success: true,
          message: 'Logged out successfully'
        });
      }
    }
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// Get countries list
const getCountries = async (req, res) => {
  try {
    res.json({
      success: true,
      countries
    });
  } catch (error) {
    console.error('Get countries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Google OAuth callback
const googleCallback = async (req, res) => {
  try {
    const token = generateToken(req.user._id);
    
    // Set token as httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/auth/error`);
  }
};

module.exports = {
  register,
  login,
  logout, // Export logout function
  getCountries,
  googleCallback
};