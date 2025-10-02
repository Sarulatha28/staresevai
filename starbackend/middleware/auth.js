const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log("Auth middleware - Token:", token ? "Present" : "Missing");
    
    if (!token) {
      return res.status(401).json({ success: false, message: "No token, access denied" });
    }

    // Extract token from "Bearer <token>"
    const formattedToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    
    console.log("Verifying token...");
    const decoded = jwt.verify(formattedToken, process.env.JWT_SECRET || "fallbacksecret");
    console.log("Decoded token:", decoded);
    
    // Verify admin exists
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin not found" });
    }
    
    req.user = { id: decoded.id };
    console.log("Authentication successful for user:", decoded.id);
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(401).json({ success: false, message: "Token is not valid" });
  }
};

module.exports = auth;