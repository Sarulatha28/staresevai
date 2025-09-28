const mongoose = require('mongoose');

const canSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  canNumber: {
    type: String,
    required: true,
    trim: true
  },
  status: { 
    type: String, 
    default: 'active' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
  }
});

// Auto-delete expired records after 3 days
canSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('CAN', canSchema);