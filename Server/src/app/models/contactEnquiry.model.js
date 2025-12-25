/**
 * ============================================================================
 * ContactEnquiry Model
 * ============================================================================
 * 
 * @description Mongoose schema and model definition for ContactEnquiry.
 * @module models/contactEnquiry
 * @requires mongoose
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const mongoose = require("mongoose");

// ==================== SCHEMA DEFINITION ====================
const contactEnquirySchema = new mongoose.Schema(
    {
        contactName: {
            type: String,
            required: true,
        },
        contactEmail: {
            type: String,
            required: true,
        },
        contactPhone: {
            type: String,
            required: true,
        },
        contactMessage: {
            type: String,
            required: true,
        },
        contactStatus: {
            type: String,
            enum: ["pending", "resolved", "closed"],
            default: "pending",
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
const contactEnquiryModel = mongoose.model("ContactEnquiry", contactEnquirySchema);

// ==================== EXPORTS ====================
module.exports = { contactEnquiryModel };
