/**
 * ============================================================================
 * Color Model
 * ============================================================================
 * 
 * @description Mongoose schema and model definition for Color.
 * @module models/color
 * @requires mongoose
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema(
  {
    colorName: {
      type: String,
      required: [true, "Color name is required"],
      unique: true,
    },
    colorCode: {
      type: String,
      required: [true, "Color code is required"],
      minLength: 2,
      maxLength: 10,
    },
    colorOrder: {
      type: Number,
      required: true,
    },
    colorStatus: {
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

const colorModel = mongoose.model("Color", colorSchema);

module.exports = { colorModel };
