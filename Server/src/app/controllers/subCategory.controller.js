/**
 * ============================================================================
 * SubCategory Controller
 * ============================================================================
 * 
 * @description Controller for managing product subcategories with parent references
 * @module controllers/subCategory
 * @requires utils/apiUtils - Async handler, API response and error utilities
 * @requires models/subCategory.model - SubCategory data model
 * @requires models/category.model - Category data model for parent references
 * 
 * Available Operations:
 * - subCategoryCreate: Create a new subcategory under a parent category
 * - subCategoryView: Retrieve all active subcategories with parent info
 * - getParentCategory: Get all active parent categories
 * - subCategoryUpdate: Update an existing subcategory
 * - subCategoryDelete: Soft delete a subcategory
 * - multiDelete: Bulk delete subcategories
 * - changeStatus: Toggle subcategory status (active/inactive)
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const { asyncHandler, ApiResponse, ApiError } = require("../utils/apiUtils");
const { subCategoryModel } = require("../models/subCategory.model");
const { categoryModel } = require("../models/category.model");
// ==================== CREATE SUBCATEGORY ====================
const subCategoryCreate = asyncHandler(async (req, res) => {
    let { subCategoryName, parentCategoryId, subCategoryOrder, subCategoryStatus } = req.body;

    if (!subCategoryName || subCategoryName === "" || !parentCategoryId) {
        throw new ApiError(400, "SubCategory name and parent category are required");
    }

    const parentExists = await categoryModel.findOne({ _id: parentCategoryId, isDeleted: false });
    if (!parentExists) {
        throw new ApiError(404, "Parent category not found or has been deleted");
    }

    // Duplicate check for subcategory under the same parent
    const existingSubCategory = await subCategoryModel.findOne({
        subCategoryName: subCategoryName,
        parentCategoryId,
        isDeleted: false
    });
    if (existingSubCategory) {
        throw new ApiError(409, `SubCategory '${subCategoryName}' already exists under this parent category`);
    }

    const order = subCategoryOrder ? Number(subCategoryOrder) : 0;
    const subCategoryImage = `/${req.uploadFolder}/${req.file.filename}`;

    const subCategory = await subCategoryModel.create({
        subCategoryName: subCategoryName,
        parentCategoryId,
        subCategoryImage,
        subCategoryOrder: order,
        subCategoryStatus: subCategoryStatus
    });

    return res
        .status(201)
        .json(new ApiResponse(201, subCategory, "SubCategory created successfully"));
});
// ==================== VIEW SUBCATEGORIES ====================
const subCategoryView = asyncHandler(async (req, res) => {
    let subCategories = await subCategoryModel
        .find({ isDeleted: false })
        .populate("parentCategoryId", "categoryName")
        .sort({ subCategoryOrder: 1, createdAt: -1 })
        .lean();

    // Legacy mapping
    subCategories = subCategories.map(subCat => {
        if (!subCat.subCategoryImage && subCat.subCategoryImageUrl) {
            subCat.subCategoryImage = subCat.subCategoryImageUrl;
        }
        return subCat;
    });

    return res
        .status(200)
        .json(new ApiResponse(200, subCategories, "SubCategories retrieved successfully"));
});

// ==================== GET PARENT CATEGORY ====================

const getParentCategory = asyncHandler(async (req, res) => {
    const categories = await categoryModel.find({ isDeleted: false, categoryStatus: true });
    return res
        .status(200)
        .json(new ApiResponse(200, categories, "Parent categories retrieved successfully"));

});

// ==================== UPDATE SUBCATEGORY ====================

const subCategoryUpdate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let { subCategoryName, parentCategoryId, subCategoryOrder, subCategoryStatus } = req.body;

    if (subCategoryName && parentCategoryId) {
        const existingSubCategory = await subCategoryModel.findOne({
            subCategoryName: subCategoryName,
            parentCategoryId,
            _id: { $ne: id },
            isDeleted: false
        });
        if (existingSubCategory) {
            throw new ApiError(409, `Another subcategory with name '${subCategoryName}' already exists under this parent`);
        }
    }

    const updateData = {};
    if (subCategoryName) updateData.subCategoryName = subCategoryName;
    if (parentCategoryId) updateData.parentCategoryId = parentCategoryId;
    if (subCategoryOrder !== undefined) updateData.subCategoryOrder = Number(subCategoryOrder);
    if (subCategoryStatus !== undefined) updateData.subCategoryStatus = (String(subCategoryStatus) === "true" || subCategoryStatus === true);

    if (req.file) {
        updateData.subCategoryImage = `/${req.uploadFolder}/${req.file.filename}`;
    }

    const subCategory = await subCategoryModel.findByIdAndUpdate(id, updateData, {
        new: true,
    });

    if (!subCategory) {
        throw new ApiError(404, "SubCategory not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, subCategory, "SubCategory updated successfully"));
});
// ==================== DELETE SUBCATEGORY ====================
const subCategoryDelete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subCategory = await subCategoryModel.findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
    );

    if (!subCategory) {
        throw new ApiError(404, "SubCategory not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "SubCategory deleted successfully"));
});
// ==================== DELETE MANY SUBCATEGORIES ====================
const multiDelete = asyncHandler(async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "Valid array of IDs is required");
    }

    const result = await subCategoryModel.updateMany(
        { _id: { $in: ids } },
        { isDeleted: true, deletedAt: new Date() }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount }, "SubCategories deleted successfully"));
});
// ==================== CHANGE STATUS ====================
const changeStatus = asyncHandler(async (req, res) => {
    const { id, ids, status } = req.body;

    if (ids && Array.isArray(ids) && ids.length > 0) {
        const result = await subCategoryModel.find({ _id: { $in: ids } });
        const updatePromises = result.map((subCategory) => {
            return subCategoryModel.findByIdAndUpdate(
                subCategory._id,
                { subCategoryStatus: !subCategory.subCategoryStatus },
                { new: true }
            );
        });

        await Promise.all(updatePromises);
        return res.status(200).json(new ApiResponse(200, {}, "Statuses toggled successfully"));
    }

    if (!id) {
        throw new ApiError(400, "ID or IDs are required");
    }

    const currentSubCategory = await subCategoryModel.findById(id);
    if (!currentSubCategory) throw new ApiError(404, "SubCategory not found");

    const newStatus = status !== undefined ? (String(status) === "true" || status === true) : !currentSubCategory.subCategoryStatus;

    const subCategory = await subCategoryModel.findByIdAndUpdate(
        id,
        { subCategoryStatus: newStatus },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, subCategory, "Status updated successfully"));
});



// ==================== EXPORTS ====================
module.exports = {
    subCategoryCreate,
    subCategoryView,
    getParentCategory,
    subCategoryUpdate,
    subCategoryDelete,
    multiDelete,
    changeStatus,
};
