// WeddingHub Main Express App (PRODUCTION-READY, ES MODULE SYNTAX)

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

// --- Route imports (all must use ES module exports: module.exports = router;) ---
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
// ... add other routes as needed

// 🟢 ADD THIS LINE for banner API:
import adminBannerRoutes from "./routes/adminBannerRoutes.js";

import { errorHandler } from "./middleware/errorMiddleware.js";

// ---- Dir setup for ES modules ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Config
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",").map(s => s.trim());

// --- Middleware ---
app.set("trust proxy", 1);
app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// --- Rate limiting ---
app.use("/api/", rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
}));

// --- CORS ---
app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error("CORS policy: This origin is not allowed."), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// --- Static uploads dir (public) ---
const uploadsDir = path.join(__dirname, process.env.UPLOAD_DIR || "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// --- Health endpoint ---
app.get("/api/health", (req, res) => res.json({ status: "ok", env: process.env.NODE_ENV || "development" }));

// --- Mount routes (all must export: export default router) ---
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/vendors", vendorManageRoutes); // PUT /api/vendors/:id etc.
app.use("/api/admin", adminRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/public/vendors", publicVendorRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/notifications", notificationRoutes);

// 🟢 ADD THIS LINE just below your main routes (order doesn't matter much, but ideally after your admin/user/vendor routes):
app.use(adminBannerRoutes);

// --- API welcome page ---
app.get("/", (req, res) =>
  res.send("WeddingHub API is live & production ready!")
);

// --- 404 Handler ---
app.use((req, res) =>
  res.status(404).json({ message: "Route Not Found" })
);

// --- Error handler ---
app.use(errorHandler);
app.use((err, req, res, next) => {
  console.error("UNCAUGHT ERROR:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// --- MongoDB init and server start ---
async function start() {
  try {
    if (!MONGO_URI) {
      console.warn('Warning: MONGO_URI not set. The server will still start but DB operations will fail.');
    } else {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ MongoDB Connected");
    }
    app.listen(PORT, () => {
      console.log(`🚀 WeddingHub API running at http://localhost:${PORT} (env=${process.env.NODE_ENV || "development"})`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down...');
  mongoose.disconnect().finally(() => process.exit(0));
});
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  mongoose.disconnect().finally(() => process.exit(0));
});

process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
});

start();