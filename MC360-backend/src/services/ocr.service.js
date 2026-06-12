const axios = require("axios");
const logger = require("../utils/logger");

/**
 * OCR Service - Extracts text from uploaded medical reports/documents.
 * Uses a free OCR API (ocr.space). Set OCR_API_KEY in .env for better limits.
 * Falls back gracefully if unavailable.
 */
const extractTextFromImage = async (imageUrl) => {
  try {
    const apiKey = process.env.OCR_API_KEY || "helloworld"; // free tier key

    const response = await axios.post(
      "https://api.ocr.space/parse/imageurl",
      null,
      {
        params: {
          apikey: apiKey,
          url: imageUrl,
          language: "eng",
          isOverlayRequired: false,
        },
        timeout: 30000,
      }
    );

    const result = response.data;
    if (result.IsErroredOnProcessing) {
      throw new Error(result.ErrorMessage?.[0] || "OCR processing failed");
    }

    const text = result.ParsedResults?.map((r) => r.ParsedText).join("\n") || "";
    return text.trim();
  } catch (err) {
    logger.error(`OCR error: ${err.message}`);
    return "";
  }
};

const extractTextFromBuffer = async (buffer, mimeType = "application/pdf") => {
  try {
    const FormData = require("form-data");
    const form = new FormData();
    form.append("file", buffer, { filename: "upload.pdf", contentType: mimeType });
    form.append("apikey", process.env.OCR_API_KEY || "helloworld");
    form.append("language", "eng");

    const response = await axios.post("https://api.ocr.space/parse/image", form, {
      headers: form.getHeaders(),
      timeout: 30000,
    });

    const result = response.data;
    if (result.IsErroredOnProcessing) throw new Error("OCR processing failed");
    return result.ParsedResults?.map((r) => r.ParsedText).join("\n").trim() || "";
  } catch (err) {
    logger.error(`OCR buffer error: ${err.message}`);
    return "";
  }
};

module.exports = { extractTextFromImage, extractTextFromBuffer };