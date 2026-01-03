/**
 * ============================================================================
 * Multer Middleware
 * ============================================================================
 * 
 * @description Configures Multer for handling multipart/form-data.
 * Uses memory storage to provide file buffers for direct cloud uploads.
 * This version wraps the multer methods to dynamically inject the target 
 * Cloudinary folder into the request object.
 * @module middlewares/multer
 * @requires multer - Middleware for handling file uploads
 * 
 * @author Monsta Team
 * @version 1.2.0
 * @since 2025-12-23
 * ============================================================================
 */

const multer = require("multer");

/**
 * @function upload
 * @description Initializes a Multer instance. Wraps standard methods (.single, 
 * .array, .fields) to attach 'req.uploadFolder' for the controller to use.
 * 
 * @param {string} folderPath - The subfolder name (e.g., 'productImages').
 * @returns {Object} Object containing wrapped multer middleware methods.
 */
const upload = (folderPath = "common") => {
  const storage = multer.memoryStorage();
  const multerInstance = multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    }
  });

  /**
   * @function wrap
   * @description Injection wrapper to set req.uploadFolder dynamically.
   */
  const wrap = (multerMethod) => {
    return (req, res, next) => {
      // Set the dynamic folder name with 'monsta/' prefix
      req.uploadFolder = `monsta/${folderPath}`;
      multerMethod(req, res, next);
    };
  };

  return {
    single: (fieldName) => wrap(multerInstance.single(fieldName)),
    array: (fieldName, maxCount) => wrap(multerInstance.array(fieldName, maxCount)),
    fields: (fieldsArray) => wrap(multerInstance.fields(fieldsArray)),
    any: () => wrap(multerInstance.any()),
  };
};

module.exports = upload;