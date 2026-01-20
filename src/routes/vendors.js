// routes/vendors.js
import express from "express";
const { upload } = require('../middleware/upload');
const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const path = require('path');

const router = express.Router();

/**
 * POST /api/vendors
 * multipart/form-data
 * fields: name, about, services (comma separated), city, lat, lng, phone, email, price, password (optional)
 * files: selfie, aadhar, pan, gst, media (multiple)
 */
router.post('/', upload.fields([
  { name: 'selfie', maxCount: 1 },
  { name: 'aadhar', maxCount: 1 },
  { name: 'pan', maxCount: 1 },
  { name: 'gst', maxCount: 1 },
  { name: 'media', maxCount: 30 }
]), async (req, res) => {
  try {
    const {
      name, about, services, city, lat, lng, phone, email, price, password
    } = req.body;

    if (!name || !phone) return res.status(400).json({ message: 'name and phone are required' });

    // collect uploaded files (local disk)
    const gallery = [];

    const hostBase = `${req.protocol}://${req.get('host')}`;

    // selfie
    if (req.files && req.files.selfie && req.files.selfie[0]) {
      const f = req.files.selfie[0];
      gallery.push(`${hostBase}/${path.relative(process.cwd(), f.path).replace(/\\/g, '/')}`);
    }

    // other media
    if (req.files && req.files.media) {
      for (const f of req.files.media) {
        gallery.push(`${hostBase}/${path.relative(process.cwd(), f.path).replace(/\\/g, '/')}`);
      }
    }

    // docs
    if (req.files && req.files.aadhar && req.files.aadhar[0]) {
      gallery.push(`${hostBase}/${path.relative(process.cwd(), req.files.aadhar[0].path).replace(/\\/g, '/')}`);
    }
    if (req.files && req.files.pan && req.files.pan[0]) {
      gallery.push(`${hostBase}/${path.relative(process.cwd(), req.files.pan[0].path).replace(/\\/g, '/')}`);
    }
    if (req.files && req.files.gst && req.files.gst[0]) {
      gallery.push(`${hostBase}/${path.relative(process.cwd(), req.files.gst[0].path).replace(/\\/g, '/')}`);
    }

    // Prepare vendor doc
    const vendorData = {
      name,
      about,
      services: services ? services.split(',').map(s => s.trim()) : [],
      city,
      locationText: city,
      lat: lat || '',
      lng: lng || '',
      phone,
      email,
      price,
      image: gallery[0] || '',
      gallery,
      approved: process.env.AUTO_APPROVE === 'true'
    };

    // set GeoJSON if lat/lng present
    if (lat && lng) {
      const latf = parseFloat(lat);
      const lngf = parseFloat(lng);
      if (!isNaN(latf) && !isNaN(lngf)) {
        vendorData.location = { type: 'Point', coordinates: [lngf, latf] };
      }
    }

    // password (optional)
    if (password) {
      const salt = await bcrypt.genSalt(10);
      vendorData.passwordHash = await bcrypt.hash(password, salt);
    }

    const vendor = new Vendor(vendorData);
    await vendor.save();

    res.status(201).json({ message: 'Vendor registered', vendorId: vendor._id, approved: vendor.approved });
  } catch (err) {
    console.error('POST /api/vendors error', err);
    res.status(500).json({ message: 'Failed to register vendor' });
  }
});

/**
 * GET /api/vendors
 * query: service, city, lat, lng, radius_km
 */
router.get('/', async (req, res) => {
  try {
    const { service, city, lat, lng, radius_km } = req.query;
    const q = { approved: true }; // only approved vendors visible

    if (service) {
      q.services = { $regex: new RegExp(service, 'i') };
    }
    if (city) {
      q.city = { $regex: new RegExp(city, 'i') };
    }

    // if lat/lng provided, use geoNear
    if (lat && lng) {
      const latf = parseFloat(lat);
      const lngf = parseFloat(lng);
      const radius = parseFloat(radius_km) || parseFloat(process.env.DEFAULT_SEARCH_RADIUS_KM || '100');
      const meters = radius * 1000;

      const results = await Vendor.aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [lngf, latf] },
            distanceField: '__distance',
            maxDistance: meters,
            spherical: true,
            query: q
          }
        },
        { $sort: { __distance: 1, rating: -1 } },
        { $limit: 200 }
      ]);
      return res.json({ vendors: results });
    }

    // fallback: simple find
    const vendors = await Vendor.find(q).sort({ rating: -1 }).limit(200).lean();
    res.json({ vendors });
  } catch (err) {
    console.error('GET /api/vendors error', err);
    res.status(500).json({ message: 'Failed to fetch vendors' });
  }
});

/**
 * GET /api/vendors/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const v = await Vendor.findById(req.params.id).lean();
    if (!v) return res.status(404).json({ message: 'Vendor not found' });
    if (!v.approved && process.env.PUBLIC_UNAPPROVED !== 'true') {
      return res.status(403).json({ message: 'Vendor not public' });
    }
    res.json(v);
  } catch (err) {
    console.error('GET /api/vendors/:id', err);
    res.status(500).json({ message: 'Failed to fetch vendor' });
  }
});

export default router;
