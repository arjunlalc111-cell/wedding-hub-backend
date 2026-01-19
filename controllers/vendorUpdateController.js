// controllers/vendorUpdateController.js
// Handles vendor profile updates, including optional file uploads.

import path from "path";
import Vendor from "../models/vendors.js";

// Helper to make file paths safe for storage
function safeRel(p) {
  if (!p) return p;
  return path.posix.join('uploads', path.basename(p));
}

export async function updateVendor(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: 'Vendor id required' });

    // Authorization: vendor owner or admin
    const uid = req.vendorId;
    const isAdmin = req.isTokenAdmin || false;
    if (!isAdmin && (!uid || uid.toString() !== id.toString())) {
      return res.status(403).json({ message: 'Not authorized to update this vendor' });
    }

    const { body, files } = req;
    const updates = {};

    // allow update of basic fields
    ['name', 'phone', 'email', 'service', 'city', 'about'].forEach(k => {
      if (body[k] !== undefined) updates[k] = body[k];
    });

    // files: selfie, aadhar, pan, gst, media (multiple)
    if (files) {
      if (files.selfie && files.selfie[0]) updates.selfie = safeRel(files.selfie[0].path);
      if (files.aadhar && files.aadhar[0]) updates.aadhar = safeRel(files.aadhar[0].path);
      if (files.pan && files.pan[0]) updates.pan = safeRel(files.pan[0].path);
      if (files.gst && files.gst[0]) updates.gst = safeRel(files.gst[0].path);
      if (files.media && files.media.length) {
        // append new media entries to existing array
        const newMedia = files.media.map(f => ({ url: safeRel(f.path), label: f.originalname }));
        // set media to be pushed; we'll use $push with $each
        updates.$push = { media: { $each: newMedia } };
      }
    }

    // location: allow updating via lat/lng or city geocode via existing vendorController logic
    if (body.lat && body.lng) {
      const lat = parseFloat(body.lat);
      const lng = parseFloat(body.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        updates.location = { type: 'Point', coordinates: [lng, lat] };
      }
    } else if (body.city) {
      updates.city = body.city;
    }

    // Perform update
    let updated;
    if (updates.$push) {
      // combine set fields and push
      const setFields = { ...updates };
      delete setFields.$push;
      updated = await Vendor.findByIdAndUpdate(id, { $set: setFields, $push: updates.$push }, { new: true }).lean();
    } else {
      updated = await Vendor.findByIdAndUpdate(id, updates, { new: true }).lean();
    }

    if (!updated) return res.status(404).json({ message: 'Vendor not found' });
    if (updated.passwordHash) delete updated.passwordHash;
    return res.json({ message: 'Vendor updated', vendor: updated });
  } catch (err) {
    console.error('updateVendor error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Default export for compatibility (if needed elsewhere)
export default { updateVendor };