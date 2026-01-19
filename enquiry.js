import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true
    },
    name: String,
    phone: String,
    weddingDate: String,
    message: String
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
