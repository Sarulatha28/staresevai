const Application = require('../models/Application');
const CAN = require('../models/CAN');
const fs = require('fs');
const path = require('path');

// Submit application with enhanced file handling
exports.submitApplication = async (req, res) => {
  let uploadedFiles = [];
  
  try {
    console.log('=== START SUBMISSION DEBUG ===');
    console.log('Request headers:', req.headers);
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Files received:', req.files ? req.files.length : 0);
    
    // Log all body fields
    for (const [key, value] of Object.entries(req.body)) {
      console.log(`Body field ${key}:`, typeof value, value ? value.substring(0, 100) : 'empty');
    }

    // Check if applicationData exists
    if (!req.body.applicationData) {
      console.log('ERROR: applicationData is missing');
      return res.status(400).json({ 
        success: false, 
        message: 'applicationData is required' 
      });
    }

    let applicationData;
    try {
      applicationData = JSON.parse(req.body.applicationData);
      console.log('Successfully parsed applicationData');
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      console.log('Raw applicationData that failed:', req.body.applicationData);
      
      // Try to see if it's already an object
      if (typeof req.body.applicationData === 'object') {
        console.log('Using applicationData as object directly');
        applicationData = req.body.applicationData;
      } else {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid JSON in applicationData' 
        });
      }
    }

    const files = req.files || [];
    uploadedFiles = files;
    console.log('Processing', files.length, 'files');

    // Handle document types
    let documentTypes = [];
    if (req.body.documentTypes) {
      try {
        documentTypes = JSON.parse(req.body.documentTypes);
        console.log('Parsed document types:', documentTypes);
      } catch (error) {
        console.warn('Invalid documentTypes format, using empty array');
        documentTypes = [];
      }
    }

    console.log('Document types array length:', documentTypes.length);
    console.log('Files array length:', files.length);

    // Validate file sizes
    for (const file of files) {
      if (file.size > 400 * 1024) {
        files.forEach(f => {
          try {
            fs.unlinkSync(f.path);
          } catch (error) {
            console.error('Error deleting file:', error);
          }
        });
        return res.status(400).json({ 
          success: false, 
          message: `File ${file.originalname} exceeds 400KB size limit` 
        });
      }
    }

    // Handle CAN submission
    if (applicationData.hasCAN && applicationData.canNumber) {
      try {
        const canRecord = new CAN({
          name: applicationData.name,
          canNumber: applicationData.canNumber
        });
        await canRecord.save();
        console.log('CAN record saved');
      } catch (canError) {
        console.error('Error saving CAN record:', canError);
      }
    }

    // Prepare documents array
    const documents = files.map((file, index) => {
      const docType = documentTypes[index] || 0;
      console.log(`File ${index}: ${file.originalname}, Type: ${docType}`);
      return {
        fileName: file.filename,
        originalName: file.originalname,
        documentType: docType,
        uploadDate: new Date(),
        fileSize: file.size
      };
    });

    console.log('Final documents array:', documents);

    // Create and save application
    const application = new Application({
      ...applicationData,
      documents: documents
    });

    await application.save();
    console.log('Application saved successfully with ID:', application._id);

    res.json({ 
      success: true, 
      message: 'Application submitted successfully',
      applicationId: application._id 
    });

  } catch (error) {
    console.error('FINAL CATCH ERROR:', error);
    console.error('Error stack:', error.stack);
    
    // Clean up files
    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach(file => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log('Cleaned up file:', file.filename);
          }
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit application',
      error: error.message 
    });
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

// Update application status - FIXED VERSION
// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('Updating application status:', { id, status });

    // Validate status
    const validStatuses = ['pending', 'completed', 'in review', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    // Find and update application
    const application = await Application.findByIdAndUpdate(
      id,
      { 
        status: status,
        updatedAt: new Date() 
      },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      });
    }

    console.log('Application status updated successfully:', application._id);
    
    res.json({ 
      success: true, 
      message: 'Application status updated successfully',
      application 
    });

  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update application status',
      error: error.message 
    });
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