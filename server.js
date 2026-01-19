// WeddingHub Main Express App (Production Ready - ES Modules)

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { errorHandler } from "./middleware/errorMiddleware.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import vendorManageRoutes from "./routes/vendorManageRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import publicVendorRoutes from "./routes/publicVendorRoutes.js";
import vendorProfileRoutes from "./routes/vendorProfileRoutes.js";
import adminBookingRoutes from "./routes/adminBookingRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminBannerRoutes from "./routes/adminBannerRoutes.js";

// Path setup
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const app = express();

// ENV
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.set("trust proxy", 1);
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiter
app.use(
  "/api/",
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
  })
);

// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Uploads folder
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/vendors", vendorManageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/public/vendors", publicVendorRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use(adminBannerRoutes);

// Root
app.get("/", (req, res) => {
  res.send("WeddingHub API is Live 🚀");
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

// Error handler
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    if (!MONGO_URI) {
      console.warn("⚠️ MONGO_URI not set, DB won't connect.");
    } else {
      await mongoose.connect(MONGO_URI);
      console.log("✅ MongoDB Connected");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed:", err.message);
  }
}

startServer();