import express from "express";
import Banner from "../models/Banner.js";
const router = express.Router();
router.post("/", async (req, res) => {
  const { image, link, title } = req.body;
  await Banner.create({ image, link, title });
  res.json({ success:true });
});
router.get("/", async (req, res) => {
  const banners = await Banner.find();
  res.json(banners);
});
export default router;
