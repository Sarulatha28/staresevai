const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin Signup
exports.signupAdmin = async (req, res) => {
  console.log("Signup Request body:", req.body);

  if (!req.body) {
    return res.status(400).json({ success: false, message: "No data provided" });
  }

  const { companyName, adminId, name, email, phone, password } = req.body;

  // Validation
  if (!companyName || !adminId || !name || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if admin exists by email or adminId
    const existingAdmin = await Admin.findOne({ 
      $or: [{ email }, { adminId }] 
    });
    
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists with this email or ID" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({
      companyName,
      adminId,
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({ 
      success: true, 
      message: "Admin registered successfully" 
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
};

// Admin Signin
exports.signinAdmin = async (req, res) => {
  console.log("Signin request body:", req.body);

  const { login, password } = req.body;

  // Validation
  if (!login || !password) {
    return res.status(400).json({ success: false, message: "Login and password are required" });
  }

  try {
    // Find admin by email or adminId
    const admin = await Admin.findOne({
      $or: [{ email: login }, { adminId: login }]
    });
    
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        email: admin.email,
        adminId: admin.adminId 
      }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: "24h" }
    );

    res.status(200).json({ 
      success: true,
      message: "Signin successful", 
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        companyName: admin.companyName,
        adminId: admin.adminId
      }
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
};