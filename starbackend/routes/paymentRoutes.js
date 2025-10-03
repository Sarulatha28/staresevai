// routes/paymentRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const {
  submitPayment,
  getAllPayments,
  deletePayment
} = require('../controllers/paymentController');

const router = express.Router();

// CORS configuration for payment routes
router.use(cors({
  origin: [
    'https://staresevaimaiyam.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/payments/');
    // Create directory if it doesn't exist
    require('fs').mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
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

// Handle preflight requests
router.options('/submit', cors());

// Routes
router.post('/submit', upload.single('paymentFile'), submitPayment);
router.get('/all', getAllPayments);
router.delete('/:id', deletePayment);

module.exports = router;