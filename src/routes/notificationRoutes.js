import express from "express";
import notification from "../models/notification.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const notes = await notification.find().sort({ createdAt: -1 });
  res.json(notes);
});

export default router;
