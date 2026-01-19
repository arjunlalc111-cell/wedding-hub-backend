//
// Merged Review model for Wedding Hub
// Supports: vendor, user (as string or ObjectId), rating (1-5), comment, timestamps
//

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },

  user: { type: String, required: true }, // User name/ID, can be string or ObjectId

  rating: { type: Number, min: 1, max: 5, required: true },

  comment: { type: String },

}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
