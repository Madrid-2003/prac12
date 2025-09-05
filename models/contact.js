const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    trim: true,
    maxlength: [100, 'Subject cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please provide your message'],
    trim: true,
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  category: {
    type: String,
    enum: ['general', 'support', 'complaint', 'suggestion', 'business', 'partnership'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  response: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    ipAddress: String,
    userAgent: String,
    source: {
      type: String,
      enum: ['website', 'mobile_app', 'api', 'admin_panel'],
      default: 'website'
    },
    referrer: String
  },
  tags: [String],
  isRead: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  notes: String
}, {
  timestamps: true
});

// Index for better query performance
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ category: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ assignedTo: 1 });
contactSchema.index({ isRead: 1 });

// Virtual for response time in hours
contactSchema.virtual('responseTimeInHours').get(function() {
  if (this.response && this.response.respondedAt) {
    return Math.ceil((this.response.respondedAt - this.createdAt) / (1000 * 60 * 60));
  }
  return null;
});

// Method to mark as read
contactSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

// Method to assign to admin
contactSchema.methods.assignTo = function(adminId) {
  this.assignedTo = adminId;
  this.status = 'in_progress';
  return this.save();
};

// Method to add response
contactSchema.methods.addResponse = function(message, adminId) {
  this.response = {
    message,
    respondedBy: adminId,
    respondedAt: new Date()
  };
  this.status = 'resolved';
  this.isRead = true;
  return this.save();
};

// Static method to get contact statistics
contactSchema.statics.getContactStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return stats;
};

// Static method to get contacts by category
contactSchema.statics.getContactsByCategory = async function() {
  const categories = await this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  return categories;
};

// Static method to get unread contacts count
contactSchema.statics.getUnreadCount = async function() {
  const count = await this.countDocuments({ isRead: false, isArchived: false });
  return count;
};

module.exports = mongoose.model('Contact', contactSchema);