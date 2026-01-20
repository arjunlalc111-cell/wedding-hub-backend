import mongoose from "mongoose";
const couponSchema = new mongoose.Schema({
  code: { type:String, required:true, unique:true },
  discount: Number,
  validTill: Date
});
export default mongoose.model("Coupon", couponSchema);
