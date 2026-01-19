import express from "express";
import Booking from "../models/Booking.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/* Admin – View all bookings */
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

/* Admin – Update booking status */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(booking);
});

export default router;
