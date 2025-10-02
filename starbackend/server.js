const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const cron = require("cron");

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL || 'https://staresevaimaiyam.netlify.app'
];

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow mobile apps or curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Allow preflight requests globally
app.options('*', cors());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Models
const Admin = require("./models/Admin");
const Application = require("./models/Application");
const CAN = require("./models/CAN");
const Payment = require("./models/Payment");

// Routes
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/can", require("./routes/canRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/documents", require("./routes/documents"));

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

// Health check
app.get("/", (req, res) => res.send("✅ Admin Backend Running"));
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});
app.get('/api/test-cors', (req, res) => {
  res.json({ success: true, message: 'CORS is working!', origin: req.headers.origin });
});

// Ensure uploads directories exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const paymentsDir = path.join(uploadsDir, 'payments');
if (!fs.existsSync(paymentsDir)) fs.mkdirSync(paymentsDir, { recursive: true });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/patta-system";

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected successfully");

    // ✅ Use imported Admin model directly
    const existingAdmin = await Admin.findOne({ email: "starmobile.siv@gmail.com" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Star@8523", 10);
      await Admin.create({
        companyName: "Star Mobile",
        name: "Deivaraj Jayaram",
        email: "starmobile.siv@gmail.com",
        phone: "9500553553",
        password: hashedPassword
      });
      console.log("✅ Default admin created");
    }
  })
  .catch(err => console.log("MongoDB connection error:", err));

// Auto-delete old records (runs daily at midnight)
const deleteOldRecordsJob = new cron.CronJob('0 0 * * *', async () => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    await Application.deleteMany({ createdAt: { $lt: threeDaysAgo }, status: { $ne: 'approved' } });
    await CAN.deleteMany({ createdAt: { $lt: threeDaysAgo }, status: { $ne: 'approved' } });
    await Payment.deleteMany({ createdAt: { $lt: threeDaysAgo }, status: { $ne: 'approved' } });

    console.log('🗑️ Auto-deletion completed:', new Date().toISOString());
  } catch (error) {
    console.error('Auto-deletion error:', error);
  }
});
deleteOldRecordsJob.start();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
