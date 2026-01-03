/**
 * ============================================================================
 * Cloudinary Utility
 * ============================================================================
 * 
 * @description Provides services for uploading binary data (buffers) directly 
 * to Cloudinary using Node.js readable streams. This bypasses the need for 
 * local disk storage.
 * @module utils/cloudinary
 * @requires cloudinary - Cloudinary V2 SDK
 * @requires streamifier - Utility to convert buffers to readable streams
 * 
 * @author Monsta Team
 * @version 1.1.0
 * @since 2025-12-23
 * ============================================================================
 */

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// ==================== CONFIGURATION ====================

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==================== UPLOAD LOGIC ====================

/**
 * @function uploadOnCloudinary
 * @description Uploads a file buffer directly to Cloudinary using streams.
 * @param {Buffer} fileBuffer - The binary file data from Multer memory storage.
 * @param {string} folderName - The destination folder in your Cloudinary account.
 * @returns {Promise<Object|null>} Returns the Cloudinary upload result object or null on failure.
 */
const uploadOnCloudinary = async (fileBuffer, folderName = "general") => {
    try {
        // 1. Basic validation
        if (!fileBuffer) return null;

        // 2. Wrap Cloudinary stream in a Promise for async/await support
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folderName,
                    resource_type: "auto", // Automatically detect image/video/raw
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary Upload Error:", error);
                        resolve(null); // Return null instead of rejecting to keep controller flow stable
                    } else {
                        resolve(result);
                    }
                }
            );

            // 3. Convert buffer to a readable stream and pipe it to the Cloudinary upload stream
            streamifier.createReadStream(fileBuffer).pipe(uploadStream);
        });
    } catch (error) {
        console.error("Cloudinary Stream Logic Error:", error);
        return null;
    }
};

module.exports = { uploadOnCloudinary };