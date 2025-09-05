const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user no longer exists'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Middleware to check if user is approved
const requireApproval = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Account not approved yet. Please wait for admin approval.'
      });
    }
    
    next();
  } catch (error) {
    console.error('Approval middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in approval check'
    });
  }
};

// Middleware to check user roles
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  next();
};

// Middleware to check if user is seller
const requireSeller = (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Seller role required.'
    });
  }
  next();
};

// Middleware to check if user is buyer
const requireBuyer = (req, res, next) => {
  if (req.user.role !== 'buyer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Buyer role required.'
    });
  }
  next();
};

// Middleware to check premium plan
const requirePremium = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (user.premiumPlan === 'free') {
      return res.status(403).json({
        success: false,
        message: 'Premium plan required to access this feature'
      });
    }
    
    // Check if premium plan is still valid
    if (user.premiumExpiry && user.premiumExpiry < new Date()) {
      return res.status(403).json({
        success: false,
        message: 'Premium plan has expired. Please renew your subscription.'
      });
    }
    
    next();
  } catch (error) {
    console.error('Premium middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in premium check'
    });
  }
};

// Middleware to check specific premium plan
const requireSpecificPremium = (planType) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId);
      
      if (user.premiumPlan !== planType) {
        return res.status(403).json({
          success: false,
          message: `${planType} plan required to access this feature`
        });
      }
      
      // Check if premium plan is still valid
      if (user.premiumExpiry && user.premiumExpiry < new Date()) {
        return res.status(403).json({
          success: false,
          message: 'Premium plan has expired. Please renew your subscription.'
        });
      }
      
      next();
    } catch (error) {
      console.error('Specific premium middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error in premium check'
      });
    }
  };
};

// Middleware to check if user owns the resource
const requireOwnership = (model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const resource = await model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }
      
      // Check if user owns the resource or is admin
      if (resource.user && resource.user.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own resources.'
        });
      }
      
      // For properties, check seller field
      if (resource.seller && resource.seller.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own resources.'
        });
      }
      
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error in ownership check'
      });
    }
  };
};

module.exports = {
  auth,
  requireApproval,
  requireRole,
  requireAdmin,
  requireSeller,
  requireBuyer,
  requirePremium,
  requireSpecificPremium,
  requireOwnership
};