// User controller for Wedding Hub
// Handles: user registration, user profile fetch/update, fav vendors, bookings

import bcrypt from "bcryptjs";
import User from "../models/User.js";
// import Vendor from "../models/vendors.js"; // Removed: ESLint 'no-unused-vars'

/**
 * Register a new user
 */
export async function registerUser(req, res) {
  try {
    const { name, username, email, phone, password } = req.body;
    if (!name || !email || !password || password.length < 6)
      return res.status(400).json({ message: 'Name, email, and password required (min 6 chars).' });

    const exists = await User.findOne({ $or: [{ email }, { username }, { phone }] });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username: username || email,
      email,
      phone,
      passwordHash,
      role: 'user'
    });

    res.status(201).json({ message: 'User registered', userId: user._id });
  } catch (err) {
    console.error('registerUser error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Get user profile
 */
export async function getProfile(req, res) {
  try {
    const userId = req.user ? req.user.id : req.tokenPayload?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).select('-passwordHash').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    console.error('getProfile error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Update user profile
 */
export async function updateProfile(req, res) {
  try {
    const userId = req.user ? req.user.id : req.tokenPayload?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const updateData = req.body;
    delete updateData.role;
    delete updateData.passwordHash;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-passwordHash').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated', user });
  } catch (err) {
    console.error('updateProfile error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Add favorite vendor
 */
export async function addFavoriteVendor(req, res) {
  try {
    const userId = req.user ? req.user.id : req.tokenPayload?.id;
    const vendorId = req.params.vendorId;
    if (!userId || !vendorId) return res.status(400).json({ message: 'UserId and VendorId required.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.favorites) user.favorites = [];
    if (!user.favorites.includes(vendorId)) user.favorites.push(vendorId);

    await user.save();
    res.json({ message: 'Added to favorites', favorites: user.favorites });
  } catch (err) {
    console.error('addFavoriteVendor error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Remove favorite vendor
 */
export async function removeFavoriteVendor(req, res) {
  try {
    const userId = req.user ? req.user.id : req.tokenPayload?.id;
    const vendorId = req.params.vendorId;
    if (!userId || !vendorId) return res.status(400).json({ message: 'UserId and VendorId required.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.favorites = user.favorites.filter(id => id.toString() !== vendorId);
    await user.save();

    res.json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (err) {
    console.error('removeFavoriteVendor error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * List all user's favorite vendors
 */
export async function listFavoriteVendors(req, res) {
  try {
    const userId = req.user ? req.user.id : req.tokenPayload?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).populate('favorites').select('favorites').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error('listFavoriteVendors error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * List user's bookings (future extension)
 */
export async function listBookings(req, res) {
  try {
    const userId = req.user ? req.user.id : req.tokenPayload?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).populate('bookings').select('bookings').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ bookings: user.bookings });
  } catch (err) {
    console.error('listBookings error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Default export for compatibility
export default {
  registerUser,
  getProfile,
  updateProfile,
  addFavoriteVendor,
  removeFavoriteVendor,
  listFavoriteVendors,
  listBookings
};