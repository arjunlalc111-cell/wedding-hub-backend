import express from "express";
import Booking from "../models/Booking.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * CUSTOMER → Create booking
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
 */
router.get("/vendor", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      vendor: req.user.id,
    }).populate("user");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * VENDOR → Update booking status
 */
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;