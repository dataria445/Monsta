/**
 * ============================================================================
 * Choose Model
 * ============================================================================
 * 
 * @description Mongoose schema and model definition for Choose.
 * @module models/choose
 * @requires mongoose
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const mongoose = require("mongoose");

// ==================== SCHEMA DEFINITION ====================
const chooseSchema = new mongoose.Schema(
    {
        chooseTitle: {
            type: String,
            required: true,
        },
        chooseImageUrl: {
            type: String,
            required: true,
        },
        chooseOrder: {
            type: Number,
            required: true,
        },
        chooseStatus: {
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
const chooseModel = mongoose.model("Choose", chooseSchema);

// ==================== EXPORTS ====================
module.exports = { chooseModel };
