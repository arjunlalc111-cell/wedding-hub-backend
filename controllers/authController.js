// authController.js (CLEANED AS PER ESLINT)

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Vendor from "../models/vendors.js";
import { sendOtpEmail } from "../utils/emailService.js";
// import crypto from "crypto"; // REMOVE THIS LINE if not used

// JWT config
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
if (!JWT_SECRET) {
  console.warn(
    "Warning: JWT_SECRET is not set in environment. Set JWT_SECRET for auth to work securely."
  );
}

// In-memory map for sign-up OTPs (for production use Redis/DB)
const vendorOtpStore = {};
// In-memory map for password-reset OTPs
const vendorResetOTPStore = {};

/**
 * Helper to sign JWT tokens
 */
function jwtSign(payload) {
  return jwt.sign(payload, JWT_SECRET || "dev-secret", { expiresIn: JWT_EXPIRES_IN });
}

export const vendorSignup = async (req, res) => {
  try {
    const { businessName, ownerName, email, phone, password } = req.body;
    if (!businessName || !ownerName || !email || !phone || !password)
      return res.status(400).json({ message: "All fields required" });

    // Check if vendor already exists
    const exists = await Vendor.findOne({ $or: [{ email }, { phone }] });
    if (exists)
      return res.status(409).json({ message: "Email or phone already registered" });

    const passwordHash = await bcrypt.hash(password, 10);

    const vendor = await Vendor.create({
      businessName,
      ownerName,
      email,
      phone,
      passwordHash,
      isVerified: false,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    vendorOtpStore[vendor._id] = { otp, created: Date.now() };

    return res.status(201).json({
      vendorId: vendor._id,
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
      message: "Signup successful. Please verify OTP sent to email."
    });
  } catch (err) {
    console.error("vendorSignup error", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const vendorSendOtp = async (req, res) => {
  try {
    const { email, otp, vendorId } = req.body;
    let thisOtp = otp;
    if (!thisOtp && vendorId && vendorOtpStore[vendorId]) thisOtp = vendorOtpStore[vendorId].otp;
    if (!email || !thisOtp) return res.status(400).json({ message: "Email & OTP required" });
    await sendOtpEmail(email, thisOtp);
    return res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("vendorSendOtp error", err);
    res.status(500).json({ message: "Cannot send OTP" });
  }
};

export const vendorVerifyOtp = async (req, res) => {
  try {
    const { vendorId, otp } = req.body;
    if (!vendorId || !otp) return res.status(400).json({ message: "vendorId, otp required" });
    const record = vendorOtpStore[vendorId];
    if (!record || record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { isVerified: true },
      { new: true }
    ).lean();
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    delete vendorOtpStore[vendorId];
    return res.json({ message: "Verification successful" });
  } catch (err) {
    console.error("vendorVerifyOtp error", err);
    res.status(500).json({ message: "Verification error" });
  }
};

export const vendorLogin = async (req, res) => {
  try {
    const { phone, password } = req.body || {};
    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required." });
    }

    const vendor = await Vendor.findOne({ phone: phone.trim() }).lean();
    if (!vendor || !vendor.passwordHash) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const match = await bcrypt.compare(password, vendor.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwtSign({ sub: vendor._id, type: "vendor" });

    const vendorSafe = { ...vendor };
    delete vendorSafe.passwordHash;

    return res.json({ token, vendor: vendorSafe });
  } catch (err) {
    console.error("vendorLogin error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const vendorMe = async (req, res) => {
  try {
    const vendorId = req.vendorId;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const vendor = await Vendor.findById(vendorId).lean();
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    if (vendor.passwordHash) delete vendor.passwordHash;
    return res.json({ vendor });
  } catch (err) {
    console.error("vendorMe error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateVendorProfile = async (req, res) => {
  try {
    const vendorId = req.vendorId;
    const { businessName, ownerName, email, phone, profilePhoto } = req.body;
    const update = {};
    if (businessName !== undefined) update.businessName = businessName;
    if (ownerName !== undefined) update.ownerName = ownerName;
    if (email !== undefined) update.email = email;
    if (phone !== undefined) update.phone = phone;
    if (profilePhoto !== undefined) update.profilePhoto = profilePhoto;

    const vendor = await Vendor.findByIdAndUpdate(vendorId, update, { new: true }).lean();
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    if (vendor.passwordHash) delete vendor.passwordHash;
    res.json({ vendor, message: "Profile updated successfully" });
  } catch (err) {
    console.error("updateVendorProfile error", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const vendorForgotPassword = async (req, res) => {
  try {
    const { phone, email } = req.body;
    const vendor = await Vendor.findOne(email ? { email } : { phone });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    vendorResetOTPStore[vendor._id] = { otp, ts: Date.now() };

    await sendOtpEmail(vendor.email, otp);

    res.json({ message: "OTP sent to your email", vendorId: vendor._id });
  } catch {
    res.status(500).json({ message: "Reset OTP error" });
  }
};

export const vendorVerifyResetOTP = async (req, res) => {
  try {
    const { vendorId, otp } = req.body;
    const record = vendorResetOTPStore[vendorId];
    if (!record || record.otp !== otp || Date.now() - record.ts > 10 * 60 * 1000)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    res.json({ message: "OTP valid" });
  } catch {
    res.status(400).json({ message: "OTP error" });
  }
};

export const vendorResetPassword = async (req, res) => {
  try {
    const { vendorId, otp, password } = req.body;
    if (!vendorId || !otp || !password) return res.status(400).json({ message: "Missing fields" });

    const record = vendorResetOTPStore[vendorId];
    if (!record || record.otp !== otp || Date.now() - record.ts > 10 * 60 * 1000)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const hash = await bcrypt.hash(password, 10);
    await Vendor.findByIdAndUpdate(vendorId, { passwordHash: hash });
    delete vendorResetOTPStore[vendorId];
    res.json({ message: "Password reset successful, login now." });
  } catch {
    res.status(500).json({ message: "Password reset failed" });
  }
};

export default {  };
