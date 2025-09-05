const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// PayU configuration
const PAYU_CONFIG = {
  key: process.env.PAYU_KEY,
  salt: process.env.PAYU_MERCHANT_SALT,
  baseUrl: process.env.PAYU_BASE_URL
};

// Plan pricing
const PLAN_PRICES = {
  premium: 999, // ₹999 for premium plan
  vip: 1999,    // ₹1999 for VIP plan
  sellpro: 1499 // ₹1499 for sellpro plan
};

// Generate PayU hash
const generatePayUHash = (params) => {
  const hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${PAYU_CONFIG.salt}`;
  return crypto.createHash('sha512').update(hashString).digest('hex');
};

// @route   POST /api/payments/create-order
// @desc    Create payment order
// @access  Private
router.post('/create-order', auth, [
  body('plan').isIn(['premium', 'vip', 'sellpro']).withMessage('Invalid plan selected'),
  body('duration').optional().isInt({ min: 1, max: 365 }).withMessage('Duration must be 1-365 days')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { plan, duration = 30 } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already has active subscription
    if (user.subscription.isActive && user.subscription.endDate > new Date()) {
      return res.status(400).json({ 
        message: 'You already have an active subscription' 
      });
    }

    const amount = PLAN_PRICES[plan];
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create payment record
    const payment = new Payment({
      user: req.userId,
      transactionId,
      amount,
      plan,
      status: 'pending',
      subscription: {
        duration: parseInt(duration)
      }
    });

    await payment.save();

    // Prepare PayU parameters
    const payuParams = {
      key: PAYU_CONFIG.key,
      txnid: transactionId,
      amount: amount.toString(),
      productinfo: `${plan.toUpperCase()} Plan - Real Estate Platform`,
      firstname: user.name.split(' ')[0],
      email: user.email,
      phone: user.phone,
      surl: `${process.env.CLIENT_URL}/payment/success`,
      furl: `${process.env.CLIENT_URL}/payment/failure`,
      hash: ''
    };

    // Generate hash
    payuParams.hash = generatePayUHash(payuParams);

    res.json({
      message: 'Payment order created successfully',
      paymentId: payment._id,
      transactionId,
      amount,
      plan,
      payuParams,
      payuUrl: PAYU_CONFIG.baseUrl
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify PayU payment response
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const {
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      status,
      hash,
      key,
      salt
    } = req.body;

    // Verify hash
    const hashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_CONFIG.key}`;
    const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

    if (calculatedHash !== hash) {
      return res.status(400).json({ message: 'Invalid hash' });
    }

    // Find payment record
    const payment = await Payment.findOne({ transactionId: txnid });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update payment status
    payment.status = status === 'success' ? 'success' : 'failed';
    payment.payuTransactionId = req.body.payuId || '';
    payment.payuResponse = req.body;

    if (status === 'success') {
      // Update user subscription
      const user = await User.findById(payment.user);
      if (user) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + payment.subscription.duration);

        user.subscription = {
          plan: payment.plan,
          startDate,
          endDate,
          isActive: true
        };

        // Add wallet credit for successful payment
        user.wallet.balance += payment.amount;
        user.wallet.transactions.push({
          type: 'credit',
          amount: payment.amount,
          description: `Payment for ${payment.plan} plan`
        });

        await user.save();
      }

      payment.subscription.startDate = new Date();
      payment.subscription.endDate = new Date();
      payment.subscription.endDate.setDate(payment.subscription.endDate.getDate() + payment.subscription.duration);
    }

    await payment.save();

    res.json({
      message: status === 'success' ? 'Payment verified successfully' : 'Payment failed',
      status: payment.status,
      transactionId: payment.transactionId
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/payments/history
// @desc    Get user payment history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const payments = await Payment.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments({ user: req.userId });

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/payments/plans
// @desc    Get available subscription plans
// @access  Public
router.get('/plans', (req, res) => {
  const plans = {
    premium: {
      name: 'Premium Plan',
      price: PLAN_PRICES.premium,
      duration: 30,
      features: [
        'Access to all properties',
        'Advanced search filters',
        'Property alerts',
        'Priority customer support',
        'Property comparison tool'
      ]
    },
    vip: {
      name: 'VIP Plan',
      price: PLAN_PRICES.vip,
      duration: 30,
      features: [
        'All Premium features',
        'Exclusive VIP properties',
        'Personal property consultant',
        'Virtual property tours',
        'Investment analysis reports',
        'Early access to new listings'
      ]
    },
    sellpro: {
      name: 'SellPro Plan',
      price: PLAN_PRICES.sellpro,
      duration: 30,
      features: [
        'List unlimited properties',
        'Featured property listings',
        'Advanced analytics dashboard',
        'Lead management system',
        'Professional photography service',
        'Marketing tools and campaigns'
      ]
    }
  };

  res.json(plans);
});

// @route   POST /api/payments/refund-request
// @desc    Request refund for payment
// @access  Private
router.post('/refund-request', auth, [
  body('paymentId').isMongoId().withMessage('Valid payment ID is required'),
  body('reason').trim().isLength({ min: 10 }).withMessage('Reason must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentId, reason } = req.body;

    const payment = await Payment.findOne({
      _id: paymentId,
      user: req.userId,
      status: 'success'
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found or not eligible for refund' });
    }

    // Check if refund is within time limit (7 days)
    const daysSincePayment = Math.floor((new Date() - payment.createdAt) / (1000 * 60 * 60 * 24));
    if (daysSincePayment > 7) {
      return res.status(400).json({ 
        message: 'Refund request must be made within 7 days of payment' 
      });
    }

    // Check if refund already requested
    if (payment.refund.status) {
      return res.status(400).json({ 
        message: 'Refund already requested for this payment' 
      });
    }

    payment.refund = {
      amount: payment.amount,
      reason,
      status: 'requested'
    };

    await payment.save();

    res.json({
      message: 'Refund request submitted successfully',
      refundId: payment._id,
      status: 'requested'
    });
  } catch (error) {
    console.error('Refund request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/payments/wallet
// @desc    Get user wallet information
// @access  Private
router.get('/wallet', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('wallet subscription');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      balance: user.wallet.balance,
      transactions: user.wallet.transactions.slice(-10), // Last 10 transactions
      subscription: user.subscription
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/withdraw
// @desc    Request wallet withdrawal
// @access  Private
router.post('/withdraw', auth, [
  body('amount').isFloat({ min: 100 }).withMessage('Minimum withdrawal amount is ₹100'),
  body('bankDetails').isObject().withMessage('Bank details are required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, bankDetails } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.wallet.balance < amount) {
      return res.status(400).json({ 
        message: 'Insufficient wallet balance' 
      });
    }

    // Check if user has active subscription
    if (!user.subscription.isActive) {
      return res.status(400).json({ 
        message: 'Active subscription required for withdrawals' 
      });
    }

    // Deduct amount from wallet
    user.wallet.balance -= amount;
    user.wallet.transactions.push({
      type: 'debit',
      amount: -amount,
      description: `Withdrawal request to ${bankDetails.accountNumber}`
    });

    await user.save();

    res.json({
      message: 'Withdrawal request submitted successfully',
      amount,
      remainingBalance: user.wallet.balance
    });
  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
