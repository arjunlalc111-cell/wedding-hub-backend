// Updated & merged vendorController.js for Wedding Hub (ESM style)

import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import Vendor from "../models/vendors.js";

const UPLOADS_DIR = path.join(path.resolve(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  try { fs.mkdirSync(UPLOADS_DIR, { recursive: true }); } catch { /* ignore */ }
}

// Helper: safe fetch
let safeFetch = global.fetch;
if (typeof fetch !== "function") {
  try { safeFetch = (await import("node-fetch")).default; } catch { safeFetch = null; }
}

// ------------- All route handlers below ------------------- //

export async function geocodePlace(q) {
  // ...same as your code...
  if (!q || !safeFetch) return null;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
    const res = await safeFetch(url, { headers: { 'User-Agent': 'wedding-hub/1.0 (contact@example.com)' } });
    const arr = await res.json();
    if (Array.isArray(arr) && arr.length) return { lat: arr[0].lat, lon: arr[0].lon };
  } catch (err) { console.warn('Geocode failed', err && err.message ? err.message : err); }
  return null;
}

export const createVendor = async function (req, res) {
  // ...your code...
  try {
    const { body, files } = req;
    const name = (body.name || '').trim();
    const phone = (body.phone || '').trim();
    const email = (body.email || '').trim();
    const service = (body.service || '').trim();
    const city = (body.city || '').trim();
    const about = (body.about || '').trim();
    const password = body.password || '';
    const lat = body.lat || body.latitude || '';
    const lng = body.lng || body.longitude || '';

    if (!name || !phone) return res.status(400).json({ message: 'Name and phone are required.' });

    // files mapping
    const selfieFile = files?.selfie && files.selfie[0];
    const aadharFile = files?.aadhar && files.aadhar[0];
    const panFile = files?.pan && files.pan[0];
    const gstFile = files?.gst && files.gst[0];
    const mediaFiles = files?.media || [];
    if (!selfieFile) return res.status(400).json({ message: 'Selfie file is required.' });
    if (!aadharFile && !panFile) return res.status(400).json({ message: 'Please upload Aadhar or PAN.' });

    const vendorData = {
      name, phone, email, service, city, about,
      selfie: selfieFile ? path.posix.join('uploads', path.basename(selfieFile.path)) : undefined,
      aadhar: aadharFile ? path.posix.join('uploads', path.basename(aadharFile.path)) : undefined,
      pan: panFile ? path.posix.join('uploads', path.basename(panFile.path)) : undefined,
      gst: gstFile ? path.posix.join('uploads', path.basename(gstFile.path)) : undefined,
      media: [],
      approved: (process.env.AUTO_APPROVE === 'true'),
      rejected: false
    };

    if (mediaFiles && mediaFiles.length) {
      for (const m of mediaFiles) {
        vendorData.media.push({
          url: path.posix.join('uploads', path.basename(m.path)),
          label: m.originalname
        });
      }
    }
    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      vendorData.passwordHash = await bcrypt.hash(password, salt);
    }
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      if (!isNaN(latNum) && !isNaN(lngNum)) {
        vendorData.location = { type: 'Point', coordinates: [lngNum, latNum] };
      }
    } else if (city) {
      const geo = await geocodePlace(city).catch(() => null);
      if (geo && geo.lat && geo.lon) {
        vendorData.location = { type: 'Point', coordinates: [parseFloat(geo.lon), parseFloat(geo.lat)] };
      }
    }
    const vendor = new Vendor(vendorData);
    await vendor.save();
    const toReturn = vendor.toObject();
    delete toReturn.passwordHash;
    return res.status(201).json(toReturn);
  } catch (err) {
    console.error('createVendor error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getVendors = async function (req, res) {
  // ...same as above...
  try {
    const { service, city, lat, lng, radiusKm, limit, skip } = req.query;
    const opts = { service: service || undefined, city: city || undefined, lat, lng, radiusKm: radiusKm ? parseFloat(radiusKm) : undefined, limit: limit ? parseInt(limit, 10) : 50, skip: skip ? parseInt(skip, 10) : 0 };
    const vendors = await Vendor.search(opts);
    return res.json(vendors);
  } catch (err) {
    console.error('getVendors error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getVendorById = async function (req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: 'Vendor id required' });
    const v = await Vendor.findById(id).lean();
    if (!v) return res.status(404).json({ message: 'Vendor not found' });
    if (v.passwordHash) delete v.passwordHash;
    return res.json(v);
  } catch (err) {
    console.error('getVendorById error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProfile = async function (req, res) {
  try {
    const vendorId = req.vendorId || req.userId;
    if (!vendorId) return res.status(401).json({ message: "No vendor ID" });
    const vendor = await Vendor.findById(vendorId).lean();
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    delete vendor.passwordHash;
    res.json(vendor);
  } catch (err) {
    console.error('getProfile error', err);
    res.status(500).json({ message: 'Internal error' });
  }
};

export const updateProfile = async function (req, res) {
  try {
    const vendorId = req.vendorId || req.userId;
    if (!vendorId) return res.status(401).json({ message: "No vendor ID" });
    const body = req.body || {};
    const files = req.files || {};
    const updates = {};
    ['name', 'email', 'about', 'service', 'city'].forEach(f => { if (body[f]) updates[f] = body[f]; });
    ['selfie', 'aadhar', 'pan', 'gst'].forEach(fld => { if (files[fld] && files[fld][0]) updates[fld] = path.posix.join('uploads', path.basename(files[fld][0].path)); });
    if (files.media && files.media.length) {
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });
      files.media.forEach(f => { vendor.media.push({ url: path.posix.join('uploads', path.basename(f.path)), label: f.originalname }); });
      Object.assign(vendor, updates);
      await vendor.save();
      const obj = vendor.toObject();
      delete obj.passwordHash;
      return res.json(obj);
    } else {
      const updated = await Vendor.findByIdAndUpdate(vendorId, updates, { new: true });
      if (!updated) return res.status(404).json({ message: "Vendor not found" });
      const obj = updated.toObject();
      delete obj.passwordHash;
      return res.json(obj);
    }
  } catch (err) {
    console.error('updateProfile error', err);
    res.status(500).json({ message: 'Internal error' });
  }
};

export const approveVendor = async function (req, res) {
  try {
    const vid = req.params.id;
    if (!vid) return res.status(400).json({ message: "Vendor ID required" });
    const vendor = await Vendor.findByIdAndUpdate(vid, { approved: true, rejected: false }, { new: true });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json({ ok: true, vendor });
  } catch (err) {
    console.error('approveVendor error', err);
    res.status(500).json({ message: 'Internal error' });
  }
};

export const rejectVendor = async function (req, res) {
  try {
    const vid = req.params.id;
    if (!vid) return res.status(400).json({ message: "Vendor ID required" });
    const vendor = await Vendor.findByIdAndUpdate(vid, { approved: false, rejected: true, rejectedReason: req.body.reason || "" }, { new: true });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json({ ok: true, vendor });
  } catch (err) {
    console.error('rejectVendor error', err);
    res.status(500).json({ message: 'Internal error' });
  }
};

export const adminListVendors = async function (req, res) {
  try {
    const query = {};
    if (req.query.approved) query.approved = req.query.approved === "true";
    if (req.query.rejected) query.rejected = req.query.rejected === "true";
    const vendors = await Vendor.find(query).sort({ createdAt: -1 }).lean();
    res.json(vendors.map(v => { delete v.passwordHash; return v; }));
  } catch (err) {
    console.error('adminListVendors error', err);
    res.status(500).json({ message: 'Internal error' });
  }
};

// ---------- KEY: Add correct default export -------------------
export default {
  geocodePlace,
  createVendor,
  getVendors,
  getVendorById,
  getProfile,
  updateProfile,
  approveVendor,
  rejectVendor,
  adminListVendors
};