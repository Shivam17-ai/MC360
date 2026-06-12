const { summarizeReport } = require("../services/ai.service");
const { extractTextFromImage, extractTextFromBuffer } = require("../services/ocr.service");
const logger = require("../utils/logger");

/**
 * reportSummarizer.js
 * Handles OCR extraction + AI summarization of uploaded medical reports.
 * Supports PDF and image file types.
 */

/**
 * Extract text from a report file (URL or buffer).
 * @param {string|null} fileUrl - Cloudinary URL
 * @param {Buffer|null} fileBuffer - Raw file buffer
 * @param {string} mimeType - File MIME type
 * @returns {string} Extracted text
 */
const extractReportText = async (fileUrl = null, fileBuffer = null, mimeType = "application/pdf") => {
  try {
    if (fileBuffer) {
      return await extractTextFromBuffer(fileBuffer, mimeType);
    }
    if (fileUrl) {
      return await extractTextFromImage(fileUrl);
    }
    return "";
  } catch (err) {
    logger.error(`Report text extraction error: ${err.message}`);
    return "";
  }
};

/**
 * Full pipeline: extract text from report → summarize with AI.
 * @param {Object} report - Report document from DB
 * @param {Buffer|null} fileBuffer - Optional raw file buffer
 * @returns {Object} Summary result
 */
const summarizeReportDocument = async (report, fileBuffer = null) => {
  let text = "";

  // Try to extract text
  text = await extractReportText(report.fileUrl, fileBuffer, report.fileType);

  if (!text || text.trim().length < 20) {
    return {
      summary: "Could not extract readable text from this report. Please ensure the file is not a scanned image without OCR, or manually enter the report details.",
      keyFindings: [],
      abnormalValues: [],
      normalValues: [],
      recommendations: ["Please consult your doctor to review this report."],
      urgency: "routine",
      disclaimer: "AI analysis unavailable for this file format.",
    };
  }

  return summarizeReport(text, report.type || "lab-report");
};

/**
 * Parse common lab value patterns from plain text (fallback parser).
 * Useful when AI is unavailable.
 */
const parseLabValues = (text) => {
  const values = [];
  // Pattern: "Hemoglobin: 11.2 g/dL (Normal: 13.5-17.5)"
  const pattern = /([A-Za-z\s]+):\s*([\d.]+)\s*([a-zA-Z/%]+)?\s*(?:\((?:Normal|Ref(?:erence)?|Range)?:?\s*([\d.\s\-<>]+[a-zA-Z%/]*)\))?/g;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    values.push({
      parameter: match[1].trim(),
      value: match[2].trim(),
      unit: match[3]?.trim() || "",
      normalRange: match[4]?.trim() || "",
    });
  }
  return values;
};

/**
 * Format a summary object into a readable plain-text string.
 * Useful for email/PDF export.
 */
const formatSummaryAsText = (summary) => {
  const lines = [];
  lines.push("=== REPORT SUMMARY (AI-Generated) ===\n");

  if (summary.summary) {
    lines.push("OVERVIEW:");
    lines.push(summary.summary);
    lines.push("");
  }

  if (summary.keyFindings?.length > 0) {
    lines.push("KEY FINDINGS:");
    summary.keyFindings.forEach((f) => lines.push(`  • ${f}`));
    lines.push("");
  }

  if (summary.abnormalValues?.length > 0) {
    lines.push("ABNORMAL VALUES:");
    summary.abnormalValues.forEach((v) => lines.push(`  ⚠ ${v.parameter}: ${v.value} (Normal: ${v.normal}) — ${v.concern}`));
    lines.push("");
  }

  if (summary.recommendations?.length > 0) {
    lines.push("RECOMMENDATIONS:");
    summary.recommendations.forEach((r) => lines.push(`  → ${r}`));
    lines.push("");
  }

  lines.push(`URGENCY: ${summary.urgency || "routine"}`);
  lines.push(`\n⚕ ${summary.disclaimer || "This summary is AI-generated. Always consult your doctor."}`);

  return lines.join("\n");
};

module.exports = {
  extractReportText,
  summarizeReportDocument,
  parseLabValues,
  formatSummaryAsText,
};