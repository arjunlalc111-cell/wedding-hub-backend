import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// ESM __dirname fix
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Make sure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "banners");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`);
  }
});
const upload = multer({ storage });

// In-memory banner data (for demo; ideally use DB)
let bannerData = {
  title: "Welcome to Wedding Hub!",
  text: "Book verified wedding vendors easily.",
  img: ""
};

// 1. Admin POST: update banner
router.post("/api/admin/banner", upload.single("bannerFile"), (req, res) => {
  const { bannerTitle, bannerText } = req.body;
  if (bannerTitle) bannerData.title = bannerTitle;
  if (bannerText) bannerData.text = bannerText;
  if (req.file) bannerData.img = `/uploads/banners/${req.file.filename}`;
  res.json({ success: true, banner: bannerData });
});

// 2. GET: fetch current banner (public can use this!)
router.get("/api/admin/banner", (req, res) => {
  res.json(bannerData);
});

export default router;