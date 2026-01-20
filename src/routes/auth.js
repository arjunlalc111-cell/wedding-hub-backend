// Auth routes for vendors. Save as routes/auth.js

import express from "express";
const jwt = require('jsonwebtoken');
const router = express.Router();
const authController = require('../controllers/authController');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

/**
 * Middleware: requireAuth
 */
function requireAuth(req, res, next) {
  const auth = (req.headers.authorization || '').trim();
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization required' });
  }
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.sub) return res.status(401).json({ message: 'Invalid token' });
    req.vendorId = decoded.sub;
    req.tokenPayload = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/**
 * Public routes
 */
router.post('/vendor/login', async (req, res, next) => {
  try {
    await authController.vendorLogin(req, res);
  } catch (err) {
    next(err);
  }
});

/**
 * Protected routes
 */
router.get('/vendor/me', requireAuth, async (req, res, next) => {
  try {
    await authController.vendorMe(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
