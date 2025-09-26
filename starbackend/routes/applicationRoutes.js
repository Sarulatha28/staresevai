const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 400 * 1024 } // 400KB limit
});

// Submit new application
router.post('/submit', upload.array('documents', 8), async (req, res) => {
  try {
    const applicationData = JSON.parse(req.body.applicationData);
    
    // Process uploaded files
    const documents = req.files ? req.files.map((file, index) => ({
      documentType: parseInt(req.body.documentTypes[index]),
      fileName: file.filename,
      originalName: file.originalname,
      uploadDate: new Date()
    })) : [];

    const application = new Application({
      ...applicationData,
      documents: documents
    });

    await application.save();
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application._id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message
    });
  }
});

// Get all applications (for admin)
router.get('/all', async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .select('name mobileNumber district village status createdAt');
    
    res.json({
      success: true,
      applications: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
});

// Get single application details
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      application: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching application details',
      error: error.message
    });
  }
});

// Update application status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Application status updated',
      application: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating application status',
      error: error.message
    });
  }
});

module.exports = router;