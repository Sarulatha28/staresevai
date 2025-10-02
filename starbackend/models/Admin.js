const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  phone:       { type: String, required: true },
  password:    { type: String, required: true }
}, { timestamps: true });

// ✅ This is the ONLY correct export
module.exports = mongoose.model("Admin", adminSchema);
