const Report = require("../models/Report.model");
const { uploadToCloudinary, deleteFromCloudinary } = require("../middlewares/upload.middleware");
const { extractTextFromBuffer } = require("./ocr.service");
const { summarizeReport } = require("./ai.service");
const logger = require("../utils/logger");

const uploadReport = async (patientId, uploadedBy, file, metadata) => {
  // Guard: fail fast if Cloudinary isn't configured
  const env = require("../config/env");
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw Object.assign(
      new Error("File storage is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables."),
      { statusCode: 503 }
    );
  }

  // Upload to Cloudinary
  const folder = `mc360/reports/${patientId}`;
  const resourceType = file.mimetype === "application/pdf" ? "raw" : "image";
  const cloudResult = await uploadToCloudinary(file.buffer, folder, resourceType);

  const report = await Report.create({
    patient: patientId,
    uploadedBy,
    title: metadata.title || file.originalname,
    type: metadata.type || "other",
    fileUrl: cloudResult.secure_url,
    filePublicId: cloudResult.public_id,
    fileType: file.mimetype,
    fileSize: file.size,
    description: metadata.description,
    date: metadata.date || new Date(),
    tags: metadata.tags ? metadata.tags.split(",").map((t) => t.trim()) : [],
    doctor: metadata.doctorId,
    hospital: metadata.hospitalId,
  });

  return report;
};

const deleteReport = async (reportId, userId) => {
  const report = await Report.findById(reportId);
  if (!report) throw Object.assign(new Error("Report not found."), { statusCode: 404 });

  if (report.filePublicId) {
    await deleteFromCloudinary(report.filePublicId, "raw").catch(() => {});
  }

  report.isDeleted = true;
  await report.save();
};

const aiSummarizeReport = async (reportId) => {
  const report = await Report.findById(reportId);
  if (!report) throw Object.assign(new Error("Report not found."), { statusCode: 404 });

  let text = "";
  if (report.fileUrl) {
    text = await extractTextFromBuffer(report.fileUrl);
  }

  if (!text) throw Object.assign(new Error("Could not extract text from report."), { statusCode: 422 });

  const summary = await summarizeReport(text, report.type);
  report.aiSummary = summary.summary;
  await report.save();

  return summary;
};

module.exports = { uploadReport, deleteReport, aiSummarizeReport };