/**
 * ============================================================================
 * SubCategory Model
 * ============================================================================
 * 
 * @description Mongoose schema and model definition for SubCategory.
 * @module models/subCategory
 * @requires mongoose
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const mongoose = require("mongoose");

// ==================== SCHEMA DEFINITION ====================
const subCategorySchema = new mongoose.Schema(
  {
    subCategoryName: {
      type: String,
      required: true,
    },
    parentCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryImage: {
      type: String,
      required: true,
    },
    subCategoryOrder: {
      type: Number,
      required: true,
    },
    subCategoryStatus: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      unique: true,
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
const subCategoryModel = mongoose.model("SubCategory", subCategorySchema);

// ==================== EXPORTS ====================
module.exports = { subCategoryModel };
