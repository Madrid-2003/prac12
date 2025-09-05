// const mongoose = require('mongoose');

// const propertySchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Please provide a property title'],
//     trim: true,
//     maxlength: [100, 'Title cannot be more than 100 characters']
//   },
//   description: {
//     type: String,
//     required: [true, 'Please provide a property description'],
//     maxlength: [2000, 'Description cannot be more than 2000 characters']
//   },
//   type: {
//     type: String,
//     required: [true, 'Please specify property type'],
//     enum: ['apartment', 'house', 'villa', 'commercial', 'land', 'other']
//   },
//   purpose: {
//     type: String,
//     required: [true, 'Please specify purpose'],
//     enum: ['sale', 'rent']
//   },
//   price: {
//     type: Number,
//     required: [true, 'Please provide property price'],
//     min: [0, 'Price cannot be negative']
//   },
//   area: {
//     type: Number,
//     required: [true, 'Please provide property area'],
//     min: [0, 'Area cannot be negative']
//   },
//   bedrooms: {
//     type: Number,
//     required: [true, 'Please specify number of bedrooms'],
//     min: [0, 'Bedrooms cannot be negative']
//   },
//   bathrooms: {
//     type: Number,
//     required: [true, 'Please specify number of bathrooms'],
//     min: [0, 'Bathrooms cannot be negative']
//   },
//   parking: {
//     type: Number,
//     default: 0,
//     min: [0, 'Parking cannot be negative']
//   },
//   floor: {
//     type: Number,
//     default: 0
//   },
//   totalFloors: {
//     type: Number,
//     default: 0
//   },
//   age: {
//     type: Number,
//     default: 0,
//     min: [0, 'Age cannot be negative']
//   },
//   furnishing: {
//     type: String,
//     enum: ['furnished', 'semi-furnished', 'unfurnished'],
//     default: 'unfurnished'
//   },
//   images: [{
//     url: {
//       type: String,
//       required: true
//     },
//     public_id: String,
//     uploadedAt: {
//       type: Date,
//       default: Date.now
//     }
//   }],
//   location: {
//     address: {
//       type: String,
//       required: [true, 'Please provide property address']
//     },
//     city: {
//       type: String,
//       required: [true, 'Please provide city']
//     },
//     state: {
//       type: String,
//       required: [true, 'Please provide state']
//     },
//     zipCode: {
//       type: String,
//       required: [true, 'Please provide zip code']
//     },
//     country: {
//       type: String,
//       default: 'India'
//     },
//     coordinates: {
//       latitude: {
//         type: Number,
//         required: [true, 'Please provide latitude']
//       },
//       longitude: {
//         type: Number,
//         required: [true, 'Please provide longitude']
//       }
//     }
//   },
//   amenities: [{
//     type: String,
//     enum: [
//       'gym', 'swimming_pool', 'parking', 'security', 'elevator',
//       'garden', 'balcony', 'terrace', 'power_backup', 'water_supply',
//       'internet', 'cable_tv', 'air_conditioning', 'heating', 'fireplace'
//     ]
//   }],
//   seller: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   contactInfo: {
//     name: {
//       type: String,
//       required: [true, 'Please provide contact name']
//     },
//     phone: {
//       type: String,
//       required: [true, 'Please provide contact phone']
//     },
//     email: {
//       type: String,
//       required: [true, 'Please provide contact email']
//     },
//     whatsapp: String
//   },
//   isApproved: {
//     type: Boolean,
//     default: false
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   isFeatured: {
//     type: Boolean,
//     default: false
//   },
//   views: {
//     type: Number,
//     default: 0
//   },
//   likes: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }],
//   inquiries: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     message: String,
//     contactInfo: {
//       name: String,
//       phone: String,
//       email: String
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now
//     }
//   }],
//   status: {
//     type: String,
//     enum: ['available', 'sold', 'rented', 'under_negotiation'],
//     default: 'available'
//   }
// }, {
//   timestamps: true
// });

// // Index for better search performance
// propertySchema.index({ location: '2dsphere' });
// propertySchema.index({ price: 1 });
// propertySchema.index({ type: 1 });
// propertySchema.index({ purpose: 1 });
// propertySchema.index({ 'location.city': 1 });

// // Virtual for property age in years
// propertySchema.virtual('ageInYears').get(function() {
//   return Math.floor(this.age / 12);
// });

// // Method to increment views
// propertySchema.methods.incrementViews = function() {
//   this.views += 1;
//   return this.save();
// };

// // Method to add like
// propertySchema.methods.addLike = function(userId) {
//   if (!this.likes.includes(userId)) {
//     this.likes.push(userId);
//     return this.save();
//   }
//   return Promise.resolve(this);
// };

// // Method to remove like
// propertySchema.methods.removeLike = function(userId) {
//   this.likes = this.likes.filter(like => like.toString() !== userId.toString());
//   return this.save();
// };

// module.exports = mongoose.model('Property', propertySchema);










const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Property = require('../models/Property');
const User = require('../models/User');
const { auth, requireSeller } = require('../middleware/auth');

const router = express.Router();

// Configure multer for in-memory file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'), false);
    }
  }
});

// @route   POST /api/properties
// @desc    Create new property
// @access  Private (Seller only)
router.post('/', auth, requireSeller, upload.array('images', 5), [
    body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
    body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
    // ... other validations from your original file
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = await User.findById(req.user.userId);
        if (!user.subscription || !user.subscription.isActive) {
           return res.status(403).json({ 
             message: 'A seller subscription is required to list properties.' 
           });
        }

        // --- IMAGE HANDLING FIX ---
        // Process uploaded files and convert them to base64 strings
        const images = req.files ? req.files.map((file, index) => ({
            url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
            isPrimary: index === 0, // Mark the first image as primary
        })) : [];

        if (images.length < 1) {
            return res.status(400).json({ message: 'At least 1 image is required.' });
        }
        // --- END OF FIX ---

        const propertyData = { ...req.body, images, seller: req.user.userId };
        
        // Parse location from stringified JSON
        if (req.body.location) {
            propertyData.location = JSON.parse(req.body.location);
        }

        const property = new Property(propertyData);
        await property.save();

        res.status(201).json({
            message: 'Property created successfully. Waiting for admin approval.',
            property
        });
    } catch (error) {
        console.error('Create property error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @route   GET /api/properties
// @desc    Get all approved properties with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const {
      type,
      purpose,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      city,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = { isApproved: true }; 
    
    if (type) filter.type = type;
    if (purpose) filter.purpose = purpose;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    if (bedrooms) filter.bedrooms = { $gte: parseInt(bedrooms) };
    if (bathrooms) filter.bathrooms = { $gte: parseInt(bathrooms) };
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const properties = await Property.find(filter)
      .populate('seller', 'name email')
      .sort(sortOptions)
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-inquiries');

    const total = await Property.countDocuments(filter);

    res.json({
      properties,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Keep all other routes (GET by ID, like, etc.) as they are. They are correct.
// ... (rest of your routes)

module.exports = router;
