const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  status: {
    type: String,
    enum: ['subscribed', 'unsubscribed', 'pending'],
    default: 'pending'
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  unsubscriptionDate: {
    type: Date
  },
  emailsSent: {
    type: Number,
    default: 0
  },
  lastEmailSent: {
    type: Date
  },
  verificationToken: {
    type: String
  },
  verificationTokenExpire: {
    type: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  preferences: {
    categories: [{
      type: String,
      enum: [
        'Market Analysis',
        'Education', 
        'Business',
        'Events',
        'Interviews',
        'Press Release'
      ]
    }],
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    }
  },
  source: {
    type: String,
    enum: ['website', 'social', 'referral', 'organic'],
    default: 'website'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better performance
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ status: 1 });
newsletterSchema.index({ subscriptionDate: -1 });

module.exports = mongoose.model('Newsletter', newsletterSchema);