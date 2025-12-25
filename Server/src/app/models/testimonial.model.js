/**
 * ============================================================================
 * Testimonial Model
 * ============================================================================
 * 
 * @description Mongoose schema and model definition for Testimonial.
 * @module models/testimonial
 * @requires mongoose
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const mongoose = require("mongoose");

// ==================== SCHEMA DEFINITION ====================
const testimonialSchema = new mongoose.Schema(
    {
        testimonialName: {
            type: String,
            required: true,
        },
        testimonialDesignation: {
            type: String,
            required: true,
        },
        testimonialMessage: {
            type: String,
            required: true,
        },
        testimonialRating: {
            type: Number,
            default: 5,
        },
        testimonialImageUrl: {
            type: String,
            required: true,
        },
        testimonialOrder: {
            type: Number,
            required: true,
        },
        testimonialStatus: {
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
const testimonialModel = mongoose.model("Testimonial", testimonialSchema);

// ==================== EXPORTS ====================
module.exports = { testimonialModel };
