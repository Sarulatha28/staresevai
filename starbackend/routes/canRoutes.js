const express = require('express');

const {
  createCAN,
  getAllCAN,
  deleteCAN
} = require('../controllers/canController');

const router = express.Router();

// Routes
router.post('/create', createCAN);
router.get('/all', getAllCAN);
router.delete('/:id', deleteCAN);

module.exports = router;