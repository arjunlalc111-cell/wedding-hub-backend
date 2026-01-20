//
// Universal ES module image upload middleware for Wedding Hub (local & cloudinary, modern, secure)
// Use: import upload from "../middleware/upload.js";
//

import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === 1. Cloudinary Config (Active for prod uploads, recommended) === //
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// === 2. Cloudinary Storage for Multer === //
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "weddinghub/services", // Use "weddinghub/vendors" for profile images as needed
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

// === 3. Local Disk Storage for fallback/testing/demo === //
const uploadsRoot = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot, { recursive: true });
}
// Local storage: organizes into daily folders
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dateFolder = new Date().toISOString().slice(0, 10);
    const dir = path.join(uploadsRoot, dateFolder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || "";
    cb(null, uniqueName + ext);
  },
});

// === 4. File Filter (shared for both variants) === //
const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "application/pdf"
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpg/png/webp), videos (mp4/webm/ogg) or pdf are allowed"), false);
  }
};

// Choose **Cloudinary storage by default**; local fallback if needed.
// To switch to local disk for dev/demo, change to: localStorage
const useLocal = process.env.UPLOAD_LOCAL === "true"; // Optionally switch via .env

const upload = multer({
  storage: useLocal ? localStorage : cloudinaryStorage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.UPLOAD_MAX_BYTES || String(30 * 1024 * 1024), 10), // default 30MB
    files: parseInt(process.env.UPLOAD_MAX_FILES || "30", 10), // default max files
  },
});

export default upload;
