import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    name: String,
    phone: String,
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);