const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/contact
// @desc    Send contact message
// @access  Public
router.post('/', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('subject').trim().isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  body('type').optional().isIn(['general', 'support', 'complaint', 'suggestion', 'business'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, subject, message, type = 'general' } = req.body;

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      type,
      priority: type === 'complaint' ? 'high' : 'medium'
    });

    await contact.save();

    res.status(201).json({
      message: 'Message sent successfully. We will get back to you soon.',
      contactId: contact._id
    });
  } catch (error) {
    console.error('Send contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/contact/admin-info
// @desc    Get admin contact information
// @access  Public
router.get('/admin-info', (req, res) => {
  const adminInfo = {
    email: 'admin@realestate.com',
    phone: '+91-9876543210',
    address: {
      street: '123 Business Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    workingHours: {
      weekdays: '9:00 AM - 6:00 PM',
      weekends: '10:00 AM - 4:00 PM',
      timezone: 'IST'
    },
    socialMedia: {
      facebook: 'https://facebook.com/realestate',
      twitter: 'https://twitter.com/realestate',
      linkedin: 'https://linkedin.com/company/realestate',
      instagram: 'https://instagram.com/realestate'
    },
    supportChannels: [
      'Email Support',
      'Phone Support',
      'Live Chat',
      'WhatsApp Support'
    ]
  };

  res.json(adminInfo);
});

// @route   GET /api/contact/faq
// @desc    Get frequently asked questions
// @access  Public
router.get('/faq', (req, res) => {
  const faqs = [
    {
      id: 1,
      question: 'How do I register as a seller?',
      answer: 'Click on "Register as Seller" and fill out the registration form. Your account will be reviewed by our admin team and approved within 24-48 hours.'
    },
    {
      id: 2,
      question: 'What documents do I need to upload as a seller?',
      answer: 'You need to upload proof of ownership (property documents), identity proof (Aadhar/PAN), and any other relevant documents to verify your property.'
    },
    {
      id: 3,
      question: 'How many images can I upload for a property?',
      answer: 'You can upload a minimum of 4 images and up to 10 images for each property listing. The first image will be used as the primary image.'
    },
    {
      id: 4,
      question: 'What are the subscription plans available?',
      answer: 'We offer Premium Plan (₹999), VIP Plan (₹1999) for buyers, and SellPro Plan (₹1499) for sellers. Each plan offers different features and benefits.'
    },
    {
      id: 5,
      question: 'How do I contact a seller?',
      answer: 'You can send an inquiry through the property listing page, or contact them directly using the contact information provided by the seller.'
    },
    {
      id: 6,
      question: 'Is there a refund policy?',
      answer: 'Yes, we offer a 7-day refund policy for subscription payments. Refund requests must be submitted within 7 days of payment.'
    },
    {
      id: 7,
      question: 'How do I withdraw money from my wallet?',
      answer: 'You can request a withdrawal from your dashboard. Withdrawals are processed within 3-5 business days to your registered bank account.'
    },
    {
      id: 8,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, net banking, UPI, and digital wallets through our secure PayU payment gateway.'
    }
  ];

  res.json(faqs);
});

// @route   GET /api/contact/user-messages
// @desc    Get user's contact messages (if logged in)
// @access  Private
router.get('/user-messages', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const contacts = await Contact.find({ email: user.email })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments({ email: user.email });

    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/contact/feedback
// @desc    Submit feedback
// @access  Private
router.post('/feedback', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').trim().isLength({ min: 10 }).withMessage('Feedback must be at least 10 characters'),
  body('category').isIn(['website', 'service', 'property', 'payment', 'other']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, feedback, category } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const contact = new Contact({
      name: user.name,
      email: user.email,
      phone: user.phone,
      subject: `Feedback - ${category}`,
      message: `Rating: ${rating}/5\n\n${feedback}`,
      type: 'suggestion',
      priority: rating <= 2 ? 'high' : 'medium'
    });

    await contact.save();

    res.json({
      message: 'Thank you for your feedback!',
      contactId: contact._id
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
