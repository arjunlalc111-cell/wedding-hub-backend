// Merged & polished Vendor model for Wedding Hub (ESM style)
// Includes core vendor info, media, GeoJSON, admin controls, password, search, audit

import mongoose from "mongoose";

// Single media item (for gallery/media uploads)
const MediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  label: { type: String },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true, index: true },
  email: { type: String, trim: true, lowercase: true },
  service: { type: String, trim: true, index: true },
  city: { type: String, trim: true, index: true },
  about: { type: String, trim: true },

  // File paths (relative to /uploads) or absolute URLs
  selfie: { type: String },
  aadhar: { type: String },
  pan: { type: String },
  gst: { type: String },

  // Gallery/media files
  media: { type: [MediaSchema], default: [] },

  // GeoJSON location [lng, lat]
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: void 0
    }
  },

  // Approval & admin panel controls
  approved: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false },
  rejectedReason: { type: String },

  // Optional password-based login
  passwordHash: { type: String },

  // Multi-role for role-based access
  role: { type: String, enum: ['vendor', 'admin'], default: 'vendor' },

  // List of services (future extension: detailed services per vendor)
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],

  // Basic audit fields
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-update updatedAt on save
VendorSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// 2dsphere index for location queries (MongoDB geospatial search)
VendorSchema.index({ location: '2dsphere' });

// Static helper: search by service/city/location/radius/km, supports nearby search
// options: { service, city, lat, lng, radiusKm, limit, skip }
VendorSchema.statics.search = async function (options = {}) {
  const { service, city, lat, lng, radiusKm = 50, limit = 50, skip = 0 } = options;
  const filter = { approved: true };

  if (service) filter.service = new RegExp(service.trim(), 'i');
  if (city && !(lat && lng)) filter.city = new RegExp(city.trim(), 'i');

  if (lat && lng) {
    const meters = Math.max(1000, Math.min(radiusKm * 1000, 200000)); // clamp radius between 1km–200km
    filter.location = {
      $nearSphere: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: meters
      }
    };
  }

  return this.find(filter)
    .sort({ createdAt: -1 })
    .skip(parseInt(skip, 10))
    .limit(parseInt(limit, 10))
    .lean();
};

// Create and export the model
const Vendor = mongoose.model('Vendor', VendorSchema);
export default Vendor;
