//
// reviewController.js for Wedding Hub
// Create, list by vendor/service, delete review
//

import Review from "../models/Review.js";

/**
 * Create new review
 * POST /api/reviews
 * body: { vendor, user, rating, comment }
 */
export async function createReview(req, res) {
  try {
    const { vendor, user, rating, comment } = req.body;
    if (!vendor || !user || !rating)
      return res.status(400).json({ message: "vendor, user, rating required" });
    if (rating < 1 || rating > 5)
      return res.status(400).json({ message: "Rating should be between 1 and 5" });

    // Prevent duplicate review by same user for same vendor
    const existing = await Review.findOne({ vendor, user });
    if (existing)
      return res.status(400).json({ message: "You have already reviewed this vendor." });

    const review = await Review.create({ vendor, user, rating, comment });
    res.status(201).json({ review, message: "Review submitted" });
  } catch (err) {
    console.error("createReview error", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * List reviews for a vendor
 * GET /api/reviews/vendor/:vendorId
 */
export async function listVendorReviews(req, res) {
  try {
    const vendorId = req.params.vendorId;
    if (!vendorId) return res.status(400).json({ message: "VendorId required" });

    const reviews = await Review.find({ vendor: vendorId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(reviews);
  } catch (err) {
    console.error("listVendorReviews error", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Delete a review (by review id)
 * DELETE /api/reviews/:id (optional: check user)
 */
export async function deleteReview(req, res) {
  try {
    const id = req.params.id;
    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error("deleteReview error", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default {  };
