import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ["admin", "vendor", "customer"],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  title: String,
  message: String,
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);