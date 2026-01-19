<<<<<<< HEAD
// WeddingHub Main Express App (PRODUCTION-READY, ES MODULE SYNTAX)

=======
>>>>>>> d5bbcaa8a7565b969665e0975b743e289f5b4c45
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
<<<<<<< HEAD
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";
=======
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import path from "path";
>>>>>>> d5bbcaa8a7565b969665e0975b743e289f5b4c45
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

<<<<<<< HEAD
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
=======
import { errorHandler } from "./middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Basic security + parsers
app.set("trust proxy", 1);
app.use(helmet());

const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX || "120", 10),
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ MONGO_URI is not set in environment. Exiting.");
  process.exit(1);
}
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ DB Error", err);
    process.exit(1);
  });

// Serve uploads (local) - ensure your upload middleware writes into /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true, time: Date.now() }));

// Register routes (order matters if you have overlapping paths)
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/public/vendors", publicVendorRoutes);
app.use("/api/vendor/profile", vendorProfileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/notifications", notificationRoutes);

// Error handler (should be after routes)
app.use(errorHandler);

// Global handlers for unexpected errors
process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at: Promise ", p, "reason:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
  // Decide whether to exit in production
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
>>>>>>> d5bbcaa8a7565b969665e0975b743e289f5b4c45
