// controllers/paymentController.js
const Payment = require('../models/Payment');
const path = require('path');
const fs = require('fs');

// Submit payment



// controllers/paymentController.js - Add logging
exports.submitPayment = async (req, res) => {
  try {
    console.log('Payment submission started:', req.body);
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

    // Log file details
    console.log('File details:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path,
      size: req.file.size
    });

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
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit payment' 
    });
  }
};
exports.submitPayment = async (req, res) => {
  try {
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

    const payment = new Payment({
      name: name.trim(),
      mobileNumber: mobileNumber.trim(),
      paymentScreenshot: req.file.filename,
      originalFileName: req.file.originalname
    });

    await payment.save();

    res.json({ 
      success: true, 
      message: 'Payment details submitted successfully',
      payment: payment
    });
  } catch (error) {
    console.error('Error submitting payment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit payment' 
    });
  }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
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
    }

    await Payment.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'Payment record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete payment record' });
  }
};