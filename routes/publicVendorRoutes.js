import express from "express";
import Vendor from "../models/vendors.js"; // <-- plural 'vendors.js'!

const router = express.Router();

/**
 * GET /api/public/vendors
 * Query params:
 *  - service
 *  - city
 *  - search
 */
router.get("/", async (req, res) => {
  try {
    const { service, city, search } = req.query;

    let filter = { approved: true }; // isApproved -> approved (as per your model)

    if (service) {
      filter.service = service;
    }

    if (city) {
      filter.city = city;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // gallery field might be named 'media' in your Vendor model
    const vendors = await Vendor.find(filter).select(
      "name service city media rating"
    );

    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
});

export default router;
