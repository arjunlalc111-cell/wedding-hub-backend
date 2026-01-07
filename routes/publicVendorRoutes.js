import express from "express";
import Vendor from "../models/vendor.js";

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

    let filter = { isApproved: true };

    if (service) {
      filter.service = service;
    }

    if (city) {
      filter.city = city;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const vendors = await Vendor.find(filter).select(
      "name service city gallery rating"
    );

    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
});

export default router;