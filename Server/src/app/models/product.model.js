/**
 * ============================================================================
 * Product Model
 * ============================================================================
 * 
 * @description Mongoose schema and model definition for Product.
 * @module models/product
 * @requires mongoose
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const mongoose = require("mongoose");

// ==================== SCHEMA DEFINITION ====================
const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        productType: {
            type: String,
            required: true,
            enum: ["1", "2", "3"], // 1: Featured, 2: New Arrivals, 3: Discontinued
        },
        productImage: {
            type: String,
            required: true,
        },
        productBackImage: {
            type: String,
        },
        productImageGallery: {
            type: [String],
            default: [],
        },
        productDescription: {
            type: String,
        },
        productPrice: {
            type: Number,
            required: true,
        },
        productSalePrice: {
            type: Number,
        },
        productStock: {
            type: Number,
            required: true,
            default: 0,
        },
        productOrder: {
            type: Number,
            required: true,
        },
        productBestSelling: {
            type: Boolean,
            default: false,
        },
        productTopRated: {
            type: Boolean,
            default: false,
        },
        productTrending: {
            type: Boolean,
            default: false,
        },
        productUpsell: {
            type: Boolean,
            default: false,
        },
        productStatus: {
            type: Boolean,
            default: true,
        },
        parentCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        subCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubCategory",
        },
        subsubCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSubCategory",
        },
        materialId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Material",
        },
        colorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Color",
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
const productModel = mongoose.model("Product", productSchema);

// ==================== EXPORTS ====================
module.exports = { productModel };
