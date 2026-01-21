//
// Service model for Wedding Hub (PRODUCTION-READY, ES6, EXTENDED)
// Each vendor can offer multiple services using this schema
// Supports: add/edit/delete, category, description, price, images, status
//

import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true }, // Which vendor offers this service
  name: { type: String, required: true, trim: true },        // e.g. DJ, Catering, etc.
  description: { type: String, trim: true },
  category: { type: String, trim: true },                    // Optional broader group (e.g. "Decoration")
  price: { type: Number, min: 0 },                           // Service price/rate
  images: [{ type: String }],                                // Array of URLs or file paths for service images
  isActive: { type: Boolean, default: true },                // Hide/Show/delete flag
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-update updatedAt timestamp before save
ServiceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for fast filtering
ServiceSchema.index({ name: 1, category: 1 });
ServiceSchema.index({ vendor: 1 });

export default mongoose.model("Service", ServiceSchema);
