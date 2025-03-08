// server/routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Generate token for phone number
router.post("/token", authController.generateToken);

// Verify token
router.post("/verify", authController.verifyToken);

// Admin login
router.post("/admin/login", authController.adminLogin);

module.exports = router;
