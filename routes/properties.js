// const express = require('express');
// const multer = require('multer');
// const { body, validationResult } = require('express-validator');
// const Property = require('../models/Property');
// const User = require('../models/User');
// const { auth, sellerAuth } = require('../middleware/auth');

// const router = express.Router();

// // Configure multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed'), false);
//     }
//   }
// });

// // @route   GET /api/properties
// // @desc    Get all approved properties with filters
// // @access  Public
// router.get('/', async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 12;
//     const {
//       type,
//       purpose,
//       minPrice,
//       maxPrice,
//       minArea,
//       maxArea,
//       bedrooms,
//       bathrooms,
//       city,
//       search,
//       sortBy = 'createdAt',
//       sortOrder = 'desc'
//     } = req.query;

//     const filter = { status: 'approved' };
    
//     if (type) filter.type = type;
//     if (purpose) filter.purpose = purpose;
//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) filter.price.$gte = parseInt(minPrice);
//       if (maxPrice) filter.price.$lte = parseInt(maxPrice);
//     }
//     if (minArea || maxArea) {
//       filter.area = {};
//       if (minArea) filter.area.$gte = parseInt(minArea);
//       if (maxArea) filter.area.$lte = parseInt(maxArea);
//     }
//     if (bedrooms) filter.bedrooms = parseInt(bedrooms);
//     if (bathrooms) filter.bathrooms = parseInt(bathrooms);
//     if (city) filter['location.city'] = new RegExp(city, 'i');
//     if (search) {
//       filter.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { 'location.address': { $regex: search, $options: 'i' } },
//         { 'location.city': { $regex: search, $options: 'i' } }
//       ];
//     }

//     const sortOptions = {};
//     sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

//     const properties = await Property.find(filter)
//       .populate('seller', 'name email phone profileImage')
//       .sort(sortOptions)
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .select('-inquiries');

//     const total = await Property.countDocuments(filter);

//     res.json({
//       properties,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total
//     });
//   } catch (error) {
//     console.error('Get properties error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   GET /api/properties/featured
// // @desc    Get featured properties
// // @access  Public
// router.get('/featured', async (req, res) => {
//   try {
//     const properties = await Property.find({ 
//       status: 'approved',
//       featured: true 
//     })
//       .populate('seller', 'name email phone profileImage')
//       .sort({ createdAt: -1 })
//       .limit(6)
//       .select('-inquiries');

//     res.json(properties);
//   } catch (error) {
//     console.error('Get featured properties error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   GET /api/properties/:id
// // @desc    Get single property by ID
// // @access  Public
// router.get('/:id', async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id)
//       .populate('seller', 'name email phone profileImage')
//       .populate('inquiries.user', 'name email phone');

//     if (!property) {
//       return res.status(404).json({ message: 'Property not found' });
//     }

//     // Increment view count
//     property.views += 1;
//     await property.save();

//     res.json(property);
//   } catch (error) {
//     console.error('Get property error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/properties
// // @desc    Create new property
// // @access  Private (Seller only)
// router.post('/', auth, sellerAuth, upload.array('images', 10), [
//   body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
//   body('description').trim().isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
//   body('type').isIn(['apartment', 'house', 'villa', 'commercial', 'land']).withMessage('Invalid property type'),
//   body('purpose').isIn(['sale', 'rent']).withMessage('Purpose must be sale or rent'),
//   body('price').isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
//   body('area').isNumeric().isFloat({ min: 0 }).withMessage('Area must be a positive number'),
//   body('bedrooms').optional().isInt({ min: 0 }),
//   body('bathrooms').optional().isInt({ min: 0 }),
//   body('location.address').trim().isLength({ min: 10 }).withMessage('Address must be at least 10 characters'),
//   body('location.city').trim().isLength({ min: 2 }).withMessage('City is required'),
//   body('location.state').trim().isLength({ min: 2 }).withMessage('State is required'),
//   body('location.pincode').isPostalCode('IN').withMessage('Valid pincode is required')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     // Check if user has active subscription for premium features
//     const user = await User.findById(req.userId);
//     if (!user.subscription.isActive && user.subscription.plan === 'free') {
//       return res.status(403).json({ 
//         message: 'Premium subscription required to list properties' 
//       });
//     }

//     const {
//       title,
//       description,
//       type,
//       purpose,
//       price,
//       area,
//       bedrooms,
//       bathrooms,
//       floors,
//       parking,
//       furnishing,
//       age,
//       amenities,
//       location,
//       virtualTour
//     } = req.body;

//     // Process uploaded images (in a real app, you'd upload to cloud storage)
//     const images = req.files ? req.files.map((file, index) => ({
//       url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
//       caption: `Image ${index + 1}`,
//       isPrimary: index === 0
//     })) : [];

//     if (images.length < 4) {
//       return res.status(400).json({ 
//         message: 'At least 4 images are required' 
//       });
//     }

//     const property = new Property({
//       title,
//       description,
//       type,
//       purpose,
//       price,
//       area,
//       pricePerSqft: Math.round(price / area),
//       bedrooms: bedrooms || 0,
//       bathrooms: bathrooms || 0,
//       floors: floors || 1,
//       parking: parking || 0,
//       furnishing: furnishing || 'unfurnished',
//       age,
//       images,
//       location: {
//         ...location,
//         coordinates: location.coordinates ? {
//           latitude: parseFloat(location.coordinates.latitude),
//           longitude: parseFloat(location.coordinates.longitude)
//         } : undefined
//       },
//       amenities: amenities || [],
//       seller: req.userId,
//       virtualTour: virtualTour || '',
//       premium: user.subscription.plan === 'sellpro'
//     });

//     await property.save();

//     res.status(201).json({
//       message: 'Property created successfully. Waiting for admin approval.',
//       property: {
//         id: property._id,
//         title: property.title,
//         type: property.type,
//         price: property.price,
//         status: property.status
//       }
//     });
//   } catch (error) {
//     console.error('Create property error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   PUT /api/properties/:id
// // @desc    Update property
// // @access  Private (Seller only)
// router.put('/:id', auth, sellerAuth, upload.array('images', 10), async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id);
    
//     if (!property) {
//       return res.status(404).json({ message: 'Property not found' });
//     }

//     if (property.seller.toString() !== req.userId.toString()) {
//       return res.status(403).json({ message: 'Not authorized to update this property' });
//     }

//     const updateData = { ...req.body };
    
//     // Process new images if uploaded
//     if (req.files && req.files.length > 0) {
//       const newImages = req.files.map((file, index) => ({
//         url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
//         caption: `Image ${index + 1}`,
//         isPrimary: index === 0
//       }));
      
//       updateData.images = [...property.images, ...newImages];
//     }

//     // Reset status to pending if significant changes made
//     if (updateData.price || updateData.area || updateData.title) {
//       updateData.status = 'pending';
//     }

//     const updatedProperty = await Property.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     res.json({
//       message: 'Property updated successfully',
//       property: updatedProperty
//     });
//   } catch (error) {
//     console.error('Update property error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   DELETE /api/properties/:id
// // @desc    Delete property
// // @access  Private (Seller only)
// router.delete('/:id', auth, sellerAuth, async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id);
    
//     if (!property) {
//       return res.status(404).json({ message: 'Property not found' });
//     }

//     if (property.seller.toString() !== req.userId.toString()) {
//       return res.status(403).json({ message: 'Not authorized to delete this property' });
//     }

//     await Property.findByIdAndDelete(req.params.id);

//     res.json({ message: 'Property deleted successfully' });
//   } catch (error) {
//     console.error('Delete property error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/properties/:id/like
// // @desc    Like/unlike property
// // @access  Private
// router.post('/:id/like', auth, async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id);
    
//     if (!property) {
//       return res.status(404).json({ message: 'Property not found' });
//     }

//     const isLiked = property.likes.includes(req.userId);
    
//     if (isLiked) {
//       property.likes = property.likes.filter(
//         like => like.toString() !== req.userId.toString()
//       );
//     } else {
//       property.likes.push(req.userId);
//     }

//     await property.save();

//     res.json({
//       message: isLiked ? 'Property unliked' : 'Property liked',
//       isLiked: !isLiked,
//       likesCount: property.likes.length
//     });
//   } catch (error) {
//     console.error('Like property error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/properties/:id/inquire
// // @desc    Send inquiry for property
// // @access  Private
// router.post('/:id/inquire', auth, [
//   body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
//   body('contact').optional().trim()
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { message, contact } = req.body;
//     const property = await Property.findById(req.params.id);
    
//     if (!property) {
//       return res.status(404).json({ message: 'Property not found' });
//     }

//     const inquiry = {
//       user: req.userId,
//       message,
//       contact: contact || req.user.phone
//     };

//     property.inquiries.push(inquiry);
//     await property.save();

//     res.json({
//       message: 'Inquiry sent successfully',
//       inquiry: {
//         id: inquiry._id,
//         message: inquiry.message,
//         contact: inquiry.contact,
//         date: inquiry.date
//       }
//     });
//   } catch (error) {
//     console.error('Send inquiry error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   GET /api/properties/seller/my-properties
// // @desc    Get seller's properties
// // @access  Private (Seller only)
// router.get('/seller/my-properties', auth, sellerAuth, async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const status = req.query.status;

//     const filter = { seller: req.userId };
//     if (status) filter.status = status;

//     const properties = await Property.find(filter)
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const total = await Property.countDocuments(filter);

//     res.json({
//       properties,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total
//     });
//   } catch (error) {
//     console.error('Get seller properties error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;




















const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Property = require('../models/Property');
const User = require('../models/User');
// CORRECTED: Changed 'sellerAuth' to 'requireSeller' to match the middleware file
const { auth, requireSeller } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
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
      minArea,
      maxArea,
      bedrooms,
      bathrooms,
      city,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = { isApproved: true }; // Changed from status: 'approved' to isApproved: true to match schema
    
    if (type) filter.type = type;
    if (purpose) filter.purpose = purpose;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    if (minArea || maxArea) {
      filter.area = {};
      if (minArea) filter.area.$gte = parseInt(minArea);
      if (maxArea) filter.area.$lte = parseInt(maxArea);
    }
    if (bedrooms) filter.bedrooms = { $gte: parseInt(bedrooms) };
    if (bathrooms) filter.bathrooms = { $gte: parseInt(bathrooms) };
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const properties = await Property.find(filter)
      .populate('seller', 'name email phone profileImage')
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

// @route   GET /api/properties/featured
// @desc    Get featured properties
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const properties = await Property.find({ 
      isApproved: true, 
      isFeatured: true 
    })
      .populate('seller', 'name email phone profileImage')
      .sort({ createdAt: -1 })
      .limit(6)
      .select('-inquiries');

    res.json(properties);
  } catch (error) {
    console.error('Get featured properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/properties/:id
// @desc    Get single property by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('seller', 'name email phone profileImage');

    if (!property || !property.isApproved) {
      return res.status(404).json({ message: 'Property not found or not approved' });
    }

    // Increment view count
    property.views += 1;
    await property.save();

    res.json(property);
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/properties
// @desc    Create new property
// @access  Private (Seller only)
// CORRECTED: Using requireSeller
router.post('/', auth, requireSeller, upload.array('images', 10), [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  body('description').trim().isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
  body('type').isIn(['apartment', 'house', 'villa', 'commercial', 'land', 'other']).withMessage('Invalid property type'),
  body('purpose').isIn(['sale', 'rent']).withMessage('Purpose must be sale or rent'),
  body('price').isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('area').isNumeric().isFloat({ min: 0 }).withMessage('Area must be a positive number'),
  body('bedrooms').isInt({ min: 0 }),
  body('bathrooms').isInt({ min: 0 }),
  body('location.address').trim().isLength({ min: 10 }).withMessage('Address must be at least 10 characters'),
  body('location.city').trim().isLength({ min: 2 }).withMessage('City is required'),
  body('location.state').trim().isLength({ min: 2 }).withMessage('State is required'),
  body('location.zipCode').isPostalCode('IN').withMessage('Valid pincode is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // This logic should be adapted if you have different subscription plans
    const user = await User.findById(req.user.userId);
    if (user.subscription.plan !== 'sellpro' && user.subscription.plan !== 'admin') {
       return res.status(403).json({ 
         message: 'A seller subscription is required to list properties.' 
       });
    }

    const images = req.files ? req.files.map((file, index) => ({
      // In a real app, you'd upload to a service like Cloudinary and save the URL
      url: `placeholder_for_image_${index}.jpg`, 
      public_id: `placeholder_${index}`
    })) : [];

    if (images.length < 1) { // Adjusted for simplicity, can be higher
      return res.status(400).json({ 
        message: 'At least 1 image is required.' 
      });
    }

    const propertyData = { ...req.body, images, seller: req.user.userId };
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

// @route   PUT /api/properties/:id
// @desc    Update property
// @access  Private (Seller only)
// CORRECTED: Using requireSeller
router.put('/:id', auth, requireSeller, upload.array('images', 10), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    // In a real app, you'd handle image updates/deletions here
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { ...req.body, isApproved: false }, // Set isApproved to false on update to require re-approval
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Property updated successfully. It is pending re-approval.',
      property: updatedProperty
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete property
// @access  Private (Seller only)
// CORRECTED: Using requireSeller
router.delete('/:id', auth, requireSeller, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/properties/:id/like
// @desc    Like/unlike property
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const isLiked = property.likes.includes(req.user.userId);
    
    if (isLiked) {
      property.likes = property.likes.filter(
        like => like.toString() !== req.user.userId.toString()
      );
    } else {
      property.likes.push(req.user.userId);
    }

    await property.save();

    res.json({
      message: isLiked ? 'Property unliked' : 'Property liked',
      likesCount: property.likes.length
    });
  } catch (error) {
    console.error('Like property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/properties/:id/inquire
// @desc    Send inquiry for property
// @access  Private
router.post('/:id/inquire', auth, [
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const user = await User.findById(req.user.userId);

    const inquiry = {
      user: req.user.userId,
      message,
      contactInfo: {
          name: user.name,
          email: user.email,
          phone: user.phone
      }
    };

    property.inquiries.push(inquiry);
    await property.save();

    res.json({
      message: 'Inquiry sent successfully',
      inquiry
    });
  } catch (error) {
    console.error('Send inquiry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/properties/seller/my-properties
// @desc    Get seller's properties
// @access  Private (Seller only)
// CORRECTED: Using requireSeller
router.get('/seller/my-properties', auth, requireSeller, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status } = req.query;

    const filter = { seller: req.user.userId };
    if (status) filter.status = status;

    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Property.countDocuments(filter);

    res.json({
      properties,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get seller properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;