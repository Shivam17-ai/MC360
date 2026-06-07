import { v2 as cloudinary } from "cloudinary";
import env from "./env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload file buffer to Cloudinary
 * @param {Buffer} fileBuffer
 * @param {string} folder - e.g. "mc360/reports"
 * @param {string} resourceType - "image" | "raw" | "auto"
 */
export const uploadToCloudinary = (fileBuffer, folder = "mc360", resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

/**
 * Delete file from Cloudinary by public_id
 * @param {string} publicId
 */
export const deleteFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

/**
 * Get optimized URL for an image
 * @param {string} publicId
 * @param {object} options
 */
export const getOptimizedUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
    ...options,
  });
};

export default cloudinary;