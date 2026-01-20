import express from "express";
const router = express.Router();
router.post("/", async (req, res) => {
  // save report in DB
  res.json({ success:true });
});
export default router;
