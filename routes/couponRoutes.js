import express from "express";
import Coupon from "../models/Coupon.js";
const router = express.Router();
router.post("/apply", async (req, res) => {
  const { code } = req.body;
  const c = await Coupon.findOne({ code });
  if(!c || (c.validTill && new Date() > c.validTill)) return res.json({ success:false });
  res.json({ success:true, discount:c.discount });
});
export default router;
