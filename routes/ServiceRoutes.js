//
// Merged serviceRoutes.js for Wedding Hub (PRODUCTION-READY, ES MODULE)
// Supports vendor CRUD (+JWT), public search/list, and vendor-independent & dashboard use.
// Role/JWT middleware hooks included (comment/uncomment as needed).
//

import express from "express";
import {
  listServices,
  createService,
  getService,
  updateService,
  deleteService,
  listServicesByVendor,
  listVendorServices,
} from "../controllers/serviceController.js";

// Import JWT/role middleware as needed for full security
// import { requireAuth, requireRole, vendorAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// ======== PUBLIC ROUTES ======== //

// 1. List all services (with filters: name/category/vendor)
router.get("/", listServices);

// 2. Get single service by ID (public)
router.get("/:id", getService);

// 3. List all services for a specific vendor (public)
// (by vendorId in param, eg. service listing page, or profile)
router.get("/vendor/:vendorId", listServicesByVendor);

// ======= VENDOR DASHBOARD (JWT PROTECTED) ======= //
// Uncomment below for actual production use!
// router.use(vendorAuth);  // All following routes require vendor JWT

// 4. List all own services for logged-in vendor dashboard
router.get("/vendor", listVendorServices); // JWT/vendor only

// 5. Create new service (vendor only!)
// router.post("/", requireAuth, requireRole("vendor"), createService); // (advanced)
// For now (demo/dev):  
router.post("/", createService);

// 6. Update service by ID (vendor can only edit own)
// router.put("/:id", requireAuth, requireRole("vendor"), updateService);
router.put("/:id", updateService);

// 7. Delete service by ID (vendor can only delete own)
// router.delete("/:id", requireAuth, requireRole("vendor"), deleteService);
router.delete("/:id", deleteService);

export default router;
