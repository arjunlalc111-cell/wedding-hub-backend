import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const notes = await Notification.find().sort({ createdAt: -1 });
  res.json(notes);
});

export default router;