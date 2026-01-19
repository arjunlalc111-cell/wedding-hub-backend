import express from "express";
import Enquiry from "../models/Enquiry.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const enquiry = new Enquiry(req.body);
  await enquiry.save();
  res.json({ message: "Enquiry sent" });
});

router.get("/vendor/:vendorId", async (req, res) => {
  const list = await Enquiry.find({ vendor: req.params.vendorId });
  res.json(list);
});

export default router;
