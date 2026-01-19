//
// Merged Booking model for Wedding Hub
// Tracks vendor, customer/contact info, event date, status, timestamps
//

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true
  },

  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String },

  eventDate: { type: Date, required: true },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Cancelled"],
    default: "Pending"
  },

  notes: { type: String }, // Optional additional message

  // Optionally: admin rejection/cancel reason
  cancelReason: { type: String },
  rejectedReason: { type: String }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
