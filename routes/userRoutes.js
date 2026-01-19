// User routes for Wedding Hub
// Register, login, profile mgmt, favorites (add/remove/list), bookings info

import express from "express";
import userController from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- Registration ---
router.post('/register', userController.registerUser);

// --- Profile management (JWT protected) ---
router.get('/me', requireAuth, userController.getProfile);
router.put('/me', requireAuth, userController.updateProfile);

// --- Favorites CRUD (JWT protected) ---
router.post('/favorite/:vendorId', requireAuth, userController.addFavoriteVendor);
router.delete('/favorite/:vendorId', requireAuth, userController.removeFavoriteVendor);
router.get('/favorites', requireAuth, userController.listFavoriteVendors);

// --- Bookings info (future, JWT protected) ---
router.get('/bookings', requireAuth, userController.listBookings);

export default router;