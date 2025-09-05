// const mongoose = require('mongoose');

// const paymentSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   planType: {
//     type: String,
//     required: [true, 'Please specify plan type'],
//     enum: ['premium', 'vip', 'sellpro']
//   },
//   amount: {
//     type: Number,
//     required: [true, 'Please provide payment amount'],
//     min: [0, 'Amount cannot be negative']
//   },
//   currency: {
//     type: String,
//     default: 'INR'
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'success', 'failed', 'cancelled', 'refunded'],
//     default: 'pending'
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['payu', 'razorpay', 'stripe', 'cash'],
//     default: 'payu'
//   },
//   transactionId: {
//     type: String,
//     unique: true,
//     sparse: true
//   },
//   payuDetails: {
//     txnid: String,
//     amount: String,
//     productinfo: String,
//     firstname: String,
//     email: String,
//     phone: String,
//     surl: String,
//     furl: String,
//     hash: String,
//     key: String,
//     salt: String,
//     status: String,
//     mode: String,
//     bank_ref_num: String,
//     bankcode: String,
//     error: String,
//     error_Message: String
//   },
//   planDetails: {
//     name: String,
//     duration: Number, // in months
//     features: [String],
//     startDate: Date,
//     endDate: Date
//   },
//   refundDetails: {
//     refundId: String,
//     refundAmount: Number,
//     refundReason: String,
//     refundDate: Date,
//     refundStatus: {
//       type: String,
//       enum: ['pending', 'processed', 'failed']
//     }
//   },
//   metadata: {
//     ipAddress: String,
//     userAgent: String,
//     deviceType: String,
//     browser: String
//   },
//   notes: String,
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true
// });

// // Index for better query performance
// paymentSchema.index({ user: 1, status: 1 });
// paymentSchema.index({ transactionId: 1 });
// paymentSchema.index({ createdAt: -1 });

// // Virtual for payment duration in days
// paymentSchema.virtual('durationInDays').get(function() {
//   if (this.planDetails.startDate && this.planDetails.endDate) {
//     return Math.ceil((this.planDetails.endDate - this.planDetails.startDate) / (1000 * 60 * 60 * 24));
//   }
//   return 0;
// });

// // Method to check if payment is successful
// paymentSchema.methods.isSuccessful = function() {
//   return this.status === 'success';
// };

// // Method to check if payment is refundable
// paymentSchema.methods.isRefundable = function() {
//   const refundWindow = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
//   const now = new Date();
//   const paymentDate = this.createdAt;
  
//   return this.status === 'success' && 
//          (now - paymentDate) <= refundWindow &&
//          !this.refundDetails.refundId;
// };

// // Method to calculate refund amount
// paymentSchema.methods.calculateRefundAmount = function() {
//   if (!this.isRefundable()) {
//     return 0;
//   }
  
//   // For now, return full amount
//   // You can implement prorated refund logic here
//   return this.amount;
// };

// // Static method to get payment statistics
// paymentSchema.statics.getPaymentStats = async function() {
//   const stats = await this.aggregate([
//     {
//       $group: {
//         _id: '$status',
//         count: { $sum: 1 },
//         totalAmount: { $sum: '$amount' }
//       }
//     }
//   ]);
  
//   return stats;
// };

// // Static method to get revenue by plan type
// paymentSchema.statics.getRevenueByPlan = async function() {
//   const revenue = await this.aggregate([
//     {
//       $match: { status: 'success' }
//     },
//     {
//       $group: {
//         _id: '$planType',
//         count: { $sum: 1 },
//         totalRevenue: { $sum: '$amount' }
//       }
//     }
//   ]);
  
//   return revenue;
// };

// module.exports = mongoose.model('Payment', paymentSchema);














const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  plan: {
    type: String,
    enum: ['premium', 'vip', 'sellpro'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// --- FIX IS HERE ---
module.exports = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
