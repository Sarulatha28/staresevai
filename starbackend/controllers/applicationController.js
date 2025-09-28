const Application = require('../models/Application');
const CAN = require('../models/CAN');
const fs = require('fs');
const path = require('path');

// Submit application
exports.submitApplication = async (req, res) => {
  try {
    const applicationData = JSON.parse(req.body.applicationData);
    const files = req.files;
    const documentTypes = JSON.parse(req.body.documentTypes || '[]');

    console.log('Files received:', files);
    console.log('Document types:', documentTypes);

    // Handle CAN submission if applicable
    if (applicationData.hasCAN && applicationData.canNumber) {
      const canRecord = new CAN({
        name: applicationData.name,
        canNumber: applicationData.canNumber
      });
      await canRecord.save();
    }

    // Prepare documents array
    const documents = files.map((file, index) => ({
      fileName: file.filename,
      originalName: file.originalname,
      documentType: documentTypes[index] || 0,
      uploadDate: new Date()
    }));

    console.log('Prepared documents:', documents);

    // Create application
    const application = new Application({
      ...applicationData,
      documents: documents
    });

    await application.save();
    console.log('Application saved with ID:', application._id);

    res.json({ 
      success: true, 
      message: 'Application submitted successfully',
      applicationId: application._id 
    });

  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit application' });
  }
};

// Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    console.log('Fetched applications:', applications.length);
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
};

// Get single application
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    console.log('Application documents:', application.documents);
    res.json({ success: true, application });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch application' });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update application' });
  }
};

// Delete application
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Delete uploaded files
    if (application.documents && application.documents.length > 0) {
      application.documents.forEach(doc => {
        const filePath = path.join(__dirname, '../uploads', doc.fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ success: false, message: 'Failed to delete application' });
  }
};