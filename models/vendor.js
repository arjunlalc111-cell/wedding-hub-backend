import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    vendorName: { type: String, required: true },
    serviceCategory: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String },
    about: { type: String },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Vendor =
  mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);

export default Vendor;