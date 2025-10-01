// middlewares/authMiddleware.js
const authMiddleware = (req, res, next) => {
  // Simple token verification (replace with your actual auth logic)
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No token provided' 
    });
  }

  // Verify token (simplified - replace with JWT verification)
  if (!token.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token format' 
    });
  }

  // For development, you might want to skip actual verification
  console.log('Token received:', token);
  next();
};

module.exports = authMiddleware;