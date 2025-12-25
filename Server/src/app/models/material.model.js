/**
 * ============================================================================
 * Material Model
 * ============================================================================
 * 
 * @description Mongoose schema and model definition for Material.
 * @module models/material
 * @requires mongoose
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    materialName: {
      type: String,
      required: [true, "Material name is required"],
      unique: true,
    },
    materialOrder: {
      type: Number,
      required: true,
    },
    materialStatus: {
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

const materialModel = mongoose.model("Material", materialSchema);

module.exports = { materialModel };
