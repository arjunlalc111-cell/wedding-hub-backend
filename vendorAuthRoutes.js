import express from "express";
import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const exist = await Vendor.findOne({ email });
  if (exist) {
    return res.status(400).json({ message: "Vendor already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const vendor = await Vendor.create({
    name,
    email,
    password: hashedPassword
  });

  res.json({ message: "Vendor registered, waiting for approval" });
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const vendor = await Vendor.findOne({ email });
  if (!vendor) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!vendor.isApproved) {
    return res.status(403).json({ message: "Admin approval pending" });
  }

  const match = await bcrypt.compare(password, vendor.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: vendor._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    vendor: {
      id: vendor._id,
      name: vendor.name,
      email: vendor.email
    }
  });
});

export default router;