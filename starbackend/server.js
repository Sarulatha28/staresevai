const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors());

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d',
  etag: true
}));

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

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});
const Admin = require('./models/Admin');
// ✅ IMPORT ALL ROUTES
const applicationRoutes = require('./routes/applicationRoutes');
const canRoutes = require('./routes/canRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const documentRoutes = require('./routes/documents');
const adminRoutes = require('./routes/adminRoutes'); // Make sure this path is correct

// ✅ REGISTER ALL ROUTES
app.use('/api/applications', applicationRoutes);
app.use('/api/can', canRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/admin', adminRoutes); // This enables /api/admin/signin


// Create default admin if none exists
// Create default admin if none exists
const createDefaultAdmin = async () => {
  try {
    const Admin = require('./models/Admin');
    const bcrypt = require('bcryptjs');
    
    const existingAdmin = await Admin.findOne({ email: 'starmobile.siv@gmail.com' });
    
    if (!existingAdmin) {
      // Set your desired initial password here
      const initialPassword = "star8523"; // Change this to your desired password
      const hashedPassword = await bcrypt.hash(initialPassword, 10);
      
      const defaultAdmin = new Admin({
        companyName: 'Star esevai',
        name: 'Deivaraj Jayaram',
        email: 'starmobile.siv@gmail.com',
        phone: '9500553553',
        password: hashedPassword
      });
      
      await defaultAdmin.save();
      console.log('✅ Default admin account created');
      console.log('📧 Email: starmobile.siv@gmail.com');
      console.log('🔑 Password: yourpassword123'); // This will show the actual password
      console.log('💡 You can change this password later in the edit profile section');
    } else {
      console.log('✅ Admin account already exists');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Call this after MongoDB connection
mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('MongoDB connected successfully');
  createDefaultAdmin(); // Add this line
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});



// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Star eSevai Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      test: '/api/test',
      applications: '/api/applications',
      can: '/api/can',
      payments: '/api/payments',
      documents: '/api/documents',
      admin: '/api/admin'
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/test',
      'POST /api/admin/signin',
      'GET /api/admin/profile',
      'POST /api/admin/verify-password',
      'PUT /api/admin/update'
    ]
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Admin endpoints available at: http://localhost:${PORT}/api/admin`);
});






// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = app;