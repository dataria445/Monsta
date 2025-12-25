/**
 * ============================================================================
 * Faq Model
 * ============================================================================
 * 
 * @description Mongoose schema and model definition for Faq.
 * @module models/faq
 * @requires mongoose
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const mongoose = require("mongoose");

// ==================== SCHEMA DEFINITION ====================
const faqSchema = new mongoose.Schema(
  {
    faqQuestion: {
      type: String,
      required: true,
    },
    faqAnswer: {
      type: String,
      required: true,
    },
    faqOrder: {
      type: Number,
      required: true,
    },
    faqStatus: {
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
const faqModel = mongoose.model("Faq", faqSchema);

// ==================== EXPORTS ====================
module.exports = { faqModel };
