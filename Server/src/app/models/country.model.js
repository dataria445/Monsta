/**
 * ============================================================================
 * Country Model
 * ============================================================================
 * 
 * @description Mongoose schema and model definition for Country.
 * @module models/country
 * @requires mongoose
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
    {
        countryName: {
            type: String,
            required: [true, "Country name is required"],
            unique: true,
        },
        countryOrder: {
            type: Number,
            required: true,
        },
        countryStatus: {
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

const countryModel = mongoose.model("Country", countrySchema);

module.exports = { countryModel };
