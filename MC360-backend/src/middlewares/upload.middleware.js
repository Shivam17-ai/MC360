/**
 * upload.middleware.js
 * Multer configuration for file uploads
 * Supports: reports (PDF/images), avatars (images), OCR scans
 * Install: npm install multer
 */

const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");

// ── Ensure upload directories exist ──────────────────────────
const UPLOAD_DIRS = {
  reports : "uploads/reports",
  avatars : "uploads/avatars",
  ocr     : "uploads/ocr",
  general : "uploads/general",
};

Object.values(UPLOAD_DIRS).forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ── Storage factory ───────────────────────────────────────────
const makeStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_DIRS[folder] || UPLOAD_DIRS.general);
    },
    filename: (req, file, cb) => {
      const ext      = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "-");
      const unique   = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
      cb(null, `${baseName}-${unique}${ext}`);
    },
  });

// ── File filter factories ─────────────────────────────────────
const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext     = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime    = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed."));
};

const reportFilter = (req, file, cb) => {
  const allowed = /pdf|jpeg|jpg|png/;
  const ext     = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ext) return cb(null, true);
  cb(new Error("Only PDF and image files are allowed for reports."));
};

const anyFileFilter = (req, file, cb) => cb(null, true);

// ── Named uploaders ───────────────────────────────────────────

/** Report upload: PDF or image, max 10MB */
const uploadReport = multer({
  storage   : makeStorage("reports"),
  fileFilter: reportFilter,
  limits    : { fileSize: 10 * 1024 * 1024 },
}).single("report");

/** Avatar upload: image only, max 2MB */
const uploadAvatar = multer({
  storage   : makeStorage("avatars"),
  fileFilter: imageFilter,
  limits    : { fileSize: 2 * 1024 * 1024 },
}).single("avatar");

/** OCR scan: image or PDF, max 10MB */
const uploadOCR = multer({
  storage   : makeStorage("ocr"),
  fileFilter: reportFilter,
  limits    : { fileSize: 10 * 1024 * 1024 },
}).single("file");

/** General single file, max 5MB */
const uploadGeneral = multer({
  storage   : makeStorage("general"),
  fileFilter: anyFileFilter,
  limits    : { fileSize: 5 * 1024 * 1024 },
}).single("file");

/** Multiple files (max 5), max 20MB total */
const uploadMultiple = multer({
  storage   : makeStorage("general"),
  fileFilter: anyFileFilter,
  limits    : { fileSize: 20 * 1024 * 1024 },
}).array("files", 5);

// ── Multer error handler wrapper ──────────────────────────────
/**
 * Wraps any multer uploader to produce clean JSON errors
 * Usage: router.post("/upload", handleUpload(uploadReport), controller)
 */
const handleUpload = (uploader) => (req, res, next) => {
  uploader(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      const msg =
        err.code === "LIMIT_FILE_SIZE"
          ? "File too large."
          : err.code === "LIMIT_UNEXPECTED_FILE"
          ? "Unexpected file field."
          : err.message;
      return res.status(400).json({ success: false, message: msg });
    }

    return res.status(400).json({ success: false, message: err.message || "Upload failed." });
  });
};

module.exports = {
  uploadReport,
  uploadAvatar,
  uploadOCR,
  uploadGeneral,
  uploadMultiple,
  handleUpload,
  UPLOAD_DIRS,
};