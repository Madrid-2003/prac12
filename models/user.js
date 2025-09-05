// // // // const mongoose = require('mongoose');
// // // // const bcrypt = require('bcryptjs');

// // // // const userSchema = new mongoose.Schema({
// // // //   name: {
// // // //     type: String,
// // // //     required: [true, 'Please provide a name'],
// // // //     trim: true,
// // // //     maxlength: [50, 'Name cannot be more than 50 characters']
// // // //   },
// // // //   email: {
// // // //     type: String,
// // // //     required: [true, 'Please provide an email'],
// // // //     unique: true,
// // // //     lowercase: true,
// // // //     match: [
// // // //       /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
// // // //       'Please provide a valid email'
// // // //     ]
// // // //   },                           
// // // //   password: {
// // // //     type: String,
// // // //     required: [true, 'Please provide a password'],
// // // //     minlength: [6, 'Password must be at least 6 characters'],
// // // //     select: false
// // // //   },
// // // //   role: {
// // // //     type: String,
// // // //     enum: ['buyer', 'seller', 'admin'],
// // // //     default: 'buyer'
// // // //   },
// // // //   phone: {
// // // //     type: String,
// // // //     required: [true, 'Please provide a phone number'],
// // // //     match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
// // // //   },
// // // //   address: {
// // // //     street: String,
// // // //     city: String,
// // // //     state: String,
// // // //     zipCode: String,
// // // //     country: {
// // // //       type: String,
// // // //       default: 'India'
// // // //     }
// // // //   },
// // // //   isApproved: {
// // // //     type: Boolean,
// // // //     default: false
// // // //   },
// // // //   premiumPlan: {
// // // //     type: String,
// // // //     enum: ['free', 'premium', 'vip', 'sellpro'],
// // // //     default: 'free'
// // // //   },
// // // //   premiumExpiry: {
// // // //     type: Date,
// // // //     default: null
// // // //   },
// // // //   documents: [{
// // // //     type: {
// // // //       type: String,
// // // //       enum: ['aadhar', 'pan', 'driving_license', 'passport', 'other']
// // // //     },
// // // //     url: String,
// // // //     uploadedAt: {
// // // //       type: Date,
// // // //       default: Date.now
// // // //     }
// // // //   }],
// // // //   profileImage: {
// // // //     type: String,
// // // //     default: null
// // // //   },
// // // //   isActive: {
// // // //     type: Boolean,
// // // //     default: true
// // // //   },
// // // //   lastLogin: {
// // // //     type: Date,
// // // //     default: null
// // // //   },
// // // //   resetPasswordToken: String,
// // // //   resetPasswordExpire: Date
// // // // }, {
// // // //   timestamps: true
// // // // });

// // // // // Encrypt password before saving
// // // // userSchema.pre('save', async function(next) {
// // // //   if (!this.isModified('password')) {
// // // //     next();
// // // //   }
// // // //   const salt = await bcrypt.genSalt(10);
// // // //   this.password = await bcrypt.hash(this.password, salt);
// // // // });

// // // // // Match password
// // // // userSchema.methods.matchPassword = async function(enteredPassword) {
// // // //   return await bcrypt.compare(enteredPassword, this.password);
// // // // };

// // // // module.exports = mongoose.model('User', userSchema);









// // // const mongoose = require('mongoose');
// // // const bcrypt = require('bcryptjs'); // Library to encrypt passwords

// // // const UserSchema = new mongoose.Schema({
// // //   name: {
// // //     type: String,
// // //     required: [true, 'Please add a name']
// // //   },
// // //   email: {
// // //     type: String,
// // //     required: [true, 'Please add an email'],
// // //     unique: true,
// // //     match: [
// // //       /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
// // //       'Please add a valid email'
// // //     ]
// // //   },
// // //   role: {
// // //     type: String,
// // //     enum: ['buyer', 'seller', 'admin'],
// // //     default: 'buyer'
// // //   },
// // //   password: {
// // //     type: String,
// // //     required: [true, 'Please add a password'],
// // //     minlength: 6,
// // //     select: false // This will not show the password in API responses
// // //   },
// // //   phone: {
// // //     type: String,
// // //     required: [true, 'Please add a phone number']
// // //   },
// // //   address: {
// // //     street: String,
// // //     city: String,
// // //     state: String,
// // //     zipCode: String,
// // //     country: String
// // //   },
// // //   isApproved: {
// // //     type: Boolean,
// // //     default: false
// // //   },
// // //   isActive: {
// // //     type: Boolean,
// // //     default: true
// // //   },
// // //   // ... other fields from your model
// // //   createdAt: {
// // //     type: Date,
// // //     default: Date.now
// // //   }
// // // });

// // // // --- FIX STARTS HERE ---

// // // // Middleware to ENCRYPT password before saving the user
// // // UserSchema.pre('save', async function (next) {
// // //   // Only run this function if password was actually modified
// // //   if (!this.isModified('password')) {
// // //     next();
// // //   }

// // //   // Generate a salt
// // //   const salt = await bcrypt.genSalt(10);
// // //   // Hash the password using our new salt
// // //   this.password = await bcrypt.hash(this.password, salt);
// // // });

// // // // Method to COMPARE entered password with the hashed password in the database
// // // UserSchema.methods.matchPassword = async function (enteredPassword) {
// // //   return await bcrypt.compare(enteredPassword, this.password);
// // // };

// // // // --- FIX ENDS HERE ---

// // // module.exports = mongoose.model('User', UserSchema);











// // const mongoose = require('mongoose');
// // const bcrypt = require('bcryptjs'); // Library to encrypt passwords

// // const UserSchema = new mongoose.Schema({
// //   name: {
// //     type: String,
// //     required: [true, 'Please add a name']
// //   },
// //   email: {
// //     type: String,
// //     required: [true, 'Please add an email'],
// //     unique: true,
// //     match: [
// //       /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
// //       'Please add a valid email'
// //     ]
// //   },
// //   role: {
// //     type: String,
// //     enum: ['buyer', 'seller', 'admin'],
// //     default: 'buyer'
// //   },
// //   password: {
// //     type: String,
// //     required: [true, 'Please add a password'],
// //     minlength: 6,
// //     select: false // This will not show the password in API responses
// //   },
// //   phone: {
// //     type: String,
// //     required: [true, 'Please add a phone number']
// //   },
// //   address: {
// //     street: String,
// //     city: String,
// //     state: String,
// //     zipCode: String,
// //     country: String
// //   },
// //   isApproved: {
// //     type: Boolean,
// //     default: false
// //   },
// //   isActive: {
// //     type: Boolean,
// //     default: true
// //   },
// //   lastLogin: {
// //     type: Date
// //   },
// //   createdAt: {
// //     type: Date,
// //     default: Date.now
// //   }
// // });

// // // Middleware to ENCRYPT password before saving the user
// // UserSchema.pre('save', async function (next) {
// //   // Only run this function if password was actually modified
// //   if (!this.isModified('password')) {
// //     next();
// //   }

// //   // Generate a salt
// //   const salt = await bcrypt.genSalt(10);
// //   // Hash the password using our new salt
// //   this.password = await bcrypt.hash(this.password, salt);
// // });

// // // Method to COMPARE entered password with the hashed password in the database
// // UserSchema.methods.matchPassword = async function (enteredPassword) {
// //   return await bcrypt.compare(enteredPassword, this.password);
// // };

// // module.exports = mongoose.model('User', UserSchema);













// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Please add a name'],
//   },
//   email: {
//     type: String,
//     required: [true, 'Please add an email'],
//     unique: true,
//     match: [
//       /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//       'Please add a valid email',
//     ],
//   },
//   role: {
//     type: String,
//     enum: ['buyer', 'seller', 'admin'],
//     default: 'buyer',
//   },
//   password: {
//     type: String,
//     required: [true, 'Please add a password'],
//     minlength: 6,
//     select: false, // Prevents password from being sent in API responses
//   },
//   phone: {
//     type: String,
//     required: [true, 'Please add a phone number'],
//   },
//   isApproved: {
//     type: Boolean,
//     default: false,
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
//   lastLogin: {
//     type: Date,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Middleware to ENCRYPT password before saving the user
// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Method to COMPARE entered password with the hashed password in the database
// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('User', UserSchema);




















// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Please add a name'],
//   },
//   email: {
//     type: String,
//     required: [true, 'Please add an email'],
//     unique: true,
//     match: [
//       /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//       'Please add a valid email',
//     ],
//   },
//   role: {
//     type: String,
//     enum: ['buyer', 'seller', 'admin'],
//     default: 'buyer',
//   },
//   password: {
//     type: String,
//     required: [true, 'Please add a password'],
//     minlength: 6,
//     select: false,
//   },
//   phone: {
//     type: String,
//     required: [true, 'Please add a phone number'],
//   },
//   isApproved: {
//     type: Boolean,
//     default: false,
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
//   // --- FIX IS HERE ---
//   // Added the subscription object that the frontend Dashboard expects.
//   subscription: {
//     plan: {
//       type: String,
//       enum: ['free', 'premium', 'vip', 'sellpro'],
//       default: 'free'
//     },
//     isActive: {
//       type: Boolean,
//       default: true
//     },
//     endDate: {
//       type: Date
//     }
//   },
//   lastLogin: {
//     type: Date,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// }, {
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Create a virtual 'status' field that the frontend expects
// UserSchema.virtual('status').get(function() {
//   return this.isApproved ? 'approved' : 'pending';
// });

// // Middleware to encrypt password before saving
// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Method to compare entered password with the hashed password
// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('User', UserSchema);















const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false, // Should be false by default for security
  },
  subscription: {
    plan: {
      type: String,
      default: 'free',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    endDate: Date,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

UserSchema.virtual('status').get(function() {
  return this.isApproved ? 'approved' : 'pending';
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- FIX IS HERE ---
// This checks if the model is already compiled before trying to compile it again.
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);

