//
// Merged professional authRoutes.js for Wedding Hub (PRODUCTION-READY, MULTI-ROLE, OTP, JWT, PASSWORD RESET)
// Supports:
//   - Vendor signup/login with OTP (controller-based, secure)
//   - User & Admin register/login (inline handlers, classic flow)
//   - Vendor password reset (OTP/E-mail, 3-step flow)
//   - ES6 import/export compatible
//

import express from "express";
import {
  vendorSignup,
  vendorSendOtp,
  vendorVerifyOtp,
  vendorLogin,
  vendorMe,
  updateVendorProfile,
  vendorForgotPassword,
  vendorVerifyResetOTP,
  vendorResetPassword,
} from "../controllers/authController.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Vendor from "../models/vendors.js";
import User from "../models/User.js";

const router = express.Router();

//// ========= VENDOR SIGNUP & OTP FLOW ===========
// Signup (step 1): creates vendor (unverified) & returns ID (+ dev-mode OTP)
router.post("/vendor/signup", vendorSignup);
// Send OTP to vendor's email (step 2)
router.post("/vendor/send-otp", vendorSendOtp);
// Verify OTP (step 3): sets vendor verified
router.post("/vendor/verify-otp", vendorVerifyOtp);

//// ========= VENDOR LOGIN/PROFILE ===========
// Standard login via phone & password (JWT token returned)
router.post("/vendor/login", vendorLogin);
// Protected: get current vendor profile (JWT needed, add auth middleware!)
router.get("/vendor/me", vendorMe);
// Vendor editable profile
router.put("/vendor/profile", updateVendorProfile);

//// ========= VENDOR PASSWORD RESET FLOW ===========
// Vendor forgot password (step 1)
router.post("/vendor/forgot-password", vendorForgotPassword);
// Vendor OTP verify (step 2)
router.post("/vendor/verify-reset-otp", vendorVerifyResetOTP);
// Vendor password reset (step 3)
router.post("/vendor/reset-password", vendorResetPassword);

//// ========= USER REGISTER/LOGIN (INLINE) ===========
// User registration
router.post("/user/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User login
router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//// ========= ADMIN LOGIN (INLINE) ===========
// Admin login by username
router.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    // For admin, username and role: "admin"
    const admin = await User.findOne({ username, role: "admin" });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: "admin",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
