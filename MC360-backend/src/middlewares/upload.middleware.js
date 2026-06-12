const multer = require("multer");
const path = require("path");
const { cloudinary } = require("../config/cloudinary");
const { errorResponse } = require("../utils/response");

// Memory storage — files are uploaded to Cloudinary from buffer
const storage = multer.memoryStorage();

const fileFilter = (allowedTypes) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: fileFilter([".jpg", ".jpeg", ".png", ".pdf", ".webp"]),
});

const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter([".jpg", ".jpeg", ".png", ".webp"]),
});

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: resourceType }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

// Multer error handler middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return errorResponse(res, "File too large. Max 10MB allowed.", 400);
    }
    return errorResponse(res, err.message, 400);
  }
  if (err) return errorResponse(res, err.message, 400);
  next();
};

module.exports = {
  upload,
  uploadImage,
  uploadToCloudinary,
  deleteFromCloudinary,
  handleUploadError,
};