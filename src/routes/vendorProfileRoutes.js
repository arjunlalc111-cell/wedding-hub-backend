import express from "express";
import Vendor from "../models/vendors.js"; // ✅ Plural and lowercase!
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/vendors");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* ================= GET VENDOR PROFILE ================= */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.id).lean();
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: "Profile fetch error" });
  }
});

/* ================= UPDATE PROFILE ================= */
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const updated = await Vendor.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).lean();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
});

/* ================= UPLOAD GALLERY IMAGE ================= */
router.post(
  "/gallery",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const vendor = await Vendor.findById(req.user.id);

      // Vendor model ke hisab se "media" array ka use
      if (!vendor.media) vendor.media = [];

      vendor.media.push({
        url: `/uploads/vendors/${req.file.filename}`, // Your Vendor model expects 'url' field
        label: req.file.originalname,
        uploadedAt: new Date()
      });

      await vendor.save();
      res.json(vendor.media);
    } catch (err) {
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

export default router;
