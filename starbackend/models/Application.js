const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  fileName: String,
  originalName: String,
  documentType: Number,
  uploadDate: { type: Date, default: Date.now }
});

const applicationSchema = new mongoose.Schema({
  // CAN Information
  hasCAN: Boolean,
  canNumber: String,
  
  // Personal Details
  name: String,
  aadharName: String,
  aadharNumber: String,
  fatherName: String,
  motherName: String,
  dob: Date,
  address: String,
  mobileNumber: String,
  
  // Patta Options
  pattaOption: String,
  district: String,
  taluk: String,
  village: String,
  areaType: String,
  reason: String,
  
  // Land Details
  surveyNo: String,
  subDivisionNo: String,
  sroName: String,
  regDocNo: String,
  docYear: String,  // Correct field name
  registeredDate: Date,
  landCategory: String,
  
  
  // Documents
  documents: [documentSchema],
  
  // Status
 status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'completed', 'in review', 'approved', 'rejected']
  },
    
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

applicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Application', applicationSchema);