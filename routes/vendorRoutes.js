import express from "express";
import Vendor from "../models/vendor.js";

const router = express.Router();


/*
GET /api/vendors
Query:
?city=
?service=
?sort=latest | price
?page=1
&limit=6
*/

router.get("/", async (req, res) => {
  try {
    const {
      city,
      service,
      sort = "latest",
      page = 1,
      limit = 6
    } = req.query;

    const filter = { isApproved: true };

    if (city) filter.city = city;
    if (service) filter.service = service;

    let query = Vendor.find(filter);

    // SORT
    if (sort === "price") query = query.sort({ price: 1 });
    else query = query.sort({ createdAt: -1 });

    // PAGINATION
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(Number(limit));

    const vendors = await query;
    const total = await Vendor.countDocuments(filter);

    res.json({
      vendors,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    res.status(500).json({ message: "Vendor fetch error" });
  }
});

export default router;