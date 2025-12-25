/**
 * ============================================================================
 * Slider Model
 * ============================================================================
 * 
 * @description Mongoose schema and model definition for Slider.
 * @module models/slider
 * @requires mongoose
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const mongoose = require("mongoose");

// ==================== SCHEMA DEFINITION ====================
const sliderSchema = new mongoose.Schema(
    {
        sliderTitle: {
            type: String,
            required: true,
        },
        sliderImageUrl: {
            type: String,
            required: true,
        },
        sliderOrder: {
            type: Number,
            required: true,
        },
        sliderStatus: {
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
const sliderModel = mongoose.model("Slider", sliderSchema);

// ==================== EXPORTS ====================
module.exports = { sliderModel };
