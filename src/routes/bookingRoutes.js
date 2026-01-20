//
// Merged bookingRoutes.js for Wedding Hub
// Supports: customer create booking, vendor view bookings, vendor update status
// All routes protected by authMiddleware (JWT)
//

import express from "express";
import Booking from "../models/Booking.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * CUSTOMER → Create booking
 * POST /api/bookings
 * body: { vendorId, service }
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.create({
      user: req.user.id,
      vendor: req.body.vendorId,
      service: req.body.service,
      status: "pending",
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * VENDOR → View own bookings
 * GET /api/bookings/vendor
 */
router.get("/vendor", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      vendor: req.user.id,
    }).populate("user service");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * VENDOR → Update booking status (approve/reject/cancel/complete)
 * PUT /api/bookings/:id/status
 * body: { status }
 */
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const allowed = ["pending", "approved", "rejected", "cancelled", "completed"];
    const newStatus = req.body.status;
    if (!allowed.includes(newStatus)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: newStatus },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: "Booking not found." });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
