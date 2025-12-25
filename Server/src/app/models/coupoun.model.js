/**
 * ============================================================================
 * Coupoun Model
 * ============================================================================
 * 
 * @description Mongoose schema and model definition for Coupoun.
 * @module models/coupoun
 * @requires mongoose
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const mongoose = require("mongoose");

// ==================== SCHEMA DEFINITION ====================
const coupounSchema = new mongoose.Schema(
    {
        coupounName: {
            type: String,
            required: true,
        },
        coupounCode: {
            type: String,
            required: true,
            unique: true,
        },
        coupounDiscountPercent: {
            type: Number,
            required: true,
        },
        coupounPriceRange: {
            from: {
                type: Number,
                required: true,
            },
            to: {
                type: Number,
                required: true,
            }
        },
        coupounValidBetween: {
            startDate: {
                type: Date,
                required: true,
            },
            endDate: {
                type: Date,
                required: true,
            }
        },
        coupounImageUrl: {
            type: String,
        },
        coupounOrder: {
            type: Number,
            required: true,
        },
        coupounStatus: {
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
const coupounModel = mongoose.model("Coupoun", coupounSchema);

// ==================== EXPORTS ====================
module.exports = { coupounModel };