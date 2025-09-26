const express = require("express");
const { signupAdmin, signinAdmin } = require("../controllers/adminController");

const router = express.Router();

router.post("/signup", signupAdmin);
router.post("/signin", signinAdmin);

module.exports = router;