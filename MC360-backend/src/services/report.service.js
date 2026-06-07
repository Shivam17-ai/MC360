import Report from "../models/Report.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "../config/env.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

/**
 * Upload report file and create DB record
 */
export const uploadReport = async ({ patientId, doctorId, title, type, fileBuffer, mimetype }) => {
  const folder = `mc360/reports/${patientId}`;
  const resourceType = mimetype === "application/pdf" ? "raw" : "image";

  const uploaded = await uploadToCloudinary(fileBuffer, folder, resourceType);

  const report = await Report.create({
    patientId,
    doctorId,
    title,
    type,
    fileUrl: uploaded.secure_url,
    cloudinaryPublicId: uploaded.public_id,
  });

  return report;
};

/**
 * Get all reports for a patient
 */
export const getReports = async (patientId, filters = {}) => {
  const query = { patientId, isDeleted: false };
  if (filters.type) query.type = filters.type;

  return await Report.find(query)
    .populate("doctorId", "name specialization")
    .sort({ uploadedAt: -1 });
};

/**
 * Soft delete a report
 */
export const deleteReport = async (reportId, patientId) => {
  const report = await Report.findOne({ _id: reportId, patientId });
  if (!report) throw new Error("Report not found");

  await deleteFromCloudinary(report.cloudinaryPublicId);
  report.isDeleted = true;
  await report.save();

  return { message: "Report deleted" };
};

/**
 * Generate AI summary of a report using Gemini
 */
export const generateReportSummary = async (reportId, reportText) => {
  const report = await Report.findById(reportId);
  if (!report) throw new Error("Report not found");

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    You are a medical AI assistant. Analyze this lab/medical report and provide:
    1. Key Findings (bullet points)
    2. Abnormal Values (list values outside normal range)
    3. Risk Indicators (any concerning patterns)
    4. Follow-up Suggestions (what the patient should do next)

    Keep it clear, concise, and in simple English for a non-medical patient.

    Report Content:
    ${reportText}
  `;

  const result  = await model.generateContent(prompt);
  const summary = result.response.text();

  // Save summary to report
  report.aiSummary = summary;
  await report.save();

  return { summary, reportId };
};