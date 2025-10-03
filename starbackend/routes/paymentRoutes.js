// routes/paymentRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  submitPayment,
  getAllPayments,
  deletePayment
} = require('../controllers/paymentController');

const router = express.Router();

// Configure multer for file uploads
// routes/paymentRoutes.js - Enhanced multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/payments/');
    
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, 'payment-' + uniqueSuffix + fileExtension);
  }
});

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Routes
router.post('/submit', upload.single('paymentFile'), submitPayment);
router.get('/all', getAllPayments);
router.delete('/:id', deletePayment);
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));


module.exports = router;