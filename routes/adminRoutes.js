// backend/routes/adminRoutes.js
import express from "express";
import Vendor from "../models/vendor.js";
import Booking from "../models/Booking.js";
import Enquiry from "../models/Enquiry.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/* Admin → All Vendors */
router.get(
  "/vendors",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    res.json(await Vendor.find());
  }
);

/* Admin → Approve Vendor */
router.patch(
  "/vendor/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const vendor = await Vendor.findById(req.params.id);
    vendor.isApproved = req.body.isApproved;
    await vendor.save();
    res.json({ message: "Vendor updated" });
  }
);

/* Admin → All Bookings */
router.get(
  "/bookings",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    res.json(await Booking.find());
  }
);

/* Admin → All Enquiries */
router.get(
  "/enquiries",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    res.json(await Enquiry.find());
  }
);

export default router;