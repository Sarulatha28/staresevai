// controllers/paymentController.js
const Payment = require('../models/Payment');
const path = require('path');
const fs = require('fs');

// Submit payment
exports.submitPayment = async (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', 'https://staresevaimaiyam.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    console.log('Payment submission request received');
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

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
    console.log('Payment saved successfully:', payment._id);

    res.json({ 
      success: true, 
      message: 'Payment details submitted successfully',
      payment: payment
    });
  } catch (error) {
    console.error('Error submitting payment:', error);
    
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
  res.header('Access-Control-Allow-Origin', 'https://staresevaimaiyam.netlify.app');
  
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
};

// Delete payment
exports.deletePayment = async (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://staresevaimaiyam.netlify.app');
  
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    // Delete the screenshot file from server
    const filePath = path.join(__dirname, '../uploads/payments', payment.paymentScreenshot);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Payment.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'Payment record deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ success: false, message: 'Failed to delete payment record' });
  }
};