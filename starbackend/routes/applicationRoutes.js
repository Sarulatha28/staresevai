const express = require('express');
const multer = require('multer');
const path = require('path');

const {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getApplicationsByCANStatus
} = require('../controllers/applicationController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!require('fs').existsSync(uploadDir)) {
      require('fs').mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 400 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'), false);
    }
  }
});

// Routes
router.post('/submit', upload.array('documents'), submitApplication);
router.get('/all', getAllApplications);
router.get('/can/:hasCAN', getApplicationsByCANStatus);
router.get('/:id', getApplicationById);
router.put('/:id/status', updateApplicationStatus);
router.delete('/:id', deleteApplication);

module.exports = router;