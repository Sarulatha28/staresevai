const CAN = require('../models/CAN');

// Create new CAN record
exports.createCAN = async (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  try {
    const { name, canNumber } = req.body;

    // Validate input
    if (!name || !canNumber) {
      return res.status(400).json({
        success: false,
        message: 'Name and CAN number are required'
      });
    }

    // Check if CAN number already exists
    const existingCAN = await CAN.findOne({ canNumber });
    if (existingCAN) {
      return res.status(400).json({
        success: false,
        message: 'CAN number already exists'
      });
    }

    // Create new CAN record
    const newCAN = new CAN({
      name,
      canNumber
    });

    await newCAN.save();

    res.status(201).json({
      success: true,
      message: 'CAN record created successfully',
      canRecord: newCAN
    });

  } catch (error) {
    console.error('Error creating CAN record:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating CAN record',
      error: error.message
    });
  }
};

// Get all CAN records
exports.getAllCAN = async (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  try {
    console.log('Fetching all CAN records...');
    
    const canRecords = await CAN.find().sort({ createdAt: -1 });
    
    console.log(`Successfully fetched ${canRecords.length} CAN records`);
    
    res.json({
      success: true,
      canRecords,
      count: canRecords.length
    });
  } catch (error) {
    console.error('Error fetching CAN records:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching CAN records',
      error: error.message
    });
  }
};

// Delete CAN record
exports.deleteCAN = async (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  try {
    const { id } = req.params;

    const deletedCAN = await CAN.findByIdAndDelete(id);
    
    if (!deletedCAN) {
      return res.status(404).json({
        success: false,
        message: 'CAN record not found'
      });
    }

    res.json({
      success: true,
      message: 'CAN record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting CAN record:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting CAN record',
      error: error.message
    });
  }
};