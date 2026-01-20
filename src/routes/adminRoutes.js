//
// Merged adminRoutes.js for Wedding Hub (ES6, PRODUCTION-READY)
// Admin can:
//   - List all users, vendors, bookings, platform stats
//   - List pending vendors
//   - Approve/reject vendor (with reason)
// ALL routes protected with requireAdmin middleware
//

import express from "express";
import {
  listVendors,
  listUsers,
  listBookings,
  platformStats,
  listPending,
  approveVendor,
  rejectVendor
} from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All APIs require admin JWT or X-Admin-Secret
router.use(requireAdmin);

// General listings
router.get("/vendors", listVendors);
router.get("/users", listUsers);
router.get("/bookings", listBookings);
router.get("/stats", platformStats);

// Vendor approval/rejection
router.get("/vendors/pending", listPending);
router.post("/vendors/:id/approve", approveVendor);
router.post("/vendors/:id/reject", rejectVendor);

export default router;
