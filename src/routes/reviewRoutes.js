//
// Merged reviewRoutes.js for Wedding Hub
// Add review, get reviews by vendor
//

import express from "express";
import Review from "../models/Review.js";
const router = express.Router();

/**
 * Add a review
 * POST /api/reviews
 * body: { vendor, user, rating, comment }
 */
router.post("/", async (req, res) => {
  try {
    const rev = await Review.create(req.body);
    res.json(rev);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Get all reviews by vendor
 * GET /api/reviews/:vendorId
 */
router.get("/:vendorId", async (req, res) => {
  try {
    const reviews = await Review.find({ vendor: req.params.vendorId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
