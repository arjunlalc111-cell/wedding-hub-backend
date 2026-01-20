import mongoose from "mongoose";
const bannerSchema = new mongoose.Schema({
  image: String,
  title: String,
  link: String,
  createdAt: { type:Date, default:Date.now }
});
export default mongoose.model("Banner", bannerSchema);
