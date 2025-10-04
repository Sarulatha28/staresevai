const Payment = require('../models/Payment');
const path = require('path');
const fs = require('fs');

// Submit payment
exports.submitPayment = async (req, res) => {
  try {
    console.log('💰 Payment submission request received');
    console.log('📦 Request body:', req.body);
    console.log('📁 Uploaded file:', req.file);

    const { name, mobileNumber } = req.body;
    
    if (!name || !mobileNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and mobile number are required' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment screenshot is required' 
      });
    }

    // Validate file
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      // Delete the uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false, 
        message: 'Only image files (JPEG, PNG, GIF, WEBP) are allowed' 
      });
    }

    const payment = new Payment({
      name: name.trim(),
      mobileNumber: mobileNumber.trim(),
      paymentScreenshot: req.file.filename,
      originalFileName: req.file.originalname
    });

    await payment.save();
    console.log('✅ Payment saved successfully:', payment._id);

    res.json({ 
      success: true, 
      message: 'Payment details submitted successfully',
      payment: payment
    });
  } catch (error) {
    console.error('❌ Error submitting payment:', error);
    
    // Delete uploaded file if error occurred
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (fileError) {
        console.error('Error deleting uploaded file:', fileError);
      }
    }

    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit payment: ' + error.message 
    });
  }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    console.log('📋 Fetching all payments...');
    
    const payments = await Payment.find().sort({ createdAt: -1 });
    
    console.log(`✅ Successfully fetched ${payments.length} payments`);
    
    res.json({ 
      success: true, 
      payments,
      count: payments.length
    });
  } catch (error) {
    console.error('❌ Error fetching payments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch payments',
      error: error.message 
    });
  }
};

// Serve payment image - FIXED VERSION
exports.getPaymentImage = async (req, res) => {
  try {
    const filename = req.params.filename;
    console.log('🔍 Payment image request for filename:', filename);
    
    // Security check - prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }
    
    const imagePath = path.join(__dirname, '../uploads/payments', filename);
    console.log('📁 Looking for image at path:', imagePath);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.log('❌ Payment image not found at path:', imagePath);
      
      // List all files in directory for debugging
      const uploadDir = path.join(__dirname, '../uploads/payments');
      if (fs.existsSync(uploadDir)) {
        const files = fs.readdirSync(uploadDir);
        console.log('📂 Files in uploads/payments directory:', files);
        
        // Check if file exists with different case
        const fileExists = files.some(file => file.toLowerCase() === filename.toLowerCase());
        if (fileExists) {
          console.log('⚠️ File exists but with different case');
        }
      } else {
        console.log('❌ Upload directory does not exist:', uploadDir);
      }
      
      return res.status(404).json({
        success: false,
        message: 'Payment image not found'
      });
    }

    // Get file stats
    const stats = fs.statSync(imagePath);
    console.log('✅ Image found. File size:', stats.size, 'bytes');

    if (stats.size === 0) {
      console.log('⚠️ Image file is empty (0 bytes)');
      return res.status(404).json({
        success: false,
        message: 'Image file is empty'
      });
    }

    // Set appropriate content type
    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };

    const contentType = contentTypes[ext] || 'image/jpeg';
    console.log('📄 Content type set to:', contentType);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    
    console.log('📤 Streaming image file...');
    
    // Stream the file
    const fileStream = fs.createReadStream(imagePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error('❌ Error streaming payment image:', error);
      res.status(500).json({
        success: false,
        message: 'Error serving payment image'
      });
    });

    fileStream.on('end', () => {
      console.log('✅ Image stream completed successfully');
    });

  } catch (error) {
    console.error('❌ Error in getPaymentImage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment image: ' + error.message
    });
  }
};

// Debug endpoint to check file access
exports.testFileAccess = async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads/payments');
    
    if (!fs.existsSync(uploadsDir)) {
      console.log('❌ Uploads directory does not exist, creating...');
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const files = fs.readdirSync(uploadsDir);
    
    console.log('📂 Payment files directory contents:');
    const fileDetails = files.map(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    });
    
    fileDetails.forEach(file => {
      console.log(`- ${file.name} (${file.size} bytes, created: ${file.created})`);
    });
    
    res.json({
      success: true,
      message: 'Directory scan complete',
      files: fileDetails,
      count: files.length,
      directory: uploadsDir
    });
  } catch (error) {
    console.error('❌ Error scanning directory:', error);
    res.status(500).json({
      success: false,
      message: 'Error scanning directory: ' + error.message
    });
  }
};

// Delete payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    // Delete the screenshot file from server
    const filePath = path.join(__dirname, '../uploads/payments', payment.paymentScreenshot);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('🗑️ Deleted payment image:', filePath);
    } else {
      console.log('⚠️ Payment image file not found for deletion:', filePath);
    }

    await Payment.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'Payment record deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting payment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete payment record',
      error: error.message 
    });
  }
};