/**
 * Multer Config - File upload middleware for images
 * 
 * Storage: Local disk storage in /public directory
 * Preserves original filename, used for shop & item images
 * Files uploaded to Cloudinary after local save
 */
import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
