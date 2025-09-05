const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a property title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a property description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  type: {
    type: String,
    required: [true, 'Please specify property type'],
    enum: ['apartment', 'house', 'villa', 'commercial', 'land', 'other']
  },
  purpose: {
    type: String,
    required: [true, 'Please specify purpose'],
    enum: ['sale', 'rent']
  },
  price: {
    type: Number,
    required: [true, 'Please provide property price'],
    min: [0, 'Price cannot be negative']
  },
  area: {
    type: Number,
    required: [true, 'Please provide property area'],
    min: [0, 'Area cannot be negative']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Please specify number of bedrooms'],
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please specify number of bathrooms'],
    min: [0, 'Bathrooms cannot be negative']
  },
  parking: {
    type: Number,
    default: 0,
    min: [0, 'Parking cannot be negative']
  },
  floor: {
    type: Number,
    default: 0
  },
  totalFloors: {
    type: Number,
    default: 0
  },
  age: {
    type: Number,
    default: 0,
    min: [0, 'Age cannot be negative']
  },
  furnishing: {
    type: String,
    enum: ['furnished', 'semi-furnished', 'unfurnished'],
    default: 'unfurnished'
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  location: {
    address: {
      type: String,
      required: [true, 'Please provide property address']
    },
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    state: {
      type: String,
      required: [true, 'Please provide state']
    },
    zipCode: {
      type: String,
      required: [true, 'Please provide zip code']
    },
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Please provide latitude']
      },
      longitude: {
        type: Number,
        required: [true, 'Please provide longitude']
      }
    }
  },
  amenities: [{
    type: String,
    enum: [
      'gym', 'swimming_pool', 'parking', 'security', 'elevator',
      'garden', 'balcony', 'terrace', 'power_backup', 'water_supply',
      'internet', 'cable_tv', 'air_conditioning', 'heating', 'fireplace'
    ]
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactInfo: {
    name: {
      type: String,
      required: [true, 'Please provide contact name']
    },
    phone: {
      type: String,
      required: [true, 'Please provide contact phone']
    },
    email: {
      type: String,
      required: [true, 'Please provide contact email']
    },
    whatsapp: String
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  inquiries: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    contactInfo: {
      name: String,
      phone: String,
      email: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['available', 'sold', 'rented', 'under_negotiation'],
    default: 'available'
  }
}, {
  timestamps: true
});

// Index for better search performance
propertySchema.index({ location: '2dsphere' });
propertySchema.index({ price: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ purpose: 1 });
propertySchema.index({ 'location.city': 1 });

// Virtual for property age in years
propertySchema.virtual('ageInYears').get(function() {
  return Math.floor(this.age / 12);
});

// Method to increment views
propertySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to add like
propertySchema.methods.addLike = function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove like
propertySchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(like => like.toString() !== userId.toString());
  return this.save();
};

module.exports = mongoose.model('Property', propertySchema);