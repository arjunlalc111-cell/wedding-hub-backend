// Merged professional vendorRoutes.js for Wedding Hub
// Covers: registration (multipart), search/list, single vendor fetch, profile edit, approval, dashboard
// Includes multer for uploads, calls to vendorController logic
//

import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// controllers
import vendorController from "../controllers/vendorController.js";

// Auth middleware (ESM import, .js extension dalo)
import { requireAuth, requireAdmin, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// --------- ESM-compatible __dirname workaround ---------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----- Multer Config -----
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const safe = file.originalname ? file.originalname.replace(/[^a-zA-Z0-9_\-\.]/g, '-') : 'file';
    cb(null, `${Date.now()}-${safe}`);
  }
});
const upload = multer({ storage });

// Accept fields: selfie (1), aadhar (1), pan (1), gst (1), media (max 12)
const multiFields = upload.fields([
  { name: 'selfie', maxCount: 1 },
  { name: 'aadhar', maxCount: 1 },
  { name: 'pan', maxCount: 1 },
  { name: 'gst', maxCount: 1 },
  { name: 'media', maxCount: 12 }
]);

// ------ ROUTES ------

// Create vendor (multipart: signup/register)
router.post('/', multiFields, vendorController.createVendor);

// List / search vendors (public: can use query for city/service etc.)
router.get('/', vendorController.getVendors);

// Get vendor by ID
router.get('/:id', vendorController.getVendorById);

// ----- Dashboard/Profile Management (Protected: vendor role) -----

// Get current vendor profile (JWT required)
router.get('/me/profile', requireAuth, requireRole('vendor'), vendorController.getProfile);

// Update current vendor profile (edit info/docs/media)
router.put('/me/profile', requireAuth, requireRole('vendor'), multiFields, vendorController.updateProfile);

// Admin: Approve/reject vendor
router.put('/:id/approve', requireAuth, requireRole('admin'), vendorController.approveVendor);
router.put('/:id/reject', requireAuth, requireRole('admin'), vendorController.rejectVendor);

// List vendors (admin dashboard, all/pending etc.)
router.get('/admin/list', requireAuth, requireRole('admin'), vendorController.adminListVendors);

export default router;
