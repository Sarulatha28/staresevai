
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  paymentScreenshot: {
    type: String,
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  status: { 
    type: String, 
    default: 'pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now instead of 3
  }
});

// Remove auto-delete TTL index to prevent automatic deletion
// paymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Payment', paymentSchema);