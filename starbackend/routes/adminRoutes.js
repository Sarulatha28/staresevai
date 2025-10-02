const express = require("express");
const { 
  signin, 
  getAdminProfile, 
  updateAdmin, 
  verifyPassword 
} = require("../controllers/adminController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/signin", signin);
router.get("/profile", auth, getAdminProfile);
router.post("/verify-password", auth, verifyPassword);
router.put("/update", auth, updateAdmin);

module.exports = router;