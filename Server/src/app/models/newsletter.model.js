/**
 * ============================================================================
 * Newsletter Model
 * ============================================================================
 * 
 * @description Mongoose schema and model definition for Newsletter.
 * @module models/newsletter
 * @requires mongoose
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const mongoose = require("mongoose");

// ==================== SCHEMA DEFINITION ====================
const newsletterSchema = new mongoose.Schema(
  {
    newsletterEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    newsletterStatus: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// ==================== MODEL DEFINITION ====================
const newsletterModel = mongoose.model("Newsletter", newsletterSchema);

// ==================== EXPORTS ====================
module.exports = { newsletterModel };
