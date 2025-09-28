const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Download document
router.get('/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    console.log('Download request for file:', filename);
    console.log('File path:', filePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('File not found:', filePath);
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    console.log('File stats:', stats);

    // Set appropriate headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', stats.size);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    
    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      res.status(500).json({ success: false, message: 'Error streaming file' });
    });
    
    fileStream.pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ success: false, message: 'Download failed' });
  }
});

// Serve document (view in browser)
router.get('/view/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.webp': 'image/webp'
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    
    // For images and PDFs, allow viewing in browser
    if (contentType.startsWith('image/') || contentType === 'application/pdf') {
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    } else {
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    }

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('View file error:', error);
    res.status(500).json({ success: false, message: 'Error viewing file' });
  }
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