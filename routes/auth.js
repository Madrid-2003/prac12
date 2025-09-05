// // // // // const express = require('express');
// // // // // const bcrypt = require('bcryptjs');
// // // // // const jwt = require('jsonwebtoken');
// // // // // const { body, validationResult } = require('express-validator');
// // // // // const User = require('../models/User');
// // // // // const auth = require('../middleware/auth');

// // // // // const router = express.Router();

// // // // // // @route   POST /api/auth/register
// // // // // // @desc    Register a new user
// // // // // // @access  Public
// // // // // router.post('/register', [
// // // // //   body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
// // // // //   body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
// // // // //   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
// // // // //   body('phone').matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
// // // // //   body('role').isIn(['buyer', 'seller']).withMessage('Role must be either buyer or seller')
// // // // // ], async (req, res) => {
// // // // //   try {
// // // // //     const errors = validationResult(req);
// // // // //     if (!errors.isEmpty()) {
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: 'Validation failed',
// // // // //         errors: errors.array()
// // // // //       });
// // // // //     }

// // // // //     const { name, email, password, phone, role, address } = req.body;

// // // // //     // Check if user already exists
// // // // //     const existingUser = await User.findOne({ email });
// // // // //     if (existingUser) {
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: 'User already exists with this email'
// // // // //       });
// // // // //     }

// // // // //     // Create new user
// // // // //     const user = new User({
// // // // //       name,
// // // // //       email,
// // // // //       password,
// // // // //       phone,
// // // // //       role,
// // // // //       address
// // // // //     });

// // // // //     await user.save();

// // // // //     // Generate JWT token
// // // // //     const token = jwt.sign(
// // // // //       { userId: user._id, role: user.role },
// // // // //       process.env.JWT_SECRET,
// // // // //       { expiresIn: process.env.JWT_EXPIRE }
// // // // //     );

// // // // //     res.status(201).json({
// // // // //       success: true,
// // // // //       message: 'User registered successfully. Waiting for admin approval.',
// // // // //       data: {
// // // // //         user: {
// // // // //           id: user._id,
// // // // //           name: user.name,
// // // // //           email: user.email,
// // // // //           role: user.role,
// // // // //           isApproved: user.isApproved
// // // // //         },
// // // // //         token
// // // // //       }
// // // // //     });

// // // // //   } catch (error) {
// // // // //     console.error('Registration error:', error);
// // // // //     res.status(500).json({
// // // // //       success: false,
// // // // //       message: 'Server error during registration',
// // // // //       error: process.env.NODE_ENV === 'development' ? error.message : {}
// // // // //     });
// // // // //   }
// // // // // });

// // // // // // @route   POST /api/auth/login
// // // // // // @desc    Login user
// // // // // // @access  Public
// // // // // router.post('/login', [
// // // // //   body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
// // // // //   body('password').notEmpty().withMessage('Password is required')
// // // // // ], async (req, res) => {
// // // // //   try {
// // // // //     const errors = validationResult(req);
// // // // //     if (!errors.isEmpty()) {
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: 'Validation failed',
// // // // //         errors: errors.array()
// // // // //       });
// // // // //     }

// // // // //     const { email, password } = req.body;

// // // // //     // Find user and include password for comparison
// // // // //     const user = await User.findOne({ email }).select('+password');
// // // // //     if (!user) {
// // // // //       return res.status(401).json({
// // // // //         success: false,
// // // // //         message: 'Invalid credentials'
// // // // //       });
// // // // //     }

// // // // //     // Check if user is active
// // // // //     if (!user.isActive) {
// // // // //       return res.status(401).json({
// // // // //         success: false,
// // // // //         message: 'Account is deactivated. Please contact admin.'
// // // // //       });
// // // // //     }

// // // // //     // Check password
// // // // //     const isPasswordValid = await user.matchPassword(password);
// // // // //     if (!isPasswordValid) {
// // // // //       return res.status(401).json({
// // // // //         success: false,
// // // // //         message: 'Invalid credentials'
// // // // //       });
// // // // //     }

// // // // //     // Update last login
// // // // //     user.lastLogin = new Date();
// // // // //     await user.save();

// // // // //     // Generate JWT token
// // // // //     const token = jwt.sign(
// // // // //       { userId: user._id, role: user.role },
// // // // //       process.env.JWT_SECRET,
// // // // //       { expiresIn: process.env.JWT_EXPIRE }
// // // // //     );

// // // // //     res.json({
// // // // //       success: true,
// // // // //       message: 'Login successful',
// // // // //       data: {
// // // // //         user: {
// // // // //           id: user._id,
// // // // //           name: user.name,
// // // // //           email: user.email,
// // // // //           role: user.role,
// // // // //           isApproved: user.isApproved,
// // // // //           premiumPlan: user.premiumPlan,
// // // // //           premiumExpiry: user.premiumExpiry
// // // // //         },
// // // // //         token
// // // // //       }
// // // // //     });

// // // // //   } catch (error) {
// // // // //     console.error('Login error:', error);
// // // // //     res.status(500).json({
// // // // //       success: false,
// // // // //       message: 'Server error during login',
// // // // //       error: process.env.NODE_ENV === 'development' ? error.message : {}
// // // // //     });
// // // // //   }
// // // // // });

// // // // // // @route   GET /api/auth/me
// // // // // // @desc    Get current user
// // // // // // @access  Private
// // // // // router.get('/me', auth, async (req, res) => {
// // // // //   try {
// // // // //     const user = await User.findById(req.user.userId).select('-password');
// // // // //     if (!user) {
// // // // //       return res.status(404).json({
// // // // //         success: false,
// // // // //         message: 'User not found'
// // // // //       });
// // // // //     }

// // // // //     res.json({
// // // // //       success: true,
// // // // //       data: { user }
// // // // //     });

// // // // //   } catch (error) {
// // // // //     console.error('Get user error:', error);
// // // // //     res.status(500).json({
// // // // //       success: false,
// // // // //       message: 'Server error',
// // // // //       error: process.env.NODE_ENV === 'development' ? error.message : {}
// // // // //     });
// // // // //   }
// // // // // });

// // // // // // @route   POST /api/auth/forgot-password
// // // // // // @desc    Send password reset email
// // // // // // @access  Public
// // // // // router.post('/forgot-password', [
// // // // //   body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
// // // // // ], async (req, res) => {
// // // // //   try {
// // // // //     const errors = validationResult(req);
// // // // //     if (!errors.isEmpty()) {
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: 'Validation failed',
// // // // //         errors: errors.array()
// // // // //       });
// // // // //     }

// // // // //     const { email } = req.body;

// // // // //     const user = await User.findOne({ email });
// // // // //     if (!user) {
// // // // //       return res.status(404).json({
// // // // //         success: false,
// // // // //         message: 'User not found with this email'
// // // // //       });
// // // // //     }

// // // // //     // Generate reset token
// // // // //     const resetToken = jwt.sign(
// // // // //       { userId: user._id },
// // // // //       process.env.JWT_SECRET,
// // // // //       { expiresIn: '1h' }
// // // // //     );

// // // // //     // Save reset token
// // // // //     user.resetPasswordToken = resetToken;
// // // // //     user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
// // // // //     await user.save();

// // // // //     // TODO: Send email with reset link
// // // // //     // For now, just return success
// // // // //     res.json({
// // // // //       success: true,
// // // // //       message: 'Password reset email sent successfully',
// // // // //       resetToken // Remove this in production
// // // // //     });

// // // // //   } catch (error) {
// // // // //     console.error('Forgot password error:', error);
// // // // //     res.status(500).json({
// // // // //       success: false,
// // // // //       message: 'Server error',
// // // // //       error: process.env.NODE_ENV === 'development' ? error.message : {}
// // // // //     });
// // // // //   }
// // // // // });

// // // // // // @route   POST /api/auth/reset-password
// // // // // // @desc    Reset password
// // // // // // @access  Public
// // // // // router.post('/reset-password', [
// // // // //   body('token').notEmpty().withMessage('Reset token is required'),
// // // // //   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
// // // // // ], async (req, res) => {
// // // // //   try {
// // // // //     const errors = validationResult(req);
// // // // //     if (!errors.isEmpty()) {
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: 'Validation failed',
// // // // //         errors: errors.array()
// // // // //       });
// // // // //     }

// // // // //     const { token, password } = req.body;

// // // // //     // Verify token
// // // // //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// // // // //     const user = await User.findOne({
// // // // //       _id: decoded.userId,
// // // // //       resetPasswordToken: token,
// // // // //       resetPasswordExpire: { $gt: new Date() }
// // // // //     });

// // // // //     if (!user) {
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: 'Invalid or expired reset token'
// // // // //       });
// // // // //     }

// // // // //     // Update password
// // // // //     user.password = password;
// // // // //     user.resetPasswordToken = undefined;
// // // // //     user.resetPasswordExpire = undefined;
// // // // //     await user.save();

// // // // //     res.json({
// // // // //       success: true,
// // // // //       message: 'Password reset successfully'
// // // // //     });

// // // // //   } catch (error) {
// // // // //     console.error('Reset password error:', error);
// // // // //     res.status(500).json({
// // // // //       success: false,
// // // // //       message: 'Server error',
// // // // //       error: process.env.NODE_ENV === 'development' ? error.message : {}
// // // // //     });
// // // // //   }
// // // // // });

// // // // // // @route   POST /api/auth/change-password
// // // // // // @desc    Change password
// // // // // // @access  Private
// // // // // router.post('/change-password', [
// // // // //   auth,
// // // // //   body('currentPassword').notEmpty().withMessage('Current password is required'),
// // // // //   body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
// // // // // ], async (req, res) => {
// // // // //   try {
// // // // //     const errors = validationResult(req);
// // // // //     if (!errors.isEmpty()) {
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: 'Validation failed',
// // // // //         errors: errors.array()
// // // // //       });
// // // // //     }

// // // // //     const { currentPassword, newPassword } = req.body;

// // // // //     const user = await User.findById(req.user.userId).select('+password');
// // // // //     if (!user) {
// // // // //       return res.status(404).json({
// // // // //         success: false,
// // // // //         message: 'User not found'
// // // // //       });
// // // // //     }

// // // // //     // Check current password
// // // // //     const isCurrentPasswordValid = await user.matchPassword(currentPassword);
// // // // //     if (!isCurrentPasswordValid) {
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: 'Current password is incorrect'
// // // // //       });
// // // // //     }

// // // // //     // Update password
// // // // //     user.password = newPassword;
// // // // //     await user.save();

// // // // //     res.json({
// // // // //       success: true,
// // // // //       message: 'Password changed successfully'
// // // // //     });

// // // // //   } catch (error) {
// // // // //     console.error('Change password error:', error);
// // // // //     res.status(500).json({
// // // // //       success: false,
// // // // //       message: 'Server error',
// // // // //       error: process.env.NODE_ENV === 'development' ? error.message : {}
// // // // //     });
// // // // //   }
// // // // // });

// // // // // module.exports = router;
















// // // // const express = require('express');
// // // // const bcrypt = require('bcryptjs');
// // // // const jwt = require('jsonwebtoken');
// // // // const { body, validationResult } = require('express-validator');
// // // // const nodemailer = require('nodemailer');
// // // // const User = require('../models/User');
// // // // const { auth } = require('../middleware/auth');

// // // // const router = express.Router();

// // // // // @route   POST /api/auth/register
// // // // // @desc    Register a new user
// // // // // @access  Public
// // // // router.post('/register', [
// // // //   body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
// // // //   body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
// // // //   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
// // // //   body('phone').matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
// // // //   body('role').isIn(['buyer', 'seller']).withMessage('Role must be either buyer or seller')
// // // // ], async (req, res) => {
// // // //   try {
// // // //     const errors = validationResult(req);
// // // //     if (!errors.isEmpty()) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: 'Validation failed',
// // // //         errors: errors.array()
// // // //       });
// // // //     }

// // // //     const { name, email, password, phone, role, address } = req.body;

// // // //     const existingUser = await User.findOne({ email });
// // // //     if (existingUser) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: 'User already exists with this email'
// // // //       });
// // // //     }

// // // //     const user = new User({
// // // //       name,
// // // //       email,
// // // //       password,
// // // //       phone,
// // // //       role,
// // // //       address,
// // // //       isApproved: role === 'buyer' // Buyers are auto-approved
// // // //     });

// // // //     await user.save();

// // // //     const token = jwt.sign(
// // // //       { userId: user._id, role: user.role },
// // // //       process.env.JWT_SECRET,
// // // //       { expiresIn: process.env.JWT_EXPIRE }
// // // //     );

// // // //     res.status(201).json({
// // // //       success: true,
// // // //       message: 'User registered successfully. Waiting for admin approval.',
// // // //       data: {
// // // //         user: {
// // // //           id: user._id,
// // // //           name: user.name,
// // // //           email: user.email,
// // // //           role: user.role,
// // // //           isApproved: user.isApproved
// // // //         },
// // // //         token
// // // //       }
// // // //     });

// // // //   } catch (error) {
// // // //     console.error('Registration error:', error);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Server error during registration',
// // // //       error: process.env.NODE_ENV === 'development' ? error.message : {}
// // // //     });
// // // //   }
// // // // });

// // // // // @route   POST /api/auth/login
// // // // // @desc    Login user
// // // // // @access  Public
// // // // router.post('/login', [
// // // //   body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
// // // //   body('password').notEmpty().withMessage('Password is required')
// // // // ], async (req, res) => {
// // // //   try {
// // // //     const errors = validationResult(req);
// // // //     if (!errors.isEmpty()) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: 'Validation failed',
// // // //         errors: errors.array()
// // // //       });
// // // //     }

// // // //     const { email, password } = req.body;

// // // //     const user = await User.findOne({ email }).select('+password');
// // // //     if (!user) {
// // // //       return res.status(401).json({
// // // //         success: false,
// // // //         message: 'Invalid credentials'
// // // //       });
// // // //     }
    
// // // //     if (!user.isActive) {
// // // //       return res.status(401).json({
// // // //         success: false,
// // // //         message: 'Account is deactivated. Please contact admin.'
// // // //       });
// // // //     }
    
// // // //     const isPasswordValid = await user.matchPassword(password);
// // // //     if (!isPasswordValid) {
// // // //       return res.status(401).json({
// // // //         success: false,
// // // //         message: 'Invalid credentials'
// // // //       });
// // // //     }

// // // //     user.lastLogin = new Date();
// // // //     await user.save();

// // // //     const token = jwt.sign(
// // // //       { userId: user._id, role: user.role },
// // // //       process.env.JWT_SECRET,
// // // //       { expiresIn: process.env.JWT_EXPIRE }
// // // //     );
    
// // // //     const userResponse = user.toObject();
// // // //     delete userResponse.password;

// // // //     res.json({
// // // //       success: true,
// // // //       message: 'Login successful',
// // // //       data: {
// // // //         user: userResponse,
// // // //         token
// // // //       }
// // // //     });

// // // //   } catch (error) {
// // // //     console.error('Login error:', error);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Server error during login',
// // // //       error: process.env.NODE_ENV === 'development' ? error.message : {}
// // // //     });
// // // //   }
// // // // });

// // // // // @route   GET /api/auth/me
// // // // // @desc    Get current user
// // // // // @access  Private
// // // // router.get('/me', auth, async (req, res) => {
// // // //   try {
// // // //     const user = await User.findById(req.user.userId).select('-password');
// // // //     if (!user) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         message: 'User not found'
// // // //       });
// // // //     }

// // // //     res.json({
// // // //       success: true,
// // // //       data: { user }
// // // //     });

// // // //   } catch (error) {
// // // //     console.error('Get user error:', error);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Server error',
// // // //       error: process.env.NODE_ENV === 'development' ? error.message : {}
// // // //     });
// // // //   }
// // // // });

// // // // // @route   POST /api/auth/forgot-password
// // // // // @desc    Send password reset email
// // // // // @access  Public
// // // // router.post('/forgot-password', [
// // // //   body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
// // // // ], async (req, res) => {
// // // //   try {
// // // //     const errors = validationResult(req);
// // // //     if (!errors.isEmpty()) {
// // // //       return res.status(400).json({ errors: errors.array() });
// // // //     }

// // // //     const { email } = req.body;
// // // //     const user = await User.findOne({ email });

// // // //     if (!user) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         message: 'User not found with this email'
// // // //       });
// // // //     }

// // // //     const resetToken = user.getResetPasswordToken();
// // // //     await user.save({ validateBeforeSave: false });

// // // //     // Create reset URL
// // // //     const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

// // // //     const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

// // // //     try {
// // // //       const transporter = nodemailer.createTransport({
// // // //         host: process.env.EMAIL_HOST,
// // // //         port: process.env.EMAIL_PORT,
// // // //         secure: false, // true for 465, false for other ports
// // // //         auth: {
// // // //           user: process.env.EMAIL_USER,
// // // //           pass: process.env.EMAIL_PASS,
// // // //         },
// // // //       });

// // // //       await transporter.sendMail({
// // // //         from: `"RealEstate Platform" <${process.env.EMAIL_USER}>`,
// // // //         to: user.email,
// // // //         subject: 'Password Reset Token',
// // // //         text: message,
// // // //       });

// // // //       res.status(200).json({ success: true, message: 'Email sent' });
// // // //     } catch (err) {
// // // //       console.error(err);
// // // //       user.resetPasswordToken = undefined;
// // // //       user.resetPasswordExpire = undefined;
// // // //       await user.save({ validateBeforeSave: false });
// // // //       return res.status(500).json({ success: false, message: 'Email could not be sent' });
// // // //     }

// // // //   } catch (error) {
// // // //     console.error('Forgot password error:', error);
// // // //     res.status(500).json({ success: false, message: 'Server error' });
// // // //   }
// // // // });


// // // // // @route   PUT /api/auth/reset-password/:token
// // // // // @desc    Reset password using token
// // // // // @access  Public
// // // // router.put('/reset-password/:token', [
// // // //   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
// // // // ], async (req, res) => {
// // // //     try {
// // // //         const errors = validationResult(req);
// // // //         if (!errors.isEmpty()) {
// // // //             return res.status(400).json({ errors: errors.array() });
// // // //         }

// // // //         // Get hashed token from URL
// // // //         const resetPasswordToken = crypto
// // // //             .createHash('sha256')
// // // //             .update(req.params.token)
// // // //             .digest('hex');

// // // //         const user = await User.findOne({
// // // //             resetPasswordToken,
// // // //             resetPasswordExpire: { $gt: Date.now() },
// // // //         });

// // // //         if (!user) {
// // // //             return res.status(400).json({ success: false, message: 'Invalid or expired token' });
// // // //         }

// // // //         // Set new password
// // // //         user.password = req.body.password;
// // // //         user.resetPasswordToken = undefined;
// // // //         user.resetPasswordExpire = undefined;
// // // //         await user.save();

// // // //         res.json({ success: true, message: 'Password reset successfully' });

// // // //     } catch (error) {
// // // //         console.error('Reset password error:', error);
// // // //         res.status(500).json({ success: false, message: 'Server error' });
// // // //     }
// // // // });


// // // // // @route   PUT /api/auth/change-password
// // // // // @desc    Change password for a logged-in user
// // // // // @access  Private
// // // // router.put('/change-password', auth, [
// // // //   body('currentPassword').notEmpty().withMessage('Current password is required'),
// // // //   body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
// // // // ], async (req, res) => {
// // // //   try {
// // // //     const errors = validationResult(req);
// // // //     if (!errors.isEmpty()) {
// // // //       return res.status(400).json({ errors: errors.array() });
// // // //     }

// // // //     const { currentPassword, newPassword } = req.body;
// // // //     const user = await User.findById(req.user.userId).select('+password');

// // // //     if (!user) {
// // // //       return res.status(404).json({ success: false, message: 'User not found' });
// // // //     }

// // // //     const isMatch = await user.matchPassword(currentPassword);
// // // //     if (!isMatch) {
// // // //       return res.status(400).json({ success: false, message: 'Current password is incorrect' });
// // // //     }

// // // //     user.password = newPassword;
// // // //     await user.save();

// // // //     res.json({ success: true, message: 'Password changed successfully' });
// // // //   } catch (error) {
// // // //     console.error('Change password error:', error);
// // // //     res.status(500).json({ success: false, message: 'Server error' });
// // // //   }
// // // // });

// // // // // @route   POST /api/auth/create-admin
// // // // // @desc    Create admin user (development only)
// // // // // @access  Public (for development)
// // // // router.post('/create-admin', [
// // // //   body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
// // // //   body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
// // // //   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
// // // // ], async (req, res) => {
// // // //   try {
// // // //     const errors = validationResult(req);
// // // //     if (!errors.isEmpty()) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: 'Validation failed',
// // // //         errors: errors.array()
// // // //       });
// // // //     }

// // // //     const { name, email, password } = req.body;

// // // //     // Check if admin already exists
// // // //     const existingAdmin = await User.findOne({ role: 'admin' });
// // // //     if (existingAdmin) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: 'Admin user already exists'
// // // //       });
// // // //     }

// // // //     // Check if email already exists
// // // //     const existingUser = await User.findOne({ email });
// // // //     if (existingUser) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: 'User already exists with this email'
// // // //       });
// // // //     }

// // // //     // Create admin user
// // // //     const adminUser = new User({
// // // //       name,
// // // //       email,
// // // //       password,
// // // //       role: 'admin',
// // // //       isApproved: true,
// // // //       isActive: true
// // // //     });

// // // //     await adminUser.save();

// // // //     res.status(201).json({
// // // //       success: true,
// // // //       message: 'Admin user created successfully',
// // // //       data: {
// // // //         id: adminUser._id,
// // // //         name: adminUser.name,
// // // //         email: adminUser.email,
// // // //         role: adminUser.role
// // // //       }
// // // //     });

// // // //   } catch (error) {
// // // //     console.error('Create admin error:', error);
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       message: 'Server error during admin creation',
// // // //       error: process.env.NODE_ENV === 'development' ? error.message : {}
// // // //     });
// // // //   }
// // // // });

// // // // module.exports = router;

























// // // const express = require('express');
// // // const jwt = require('jsonwebtoken');
// // // const { body, validationResult } = require('express-validator');
// // // const User = require('../models/User'); // Assuming path to User model
// // // const { auth } = require('../middleware/auth'); // Assuming path to auth middleware

// // // const router = express.Router();

// // // // @route   POST /api/auth/register
// // // // @desc    Register a new user. The first user to register becomes the admin.
// // // // @access  Public
// // // router.post('/register', [
// // //     body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
// // //     body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
// // //     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
// // //     body('phone').matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
// // //     body('role').isIn(['buyer', 'seller']).withMessage('Role must be either buyer or seller')
// // // ], async (req, res) => {
// // //     try {
// // //         const errors = validationResult(req);
// // //         if (!errors.isEmpty()) {
// // //             return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
// // //         }

// // //         const { name, email, password, phone, role, address } = req.body;

// // //         // Check if user already exists
// // //         const existingUser = await User.findOne({ email });
// // //         if (existingUser) {
// // //             return res.status(400).json({ success: false, message: 'User already exists with this email' });
// // //         }

// // //         // SIMPLIFIED LOGIC: Check if this is the first user ever.
// // //         const isFirstUser = (await User.countDocuments()) === 0;
        
// // //         const newUser = new User({
// // //             name,
// // //             email,
// // //             password,
// // //             phone,
// // //             role: isFirstUser ? 'admin' : role, // If first user, make them admin.
// // //             address,
// // //             isApproved: isFirstUser, // First user (admin) is auto-approved.
// // //             isActive: isFirstUser   // Admin is active by default.
// // //         });

// // //         await newUser.save();

// // //         const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// // //         const userResponse = newUser.toObject();
// // //         delete userResponse.password;
        
// // //         // Customize welcome message
// // //         const message = isFirstUser 
// // //             ? 'Admin account created successfully! You can now log in.'
// // //             : 'Registration successful! Please wait for admin approval.';

// // //         res.status(201).json({
// // //             success: true,
// // //             message,
// // //             data: { user: userResponse, token }
// // //         });

// // //     } catch (error) {
// // //         console.error('Registration error:', error);
// // //         res.status(500).json({ success: false, message: 'Server error during registration' });
// // //     }
// // // });

// // // /*
// // // *
// // // * THE REST OF THE FILE (login, me, forgot-password, etc.) REMAINS THE SAME.
// // // * THE /api/auth/create-admin ROUTE SHOULD BE DELETED.
// // // *
// // // */

// // // // @route   POST /api/auth/login
// // // // @desc    Login user
// // // // @access  Public
// // // router.post('/login', [
// // //   body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
// // //   body('password').notEmpty().withMessage('Password is required')
// // // ], async (req, res) => {
// // //   try {
// // //     const errors = validationResult(req);
// // //     if (!errors.isEmpty()) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'Validation failed',
// // //         errors: errors.array()
// // //       });
// // //     }

// // //     const { email, password } = req.body;

// // //     const user = await User.findOne({ email }).select('+password');
// // //     if (!user) {
// // //       return res.status(401).json({
// // //         success: false,
// // //         message: 'Invalid credentials'
// // //       });
// // //     }
    
// // //     if (!user.isActive) {
// // //       return res.status(401).json({
// // //         success: false,
// // //         message: 'Account is deactivated. Please contact admin.'
// // //       });
// // //     }
    
// // //     // This is a placeholder for a method that should exist on your User model
// // //     // to compare the provided password with the hashed password in the database.
// // //     const isPasswordValid = await user.matchPassword(password);
// // //     if (!isPasswordValid) {
// // //       return res.status(401).json({
// // //         success: false,
// // //         message: 'Invalid credentials'
// // //       });
// // //     }

// // //     user.lastLogin = new Date();
// // //     await user.save();

// // //     const token = jwt.sign(
// // //       { userId: user._id, role: user.role },
// // //       process.env.JWT_SECRET,
// // //       { expiresIn: process.env.JWT_EXPIRE }
// // //     );
    
// // //     const userResponse = user.toObject();
// // //     delete userResponse.password;

// // //     res.json({
// // //       success: true,
// // //       message: 'Login successful',
// // //       data: {
// // //         user: userResponse,
// // //         token
// // //       }
// // //     });

// // //   } catch (error) {
// // //     console.error('Login error:', error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Server error during login',
// // //       error: process.env.NODE_ENV === 'development' ? error.message : {}
// // //     });
// // //   }
// // // });


// // // // @route   GET /api/auth/me
// // // // @desc    Get current user
// // // // @access  Private
// // // router.get('/me', auth, async (req, res) => {
// // //   try {
// // //     const user = await User.findById(req.user.userId).select('-password');
// // //     if (!user) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: 'User not found'
// // //       });
// // //     }

// // //     res.json({
// // //       success: true,
// // //       data: { user }
// // //     });

// // //   } catch (error) {
// // //     console.error('Get user error:', error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Server error',
// // //       error: process.env.NODE_ENV === 'development' ? error.message : {}
// // //     });
// // //   }
// // // });

// // // module.exports = router;









// // const express = require('express');
// // const jwt = require('jsonwebtoken');
// // const { body, validationResult } = require('express-validator');
// // const User = require('../models/User');
// // const { auth } = require('../middleware/auth');

// // const router = express.Router();

// // // @route   POST /api/auth/register
// // // @desc    Register a new user. The first user becomes the admin.
// // // @access  Public
// // router.post('/register', [
// //     body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
// //     body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
// //     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
// //     // CORRECTED VALIDATION: Matches the frontend rule for Indian phone numbers.
// //     body('phone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit Indian mobile number'),
// //     body('role').isIn(['buyer', 'seller']).withMessage('Role must be either buyer or seller')
// // ], async (req, res) => {
// //     try {
// //         const errors = validationResult(req);
// //         if (!errors.isEmpty()) {
// //             return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
// //         }

// //         const { name, email, password, phone, role } = req.body;

// //         const existingUser = await User.findOne({ email });
// //         if (existingUser) {
// //             return res.status(400).json({ success: false, message: 'User already exists with this email' });
// //         }

// //         const isFirstUser = (await User.countDocuments()) === 0;
        
// //         const newUser = new User({
// //             name,
// //             email,
// //             password,
// //             phone,
// //             role: isFirstUser ? 'admin' : role,
// //             isApproved: isFirstUser || role === 'buyer', // Admin and buyers are auto-approved
// //             isActive: true
// //         });

// //         await newUser.save();

// //         const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// //         const userResponse = newUser.toObject();
// //         delete userResponse.password;

// //         res.status(201).json({
// //             success: true,
// //             message: isFirstUser ? 'Admin account created successfully!' : 'Registration successful!',
// //             data: { user: userResponse, token }
// //         });

// //     } catch (error) {
// //         console.error('Registration error:', error);
// //         res.status(500).json({ success: false, message: 'Server error during registration' });
// //     }
// // });

// // // @route   POST /api/auth/login
// // // @desc    Login user
// // // @access  Public
// // router.post('/login', [
// //   body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
// //   body('password').notEmpty().withMessage('Password is required')
// // ], async (req, res) => {
// //   try {
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Validation failed',
// //         errors: errors.array()
// //       });
// //     }

// //     const { email, password } = req.body;

// //     const user = await User.findOne({ email }).select('+password');
// //     if (!user) {
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Invalid credentials'
// //       });
// //     }
    
// //     if (!user.isActive) {
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Account is deactivated. Please contact admin.'
// //       });
// //     }
    
// //     const isPasswordValid = await user.matchPassword(password);
// //     if (!isPasswordValid) {
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Invalid credentials'
// //       });
// //     }

// //     user.lastLogin = new Date();
// //     await user.save();

// //     const token = jwt.sign(
// //       { userId: user._id, role: user.role },
// //       process.env.JWT_SECRET,
// //       { expiresIn: process.env.JWT_EXPIRE }
// //     );
    
// //     const userResponse = user.toObject();
// //     delete userResponse.password;

// //     res.json({
// //       success: true,
// //       message: 'Login successful',
// //       data: {
// //         user: userResponse,
// //         token
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Login error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Server error during login'
// //     });
// //   }
// // });

// // // @route   GET /api/auth/me
// // // @desc    Get current user
// // // @access  Private
// // router.get('/me', auth, async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user.userId).select('-password');
// //     if (!user) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'User not found'
// //       });
// //     }
// //     res.json({
// //       success: true,
// //       data: { user }
// //     });
// //   } catch (error) {
// //     console.error('Get user error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Server error'
// //     });
// //   }
// // });

// // module.exports = router;









// const express = require('express');
// const jwt = require('jsonwebtoken');
// const { body, validationResult } = require('express-validator');
// const User = require('../models/User');
// const { auth } = require('../middleware/auth');

// const router = express.Router();

// // @route   POST /api/auth/register
// // @desc    Register a new user. The first user becomes the admin.
// // @access  Public
// router.post('/register', [
//     body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
//     body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
//     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//     body('phone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit Indian mobile number'),
//     body('role').isIn(['buyer', 'seller']).withMessage('Role must be either buyer or seller')
// ], async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
//         }

//         const { name, email, password, phone, role } = req.body;

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ success: false, message: 'User already exists with this email' });
//         }

//         const isFirstUser = (await User.countDocuments()) === 0;
        
//         const newUser = new User({
//             name,
//             email,
//             password,
//             phone,
//             role: isFirstUser ? 'admin' : role,
//             isApproved: isFirstUser || role === 'buyer', // Admin and buyers are auto-approved
//             isActive: true
//         });

//         await newUser.save();

//         const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

//         const userResponse = newUser.toObject();
//         delete userResponse.password;

//         res.status(201).json({
//             success: true,
//             message: isFirstUser ? 'Admin account created successfully!' : 'Registration successful!',
//             data: { user: userResponse, token }
//         });

//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(500).json({ success: false, message: 'Server error during registration' });
//     }
// });

// // @route   POST /api/auth/login
// // @desc    Login user
// // @access  Public
// router.post('/login', [
//   body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
//   body('password').notEmpty().withMessage('Password is required')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     const { email, password } = req.body;

//     const user = await User.findOne({ email }).select('+password');
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }
    
//     if (!user.isActive) {
//       return res.status(401).json({
//         success: false,
//         message: 'Account is deactivated. Please contact admin.'
//       });
//     }
    
//     const isPasswordValid = await user.matchPassword(password);
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     user.lastLogin = new Date();
//     await user.save();

//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRE }
//     );
    
//     const userResponse = user.toObject();
//     delete userResponse.password;

//     res.json({
//       success: true,
//       message: 'Login successful',
//       data: {
//         user: userResponse,
//         token
//       }
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during login'
//     });
//   }
// });

// // @route   GET /api/auth/me
// // @desc    Get current user
// // @access  Private
// router.get('/me', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('-password');
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
//     res.json({
//       success: true,
//       data: { user }
//     });
//   } catch (error) {
//     console.error('Get user error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// module.exports = router;










const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user. The first user becomes the admin.
// @access  Public
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit Indian mobile number'),
    body('role').isIn(['buyer', 'seller']).withMessage('Role must be either buyer or seller'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
      }

      const { name, email, password, phone, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const isFirstUser = (await User.countDocuments()) === 0;
      
      const newUser = new User({
        name,
        email,
        password,
        phone,
        role: isFirstUser ? 'admin' : role,
        isApproved: isFirstUser || role === 'buyer', // Admin and buyers are auto-approved
        isActive: true,
      });

      await newUser.save();

      const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

      const userResponse = newUser.toObject();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        message: isFirstUser ? 'Admin account created successfully!' : 'Registration successful!',
        data: { user: userResponse, token },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, message: 'Server error during registration' });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      
      if (!user.isActive) {
        return res.status(401).json({ success: false, message: 'Account is deactivated. Please contact admin.' });
      }
      
      const isPasswordValid = await user.matchPassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false }); // Skip validation on login

      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
      
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({
        success: true,
        message: 'Login successful',
        data: { user: userResponse, token },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Server error during login' });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user details
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: { user } });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
