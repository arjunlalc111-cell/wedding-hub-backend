import express from "express";
import upload from "../middleware/upload.js";
import { vendorAuth } from "../middleware/authMiddleware.js"; // Use your auth middleware

const router = express.Router();

/**
 * POST /api/upload/service-img
 * field: "image" (FormData)
 * Auth: vendor only
 * Result: { url: "https://..." }
 */
router.post("/service-img", vendorAuth, upload.single("image"), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "No image uploaded" });
  }
  res.json({ url: req.file.path });
});

/**
 * POST /api/upload/profile-img
 * field: "image" (FormData)
 * Auth: vendor only
 */
router.post("/profile-img", vendorAuth, upload.single("image"), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "No image uploaded" });
  }
  res.json({ url: req.file.path });
});

export default router;
