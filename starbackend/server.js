// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require('fs');
const cron = require("cron");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/can", require("./routes/canRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/patta-system";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("MongoDB connection error:", err));

// Ensure uploads directories exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const paymentsDir = path.join(__dirname, 'uploads', 'payments');
if (!fs.existsSync(paymentsDir)) fs.mkdirSync(paymentsDir, { recursive: true });

// Models
const Application = require("./models/Application");
const CAN = require("./models/CAN");
const Payment = require("./models/Payment");

// Auto-delete job (runs daily at midnight)
const deleteOldRecordsJob = new cron.CronJob('0 0 * * *', async () => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Delete applications older than 3 days
    await Application.deleteMany({
      createdAt: { $lt: threeDaysAgo },
      status: { $ne: 'approved' }
    });

    // Delete CAN records older than 3 days
    await CAN.deleteMany({
      createdAt: { $lt: threeDaysAgo },
      status: { $ne: 'approved' }
    });

    // Delete payment records older than 3 days for non-approved applications
    await Payment.deleteMany({
      createdAt: { $lt: threeDaysAgo },
      status: { $ne: 'approved' }
    });

    console.log('Auto-deletion completed:', new Date().toISOString());
  } catch (error) {
    console.error('Auto-deletion error:', error);
  }
});

// Start the cron job
deleteOldRecordsJob.start();

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});