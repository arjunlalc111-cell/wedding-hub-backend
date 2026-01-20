// routes/vendorManageRoutes.js
// Vendor update route (PUT /api/vendors/:id)
// Save as routes/vendorManageRoutes.js

import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";
import vendorUpdateController from "../controllers/vendorUpdateController.js";

const router = express.Router();

// ----- __dirname workaround for ESM -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// multer storage (same pattern as earlier)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const safe = (file.originalname || 'file').replace(/[^a-zA-Z0-9_\-\.]/g, '-');
    cb(null, `${Date.now()}-${safe}`);
  }
});
const upload = multer({ storage });

const multiFields = upload.fields([
  { name: 'selfie', maxCount: 1 },
  { name: 'aadhar', maxCount: 1 },
  { name: 'pan', maxCount: 1 },
  { name: 'gst', maxCount: 1 },
  { name: 'media', maxCount: 12 }
]);

// PUT /api/vendors/:id -> vendor update (owner or admin)
// requireAuth will set req.vendorId; admin can act via requireAdmin header or token
router.put('/:id', requireAuth, multiFields, vendorUpdateController.updateVendor);

export default router;