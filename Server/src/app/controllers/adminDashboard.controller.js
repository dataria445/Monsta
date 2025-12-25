/**
 * ============================================================================
 * Admin Dashboard Controller
 * ============================================================================
 * 
 * @description Controller for managing admin users and dashboard access
 * @module controllers/adminDashboard
 * @requires utils/apiUtils - Async handler, API response and error utilities
 * @requires models/adminDashboard.model - Admin Dashboard data model
 * 
 * Available Operations:
 * - admincreate: Create a new admin user
 * - adminView: Retrieve all active admin users
 * - adminUpdate: Update an existing admin user
 * - multiDelete: Bulk delete admin users
 * - changeStatus: Toggle admin user status (active/inactive)
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const { adminDashboardModel } = require("../models/adminDashboard.model");
const { ApiError, asyncHandler, ApiResponse } = require("../utils/apiUtils");

// ==================== CREATE ADMIN ====================
const admincreate = asyncHandler(async (req, res) => {
  const { dashboardAdminName, dashboardAdminEmail, dashboardAdminMobile } = req.body;

  if (!dashboardAdminName || !dashboardAdminEmail || !dashboardAdminMobile) {
    throw new ApiError(400, "All fields are required");
  }

  const existingAdmin = await adminDashboardModel.findOne({
    $or: [{ dashboardAdminName }, { dashboardAdminEmail }]
  });

  if (existingAdmin) {
    throw new ApiError(409, "Admin with this name or email already exists");
  }

  const admin = await adminDashboardModel.create({
    dashboardAdminName,
    dashboardAdminEmail,
    dashboardAdminMobile,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, admin, "Admin created successfully"));
});

// ==================== VIEW ADMINS ====================
const adminView = asyncHandler(async (req, res) => {
  const admins = await adminDashboardModel
    .find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, admins, "Admins retrieved successfully"));
});

// ==================== UPDATE ADMIN ====================
const adminUpdate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { dashboardAdminName, dashboardAdminEmail, dashboardAdminMobile, dashboardAdminStatus } = req.body;

  const admin = await adminDashboardModel.findByIdAndUpdate(
    id,
    { dashboardAdminName, dashboardAdminEmail, dashboardAdminMobile, dashboardAdminStatus },
    { new: true }
  );

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, admin, "Admin updated successfully"));
});

// ==================== DELETE MANY ADMINS ====================
const multiDelete = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Valid non-empty 'ids' array is required");
  }

  await adminDashboardModel.updateMany(
    { _id: { $in: ids } },
    { isDeleted: true, deletedAt: new Date() }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Admins deleted successfully"));
});

// ==================== CHANGE STATUS ====================
const changeStatus = asyncHandler(async (req, res) => {
  const { id, ids, status } = req.body;

  if (ids && Array.isArray(ids) && ids.length > 0) {
    const result = await adminDashboardModel.find({ _id: { $in: ids } });
    const updatePromises = result.map((admin) => {
      return adminDashboardModel.findByIdAndUpdate(
        admin._id,
        { dashboardAdminStatus: !admin.dashboardAdminStatus },
        { new: true }
      );
    });
    await Promise.all(updatePromises);
    return res.status(200).json(new ApiResponse(200, {}, "Statuses updated successfully"));
  }

  if (!id) {
    throw new ApiError(400, "ID or IDs are required");
  }

  const admin = await adminDashboardModel.findByIdAndUpdate(
    id,
    { dashboardAdminStatus: status },
    { new: true }
  );

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, admin, "Status updated successfully"));
});

// ==================== EXPORTS ====================
module.exports = { admincreate, adminView, adminUpdate, multiDelete, changeStatus };
