// routes/admin.js
import express from "express";
const { verifyJWT } = require('../middleware/auth');
const Vendor = require('../models/Vendor');

const router = express.Router();

// protect all admin routes
router.use(verifyJWT('admin'));

/**
 * GET /api/admin/vendors/pending
 */
router.get('/vendors/pending', async (req, res) => {
  try {
    const list = await Vendor.find({ approved: false }).sort({ createdAt: -1 }).limit(200).lean();
    res.json({ pending: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch pending vendors' });
  }
});

/**
 * POST /api/admin/vendors/:id/approve
 */
router.post('/vendors/:id/approve', async (req, res) => {
  try {
    const v = await Vendor.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!v) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor approved', vendor: v });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to approve vendor' });
  }
});

/**
 * POST /api/admin/vendors/:id/reject
 */
router.post('/vendors/:id/reject', async (req, res) => {
  try {
    const v = await Vendor.findByIdAndDelete(req.params.id);
    if (!v) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor rejected and removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reject vendor' });
  }
});

export default router;
