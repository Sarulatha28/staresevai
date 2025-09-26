const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin Signup
exports.signupAdmin = async (req, res) => {
  console.log("Request body:", req.body);

  if (!req.body) {
    return res.status(400).json({ message: "No data provided" });
  }

  const { companyName, adminId, name, email, phone, password } = req.body;

  try {
    // Check if admin exists by email or adminId
    const existingAdmin = await Admin.findOne({ 
      $or: [{ email }, { adminId }] 
    });
    
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
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
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// Admin Signin (FIXED)
exports.signinAdmin = async (req, res) => {
  console.log("Signin request body:", req.body);

  const { login, password } = req.body;

  try {
    // Find admin by email or adminId
    const admin = await Admin.findOne({
      $or: [{ email: login }, { adminId: login }]
    });
    
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.status(200).json({ 
      message: "Signin successful", 
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        companyName: admin.companyName
      }
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};