/**
 * ============================================================================
 * SubSubCategory Model
 * ============================================================================
 * 
 * @description Mongoose schema and model definition for SubSubCategory.
 * @module models/subSubCategory
 * @requires mongoose
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const mongoose = require("mongoose");

// ==================== SCHEMA DEFINITION ====================
const subSubCategorySchema = new mongoose.Schema(
  {
    subSubCategoryName: {
      type: String,
      required: true,
    },
    parentCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    subSubCategoryImage: {
      type: String,
      required: true,
    },
    subSubCategoryOrder: {
      type: Number,
      required: true,
    },
    subSubCategoryStatus: {
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

const subSubCategoryModel = mongoose.model("SubSubCategory", subSubCategorySchema);

// ==================== EXPORTS ====================
module.exports = { subSubCategoryModel };
