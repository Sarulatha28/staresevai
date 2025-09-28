const Application = require('../models/Application');
const CAN = require('../models/CAN');

// Submit application
exports.submitApplication = async (req, res) => {
  try {
    const applicationData = JSON.parse(req.body.applicationData);
    const files = req.files;
    const documentTypes = req.body.documentTypes;

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
      documentType: parseInt(documentTypes[index])
    }));

    // Create application
    const application = new Application({
      ...applicationData,
      documents: documents
    });

    await application.save();

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
    res.json({ success: true, applications });
  } catch (error) {
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
    res.json({ success: true, application });
  } catch (error) {
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
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete application' });
  }
};