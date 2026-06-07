import Tesseract from "tesseract.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

// ── Frequency map for medicine parsing ───────────────────────────────────
const FREQUENCY_MAP = {
  OD: "Once daily",
  BD: "Twice daily",
  TDS: "Three times daily",
  QID: "Four times daily",
  SOS: "As needed",
  HS: "At bedtime",
  AC: "Before meals",
  PC: "After meals",
};

/**
 * Extract text from image buffer using Tesseract OCR
 */
export const extractTextFromImage = async (imageBuffer) => {
  const { data: { text } } = await Tesseract.recognize(imageBuffer, "eng", {
    logger: () => {},
  });
  return text;
};

/**
 * Parse extracted OCR text into structured medicine objects
 */
export const parseMedicinesFromText = (text) => {
  const lines = text.split("\n").filter((l) => l.trim().length > 3);
  const medicines = [];

  const dosagePattern   = /(\d+\.?\d*)\s*(mg|ml|mcg|units?|iu)/gi;
  const frequencyPattern = new RegExp(Object.keys(FREQUENCY_MAP).join("|"), "gi");
  const durationPattern  = /(\d+)\s*(day|days|week|weeks|month|months)/gi;

  lines.forEach((line) => {
    const dosageMatch    = line.match(dosagePattern);
    const freqMatch      = line.match(frequencyPattern);
    const durationMatch  = line.match(durationPattern);

    if (dosageMatch || freqMatch) {
      const name = line
        .replace(dosagePattern, "")
        .replace(frequencyPattern, "")
        .replace(durationPattern, "")
        .replace(/[^a-zA-Z\s]/g, "")
        .trim();

      if (name.length > 2) {
        medicines.push({
          name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
          dosage: dosageMatch ? dosageMatch[0] : "As prescribed",
          frequency: freqMatch
            ? FREQUENCY_MAP[freqMatch[0].toUpperCase()] || freqMatch[0]
            : "As directed",
          duration: durationMatch ? durationMatch[0] : "As directed",
          source: "ocr",
        });
      }
    }
  });

  return medicines;
};

/**
 * Full OCR pipeline — upload → extract → parse → return medicines
 */
export const processPrescriptionOCR = async (fileBuffer, mimetype) => {
  // Upload to Cloudinary temp
  const uploaded = await uploadToCloudinary(fileBuffer, "mc360/ocr-temp", "auto");

  // Extract text
  const rawText = await extractTextFromImage(fileBuffer);

  // Parse medicines
  const medicines = parseMedicinesFromText(rawText);

  // Cleanup temp file
  await deleteFromCloudinary(uploaded.public_id);

  return { rawText, medicines, total: medicines.length };
};