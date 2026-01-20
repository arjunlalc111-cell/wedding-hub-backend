// Merged adminController.js for Wedding Hub (PRODUCTION-READY)
// Handles: list users/vendors/bookings, platform stats, vendor approval/reject
// ES Modules syntax, robust error handling.

import Vendor from "../models/vendors.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";

// ======= Vendor Approval Operations ======= //

/**
 * List all vendors with pending approval (approved: false, rejected: false)
 */
export const listPending = async (req, res) => {
  try {
    const pending = await Vendor.find({ approved: false, rejected: false })
      .sort({ createdAt: -1 })
      .lean();
    return res.json(pending);
  } catch (err) {
    console.error('listPending error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Approve a vendor (set approved: true, rejected: false)
 * Route: POST /admin/vendors/:id/approve
 */
export const approveVendor = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: 'Vendor id required' });

    const v = await Vendor.findByIdAndUpdate(
      id,
      { approved: true, rejected: false, rejectedReason: null },
      { new: true }
    ).lean();

    if (!v) return res.status(404).json({ message: 'Vendor not found' });

    return res.json({ message: 'Vendor approved', vendor: v });
  } catch (err) {
    console.error('approveVendor error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Reject a vendor (set rejected: true, approved: false, save reason)
 * Route: POST /admin/vendors/:id/reject   { reason }
 */
export const rejectVendor = async (req, res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body || {};

    if (!id) return res.status(400).json({ message: 'Vendor id required' });

    const v = await Vendor.findByIdAndUpdate(
      id,
      { approved: false, rejected: true, rejectedReason: reason || 'Rejected by admin' },
      { new: true }
    ).lean();

    if (!v) return res.status(404).json({ message: 'Vendor not found' });

    return res.json({ message: 'Vendor rejected', vendor: v });
  } catch (err) {
    console.error('rejectVendor error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// =========== GENERAL ADMIN DATA OPS ============= //

/**
 * List all vendors (exclude passwordHash)
 */
export const listVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({}).select("-passwordHash").sort({ createdAt: -1 }).lean();
    res.json(vendors);
  } catch (err) {
    console.error("listVendors error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * List all users (exclude passwordHash)
 */
export const listUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-passwordHash").sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (err) {
    console.error("listUsers error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * List all bookings
 */
export const listBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();
    res.json(bookings);
  } catch (err) {
    console.error("listBookings error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Platform stats (users, vendors, bookings count)
 */
export const platformStats = async (req, res) => {
  try {
    const [users, vendors, bookings] = await Promise.all([
      User.countDocuments(), Vendor.countDocuments(), Booking.countDocuments()
    ]);
    res.json({ users, vendors, bookings });
  } catch (err) {
    console.error("platformStats error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {  };
