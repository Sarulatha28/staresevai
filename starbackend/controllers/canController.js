const CAN = require('../models/CAN');

// Create new CAN record
const createCAN = async (req, res) => {
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
      message: 'Server error creating CAN record'
    });
  }
};

// Get all CAN records
const getAllCAN = async (req, res) => {
  try {
    const canRecords = await CAN.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      canRecords
    });
  } catch (error) {
    console.error('Error fetching CAN records:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching CAN records'
    });
  }
};

// Delete CAN record
const deleteCAN = async (req, res) => {
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
      message: 'Server error deleting CAN record'
    });
  }
};

module.exports = {
  createCAN,
  getAllCAN,
  deleteCAN
};