/**
 * ============================================================================
 * Color Controller
 * ============================================================================
 *
 * @description Controller for managing product color options
 * @module controllers/color
 * @requires utils/apiUtils - Async handler, API response and error utilities
 * @requires models/color.model - Color data model
 *
 * Available Operations:
 * - colorCreate: Create a new color with name and hex code
 * - colorView: Retrieve all active colors
 * - colorUpdate: Update an existing color
 * - colorDelete: Soft delete a color
 * - multiDelete: Bulk delete colors
 * - changeStatus: Toggle color status (active/inactive)
 *
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const { asyncHandler, ApiResponse, ApiError } = require("../utils/apiUtils");
const { colorModel } = require("../models/color.model");

// ==================== CREATE COLOR ====================
const colorCreate = asyncHandler(async (req, res) => {
  let { colorName, colorCode, colorOrder, colorStatus } = req.body;

  if (!colorName || colorName === "" || !colorCode) {
    throw new ApiError(400, "Color name and code are required");
  }

  const existingColor = await colorModel.findOne({
    $or: [{ colorName: colorName }, { colorCode: colorCode }],
    isDeleted: false,
  });

  if (existingColor) {
    throw new ApiError(
      409,
      `Color with name '${colorName}' or code '${colorCode}' already exists`
    );
  }

  const order = colorOrder ? Number(colorOrder) : 0;
  const status =
    colorStatus !== undefined
      ? String(colorStatus) === "true" || colorStatus === true
      : true;

  const color = await colorModel.create({
    colorName: colorName,
    colorCode: colorCode,
    colorOrder: order,
    colorStatus: status,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, color, "Color created successfully"));
});

// ==================== VIEW COLORS ====================

const colorView = asyncHandler(async (req, res) => {
  const colors = await colorModel
    .find({ isDeleted: false, deletedAt: null })
    .sort({ colorOrder: 1, createdAt: -1 })
    .lean();

  res
    .status(200)
    .json(new ApiResponse(200, colors, "Colors retrieved successfully"));
});

// ==================== UPDATE COLOR ====================

const colorUpdate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let { colorName, colorCode, colorOrder, colorStatus } = req.body;

  console.log(id);

  if (colorName || colorCode) {
    const existingColor = await colorModel.findOne({
      $or: { colorName, colorCode },
      _id: { $ne: id },
      isDeleted: false,
    });
    if (existingColor) {
      throw new ApiError(
        409,
        `Another color with this name or code already exists`
      );
    }
  }

  const updateData = {};
  if (colorName) updateData.colorName = colorName;
  if (colorCode) updateData.colorCode = colorCode;
  if (colorOrder !== undefined) updateData.colorOrder = Number(colorOrder);
  if (colorStatus !== undefined)
    updateData.colorStatus =
      String(colorStatus) === "true" || colorStatus === true;

  const color = await colorModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!color) {
    throw new ApiError(404, "Color not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, color, "Color updated successfully"));
});

// ==================== DELETE COLOR ====================
const colorDelete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const color = await colorModel.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );

  if (!color) {
    throw new ApiError(404, "Color not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Color deleted successfully"));
});

// ==================== DELETE MANY COLORS ====================
const multiDelete = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Valid array of IDs is required");
  }

  const result = await colorModel.updateMany(
    { _id: { $in: ids } },
    { isDeleted: true, deletedAt: new Date() }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
      "Colors deleted successfully"
    )
  );
});

// ==================== CHANGE STATUS ====================
const changeStatus = asyncHandler(async (req, res) => {
  const {id,ids,status } = req.body;

  if (ids && Array.isArray(ids) && ids.length > 0) {
    const result = await colorModel.find({ _id: { $in: ids } });
    console.log(result);

    const updatePromises = result.map((color) => {
      return colorModel.findByIdAndUpdate(
        color._id,
        { colorStatus: !color.colorStatus },
        { new: true }
      );
    });

    await Promise.all(updatePromises);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Statuses toggled successfully"));
  }

  if (!id) {
    throw new ApiError(400, "ID or IDs are required");
  }

  const currentColor = await colorModel.findById(id);
  if (!currentColor) throw new ApiError(404, "Color not found");

  const newStatus =
    status !== undefined
      ? String(status) === "true" || status === true
      : !currentColor.colorStatus;

  const color = await colorModel.findByIdAndUpdate(
    id,
    { colorStatus: newStatus },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, color, "Status updated successfully"));
});

// ==================== EXPORTS ====================
module.exports = {
  colorCreate,
  colorView,
  colorUpdate,
  colorDelete,
  multiDelete,
  changeStatus,
};
