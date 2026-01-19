// app.js - main backend server file (replace your existing app.js with this)
// - Make a backup of your current app.js before replacing.
// - This file mounts all routes we've added and provides basic middleware, security, and DB connection.

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Basic config
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);

// Middlewares
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS setup (allow all if ALLOWED_ORIGINS not set)
if (ALLOWED_ORIGINS.length) {
  app.use(cors({ origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS policy: This origin is not allowed.'), false);
  }}));
} else {
  app.use(cors());
}

// Basic rate limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // limit each IP to 120 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', apiLimiter);

// Serve uploads (public)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' }));

// --- Mount existing routes ---
// Make sure these files exist in your project (we provided earlier):
// routes/vendorRoutes.js        -> POST /api/vendors, GET /api/vendors, GET /api/vendors/:id
// routes/vendorManageRoutes.js  -> PUT /api/vendors/:id (protected)
// routes/auth.js                -> POST /api/auth/vendor/login, GET /api/auth/vendor/me
// routes/adminRoutes.js         -> admin endpoints (requires admin secret or token)
const vendorRoutes = require('./routes/vendorRoutes');              // public vendor create / list / get
const vendorManageRoutes = require('./routes/vendorManageRoutes');  // PUT /api/vendors/:id (owner/admin)
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/vendors', vendorRoutes);
app.use('/api/vendors', vendorManageRoutes); // same base path; PUT route handled here
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
});

// Connect to MongoDB and start server
async function start() {
  try {
    if (!MONGO_URI) {
      console.warn('Warning: MONGO_URI not set. The server will still start but DB operations will fail.');
    } else {
      // Mongoose connect
      await mongoose.connect(MONGO_URI, {
        // these options are no-ops in newer mongoose versions but safe to include
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Connected to MongoDB');
    }

    // Ensure uploads folder exists
    const fs = require('fs');
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Created uploads directory:', uploadsDir);
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} (env=${process.env.NODE_ENV || 'development'})`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

// graceful shutdown
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down...');
  mongoose.disconnect().finally(() => process.exit(0));
});
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  mongoose.disconnect().finally(() => process.exit(0));
});

start();