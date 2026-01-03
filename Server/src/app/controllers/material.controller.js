/**
 * ============================================================================
 * Material Controller
 * ============================================================================
 * 
 * @description Controller for managing product materials
 * @module controllers/material
 * @requires utils/apiUtils - Async handler, API response and error utilities
 * @requires models/material.model - Material data model
 * 
 * Available Operations:
 * - materialCreate: Create a new material type
 * - materialView: Retrieve all active materials
 * - materialUpdate: Update an existing material
 * - materialDelete: Soft delete a material
 * - multiDelete: Bulk delete materials
 * - changeStatus: Toggle material status (active/inactive)
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const { asyncHandler, ApiResponse, ApiError } = require("../utils/apiUtils");
const { materialModel } = require("../models/material.model");
// ==================== CREATE MATERIAL ====================
const materialCreate = asyncHandler(async (req, res) => {
    let { materialName, materialOrder, materialStatus } = req.body;

    if (!materialName || materialName === "") {
        throw new ApiError(400, "Material name is required");
    }

    const existingMaterial = await materialModel.findOne({ materialName: materialName, isDeleted: false });
    if (existingMaterial) {
        throw new ApiError(409, `Material with name '${materialName}' already exists`);
    }

    const order = materialOrder ? Number(materialOrder) : 0;
    const status = materialStatus !== undefined ? (String(materialStatus) === "true" || materialStatus === true) : true;

    const material = await materialModel.create({
        materialName: materialName,
        materialOrder: order,
        materialStatus: status
    });

    return res
        .status(201)
        .json(new ApiResponse(201, material, "Material created successfully"));
});
// ==================== VIEW MATERIALS ====================
const materialView = asyncHandler(async (req, res) => {
    const { search } = req.query;
    const filter = { isDeleted: { $in: [false, null] } };

    // Search filter: Case-insensitive partial match on materialName or exact match on materialOrder
    if (search) {
        filter.$or = [{ materialName: { $regex: search, $options: "i" } }];
        if (!isNaN(search) && search.trim() !== "") {
            filter.$or.push({ materialOrder: Number(search) });
        }
    }

    const materials = await materialModel.find(filter).sort({ materialOrder: 1, createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, materials, "Materials retrieved successfully"));
});
// ==================== UPDATE MATERIAL ====================
const materialUpdate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let { materialName, materialOrder, materialStatus } = req.body;

    if (materialName) {
        const existingMaterial = await materialModel.findOne({
            materialName: materialName,
            _id: { $ne: id },
            isDeleted: false
        });
        if (existingMaterial) {
            throw new ApiError(409, `Another material with name '${materialName}' already exists`);
        }
    }

    const updateData = {};
    if (materialName) updateData.materialName = materialName;
    if (materialOrder !== undefined) updateData.materialOrder = Number(materialOrder);
    if (materialStatus !== undefined) updateData.materialStatus = (String(materialStatus) === "true" || materialStatus === true);

    const material = await materialModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!material) {
        throw new ApiError(404, "Material not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, material, "Material updated successfully"));
});
// ==================== DELETE MATERIAL ====================
const materialDelete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const material = await materialModel.findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
    );

    if (!material) {
        throw new ApiError(404, "Material not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Material deleted successfully"));
});
// ==================== DELETE MANY MATERIALS ====================
const multiDelete = asyncHandler(async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "Valid array of IDs is required");
    }

    const result = await materialModel.updateMany(
        { _id: { $in: ids } },
        { isDeleted: true, deletedAt: new Date() }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount }, "Materials deleted successfully"));
});
// ==================== CHANGE STATUS ====================
const changeStatus = asyncHandler(async (req, res) => {
    const { id, ids, status } = req.body;

    if (ids && Array.isArray(ids) && ids.length > 0) {
        const result = await materialModel.find({ _id: { $in: ids } });
        const updatePromises = result.map((material) => {
            return materialModel.findByIdAndUpdate(
                material._id,
                { materialStatus: !material.materialStatus },
                { new: true }
            );
        });

        await Promise.all(updatePromises);
        return res.status(200).json(new ApiResponse(200, {}, "Statuses toggled successfully"));
    }

    if (!id) {
        throw new ApiError(400, "ID or IDs are required");
    }

    const currentMaterial = await materialModel.findById(id);
    if (!currentMaterial) throw new ApiError(404, "Material not found");

    const newStatus = status !== undefined ? (String(status) === "true" || status === true) : !currentMaterial.materialStatus;

    const material = await materialModel.findByIdAndUpdate(
        id,
        { materialStatus: newStatus },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, material, "Status updated successfully"));
});
// ==================== EXPORTS ====================
module.exports = {
    materialCreate,
    materialView,
    materialUpdate,
    materialDelete,
    multiDelete,
    changeStatus,
};
