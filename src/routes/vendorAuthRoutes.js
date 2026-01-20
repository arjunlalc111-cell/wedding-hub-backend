import express from "express";
import Vendor from "../models/vendors.js"; // ✅ Correct plural & lowercase!
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await Vendor.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Vendor already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await Vendor.create({
      name,
      email,
      passwordHash
    });

    res.json({ message: "Vendor registered, waiting for approval" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!vendor.approved) {
      return res.status(403).json({ message: "Admin approval pending" });
    }

    const match = await bcrypt.compare(password, vendor.passwordHash);
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
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;
