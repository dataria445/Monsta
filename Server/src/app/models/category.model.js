const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
        },
        categoryImage: {
            type: String,
            required: true,
        },
        categoryOrder: {
            type: Number,
            required: [true, "Category order is required"],
        },
        categoryStatus: {
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

const categoryModel = mongoose.model("Category", categorySchema);
module.exports = { categoryModel };