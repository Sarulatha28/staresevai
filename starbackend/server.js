const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Simple CORS configuration - ALLOW ALL ORIGINS FOR NOW
app.use(cors({
  origin: "*", // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/payments', express.static(path.join(__dirname, 'uploads', 'payments')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/staresevai';

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test CORS endpoint - SIMPLIFIED
app.get('/api/test-cors', (req, res) => {
  try {
    res.json({ 
      success: true, 
      message: 'CORS is working!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test CORS error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// API Routes
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/can', require('./routes/canRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/documents', require('./routes/documents'));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Star eSevai Backend API',
    version: '1.0.0',
    endpoints: {
      applications: '/api/applications',
      can: '/api/can',
      payments: '/api/payments',
      documents: '/api/documents'
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  
  // Ensure CORS headers are set even on errors
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  if (error.message.includes('CORS')) {
    return res.status(403).json({ 
      error: 'CORS Error', 
      message: error.message
    });
  }
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  // Set CORS headers for 404 responses too
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});

module.exports = app;