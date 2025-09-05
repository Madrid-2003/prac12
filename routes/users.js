const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Property = require('../models/Property');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('preferences.propertyTypes').optional().isArray(),
  body('preferences.budget.min').optional().isNumeric(),
  body('preferences.budget.max').optional().isNumeric(),
  body('preferences.locations').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const allowedUpdates = ['name', 'phone', 'preferences', 'profileImage'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/upload-documents
// @desc    Upload user documents
// @access  Private
router.post('/upload-documents', auth, async (req, res) => {
  try {
    const { documents } = req.body;

    if (!documents || !Array.isArray(documents)) {
      return res.status(400).json({ message: 'Documents array is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add new documents to existing ones
    user.documents = [...user.documents, ...documents];
    await user.save();

    res.json({
      message: 'Documents uploaded successfully',
      documents: user.documents
    });
  } catch (error) {
    console.error('Upload documents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let dashboardData = {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        subscription: user.subscription,
        profileImage: user.profileImage
      }
    };

    if (user.role === 'buyer') {
      const [likedProperties, recentInquiries] = await Promise.all([
        Property.find({ likes: req.userId }).countDocuments(),
        Property.find({ 'inquiries.user': req.userId })
          .select('title price location')
          .sort({ 'inquiries.date': -1 })
          .limit(5)
      ]);

      dashboardData.buyerStats = {
        likedProperties,
        recentInquiries
      };
    } else if (user.role === 'seller') {
      const [totalProperties, pendingProperties, totalViews, totalInquiries] = await Promise.all([
        Property.find({ seller: req.userId }).countDocuments(),
        Property.find({ seller: req.userId, status: 'pending' }).countDocuments(),
        Property.aggregate([
          { $match: { seller: req.userId } },
          { $group: { _id: null, total: { $sum: '$views' } } }
        ]),
        Property.aggregate([
          { $match: { seller: req.userId } },
          { $group: { _id: null, total: { $sum: { $size: '$inquiries' } } } }
        ])
      ]);

      dashboardData.sellerStats = {
        totalProperties,
        pendingProperties,
        totalViews: totalViews[0]?.total || 0,
        totalInquiries: totalInquiries[0]?.total || 0
      };
    }

    res.json(dashboardData);
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/favorites
// @desc    Get user's favorite properties
// @access  Private
router.get('/favorites', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const properties = await Property.find({ likes: req.userId })
      .populate('seller', 'name email phone profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-inquiries');

    const total = await Property.countDocuments({ likes: req.userId });

    res.json({
      properties,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/inquiries
// @desc    Get user's property inquiries
// @access  Private
router.get('/inquiries', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const properties = await Property.find({ 'inquiries.user': req.userId })
      .populate('seller', 'name email phone')
      .sort({ 'inquiries.date': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Extract inquiries for the current user
    const userInquiries = [];
    properties.forEach(property => {
      const userInquiry = property.inquiries.find(
        inquiry => inquiry.user.toString() === req.userId.toString()
      );
      if (userInquiry) {
        userInquiries.push({
          property: {
            id: property._id,
            title: property.title,
            price: property.price,
            location: property.location,
            images: property.images
          },
          inquiry: userInquiry,
          seller: property.seller
        });
      }
    });

    const total = await Property.countDocuments({ 'inquiries.user': req.userId });

    res.json({
      inquiries: userInquiries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has active properties (for sellers)
    if (user.role === 'seller') {
      const activeProperties = await Property.countDocuments({
        seller: req.userId,
        status: { $in: ['approved', 'pending'] }
      });

      if (activeProperties > 0) {
        return res.status(400).json({
          message: 'Cannot delete account with active properties. Please remove all properties first.'
        });
      }
    }

    // Delete user
    await User.findByIdAndDelete(req.userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', auth, [
  body('currentPassword').exists().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
