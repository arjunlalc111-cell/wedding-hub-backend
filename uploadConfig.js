import multer from "multer";
import path from "path";

/* ===== STORAGE ===== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "selfie") cb(null, "uploads/selfie");
    if (file.fieldname === "aadhar") cb(null, "uploads/aadhar");
    if (file.fieldname === "pan") cb(null, "uploads/pan");
    if (file.fieldname === "gst") cb(null, "uploads/gst");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    );
  },
});

/* ===== FILE FILTER ===== */
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images allowed"), false);
};

const upload = multer({ storage, fileFilter });

export default upload;