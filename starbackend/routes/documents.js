const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Download document
// In your document routes
router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);
  
  // Set headers for PDF download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('File download error:', err);
      res.status(404).json({ success: false, message: 'File not found' });
    }
  });
});

router.get('/view/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);
  
  // Set headers for PDF viewing
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('File view error:', err);
      res.status(404).json({ success: false, message: 'File not found' });
    }
  });
});
    
// Get file info
router.get('/info/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    const stats = fs.statSync(filePath);
    const fileSizeInKB = Math.round(stats.size / 1024);
    
    res.json({
      success: true,
      filename: filename,
      size: stats.size,
      sizeKB: fileSizeInKB,
      created: stats.birthtime,
      modified: stats.mtime
    });
  } catch (error) {
    console.error('File info error:', error);
    res.status(500).json({ success: false, message: 'Error getting file info' });
  }
});

module.exports = router;