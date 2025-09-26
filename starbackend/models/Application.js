const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Personal Details
  name: { type: String, required: true },
  aadharName: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  fatherName: String,
  motherName: String,
  dob: Date,
  address: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  
  // Patta Details
  pattaOption: { type: String, required: true },
  district: { type: String, required: true },
  taluk: { type: String, required: true },
  village: { type: String, required: true },
  areaType: { type: String, required: true },
  reason: String,
  
  // Land Details
  surveyNo: { type: String, required: true },
  subDivisionNo: { type: String, required: true },
  sroName: { type: String, required: true },
  regDocNo: { type: String, required: true },
  registeredDate: { type: Date, required: true },
  landCategory: { type: String, required: true },
  
  
  // CAN Details
  hasCAN: Boolean,
  canNumber: String,
  
  // Document Details
  documents: [{
    documentType: Number,
    fileName: String,
    originalName: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  
  // Application Status
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  
  // Auto-delete after 5 days
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 432000 // 5 days in seconds (5 * 24 * 60 * 60)
  }
});

// Create TTL index for automatic deletion after 5 days
applicationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 432000 });

module.exports = mongoose.model('Application', applicationSchema);