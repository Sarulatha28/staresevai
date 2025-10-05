const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin Signin
// Admin Signin with detailed logging
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Signin attempt:', { email, password: password ? '***' : 'missing' });
  
  try {
    // Check if email and password are provided
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    const admin = await Admin.findOne({ email });
    console.log('📋 Admin found:', admin ? 'Yes' : 'No');
    
    if (!admin) {
      console.log('❌ No admin found with email:', email);
      return res.status(400).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    console.log('🔑 Comparing passwords...');
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('❌ Password does not match');
      return res.status(400).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || "fallbacksecret", { expiresIn: "1d" });
    
    console.log('✅ Login successful for:', email);
    
    res.json({ 
      success: true, 
      token, 
      admin: { 
        companyName: admin.companyName, 
        name: admin.name, 
        email: admin.email, 
        phone: admin.phone 
      } 
    });
  } catch (err) {
    console.error('💥 Signin error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Get profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
    res.json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Verify password for edit
exports.verifyPassword = async (req, res) => {
  try {
    const { currentPassword } = req.body;
    console.log("Password verification request for user:", req.user.id);
    
    const admin = await Admin.findById(req.user.id);
    
    if (!admin) {
      console.log("Admin not found");
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    console.log("Comparing passwords...");
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    console.log("Password verified successfully");
    res.json({ success: true, message: "Password verified" });
  } catch (err) {
    console.error("Password verification error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update profile
exports.updateAdmin = async (req, res) => {
  try {
    const { companyName, name, email, phone, currentPassword, newPassword } = req.body;
    console.log("Update request for user:", req.user.id);
    
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

    // Verify current password
    console.log("Verifying current password...");
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid current password" });

    // Update fields
    admin.companyName = companyName || admin.companyName;
    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.phone = phone || admin.phone;

    // Update password if provided
    if (newPassword && newPassword.trim() !== "") {
      console.log("Updating password...");
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(newPassword, salt);
    }

    await admin.save();
    console.log("Admin updated successfully");
    
    res.json({ 
      success: true, 
      admin: { 
        companyName: admin.companyName, 
        name: admin.name, 
        email: admin.email, 
        phone: admin.phone 
      } 
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};