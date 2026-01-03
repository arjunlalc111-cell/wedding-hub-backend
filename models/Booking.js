import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true
  },

  customerName: String,
  customerPhone: String,
  customerEmail: String,

  eventDate: Date,

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Cancelled"],
    default: "Pending"
  }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);