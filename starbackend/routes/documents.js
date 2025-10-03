// routes/documentRoutes.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Download document
router.get('/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    console.log('Download request for:', filename);
    console.log('File path:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.log('File not found:', filePath);
      return res.status(404).json({ 
        success: false, 
        message: 'File not found' 
      });
    }

    // Get file stats to determine MIME type
    const stats = fs.statSync(filePath);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', stats.size);
    
    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error downloading file' 
      });
    });
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during download' 
    });
  }
});

// View document in browser
router.get('/view/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    console.log('View request for:', filename);
    console.log('File path:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.log('File not found for viewing:', filePath);
      return res.status(404).json({ 
        success: false, 
        message: 'File not found' 
      });
    }

    // Set headers for inline viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    
    // Send the file
    res.sendFile(path.resolve(filePath), (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ 
          success: false, 
          message: 'Error viewing file' 
        });
      }
    });
    
  } catch (error) {
    console.error('View error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during file view' 
    });
  }
});

// Direct file access (fallback)
router.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(path.resolve(filePath));
  } else {
    res.status(404).json({ success: false, message: 'File not found' });
  }
});
// Add this to your documentRoutes.js
router.get('/debug/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);
  
  console.log('Debug file request:', {
    filename,
    filePath,
    exists: fs.existsSync(filePath)
  });
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    res.json({
      success: true,
      filename,
      filePath,
      size: stats.size,
      exists: true
    });
  } else {
    res.json({
      success: false,
      filename,
      filePath,
      exists: false,
      uploadsDir: path.join(__dirname, '../uploads')
    });
  }
});

module.exports = router;