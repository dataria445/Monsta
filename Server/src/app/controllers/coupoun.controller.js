/**
 * ============================================================================
 * Coupon Controller
 * ============================================================================
 * 
 * @description Controller for managing discount coupons with validity periods
 * @module controllers/coupoun
 * @requires utils/apiUtils - Async handler, API response and error utilities
 * @requires models/coupoun.model - Coupon data model
 * 
 * Available Operations:
 * - coupounCreate: Create a new coupon with discount rules
 * - coupounView: Retrieve all active coupons
 * - coupounUpdate: Update an existing coupon
 * - coupounDelete: Soft delete a coupon
 * - multiDelete: Bulk delete coupons
 * - changeStatus: Toggle coupon status (active/inactive)
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const { asyncHandler, ApiResponse, ApiError } = require("../utils/apiUtils");
const { coupounModel } = require("../models/coupoun.model");
// ==================== CREATE COUPON ====================
const coupounCreate = asyncHandler(async (req, res) => {
    // Note: If sending from frontend as JSON, ensure it's parsed correctly.
    // However, since we use multer for images, this might come as strings in req.body.
    let {
        coupounName,
        coupounCode,
        coupounDiscountPercent,
        coupounPriceRange,
        coupounValidBetween,
        coupounOrder,
        coupounStatus
    } = req.body;

    // Handle nested objects if they come as strings (common with multipart/form-data)
    if (typeof coupounPriceRange === 'string') {
        try { coupounPriceRange = JSON.parse(coupounPriceRange); } catch (e) { }
    }
    if (typeof coupounValidBetween === 'string') {
        try { coupounValidBetween = JSON.parse(coupounValidBetween); } catch (e) { }
    }

    if (!coupounName || !coupounCode || !coupounDiscountPercent || !coupounPriceRange || !coupounValidBetween) {
        throw new ApiError(400, "All coupon fields (name, code, discount, price range, validity) are required");
    }

    const existingCoupon = await coupounModel.findOne({ coupounCode: coupounCode, isDeleted: false });
    if (existingCoupon) {
        throw new ApiError(409, `Coupon code '${coupounCode}' already exists`);
    }

    const order = coupounOrder ? Number(coupounOrder) : 0;
    const status = coupounStatus !== undefined ? (String(coupounStatus) === "true" || coupounStatus === true) : true;

    // Handle image upload like slider
    let coupounImageUrl = "";
    if (req.file) {
        coupounImageUrl = `/${req.uploadFolder}/${req.file.filename}`;
    }

    const coupoun = await coupounModel.create({
        coupounName,
        coupounCode,
        coupounDiscountPercent: Number(coupounDiscountPercent),
        coupounPriceRange,
        coupounValidBetween,
        coupounImageUrl,
        coupounOrder: order,
        coupounStatus: status
    });

    return res
        .status(201)
        .json(new ApiResponse(201, coupoun, "Coupon created successfully"));
});
// ==================== VIEW COUPONS ====================
const coupounView = asyncHandler(async (req, res) => {
    const { search } = req.query;
    const filter = { isDeleted: { $in: [false, null] } };

    // Search filter: Case-insensitive partial match on name/code or exact match on coupounOrder
    if (search) {
        filter.$or = [
            { coupounName: { $regex: search, $options: "i" } },
            { coupounCode: { $regex: search, $options: "i" } },
        ];
        if (!isNaN(search) && search.trim() !== "") {
            filter.$or.push({ coupounOrder: Number(search) });
        }
    }

    const coupouns = await coupounModel.find(filter).sort({ coupounOrder: 1, createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, coupouns, "Coupons retrieved successfully"));
});
// ==================== UPDATE COUPON ====================
const coupounUpdate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let {
        coupounName,
        coupounCode,
        coupounDiscountPercent,
        coupounPriceRange,
        coupounValidBetween,
        coupounOrder,
        coupounStatus
    } = req.body;

    // Handle nested objects if they come as strings
    if (typeof coupounPriceRange === 'string') {
        try { coupounPriceRange = JSON.parse(coupounPriceRange); } catch (e) { }
    }
    if (typeof coupounValidBetween === 'string') {
        try { coupounValidBetween = JSON.parse(coupounValidBetween); } catch (e) { }
    }

    if (coupounCode) {
        const existingCoupon = await coupounModel.findOne({
            coupounCode: coupounCode,
            _id: { $ne: id },
            isDeleted: false
        });
        if (existingCoupon) {
            throw new ApiError(409, `Another coupon with code '${coupounCode}' already exists`);
        }
    }

    const updateData = {};
    if (coupounName) updateData.coupounName = coupounName;
    if (coupounCode) updateData.coupounCode = coupounCode;
    if (coupounDiscountPercent !== undefined) updateData.coupounDiscountPercent = Number(coupounDiscountPercent);
    if (coupounPriceRange) updateData.coupounPriceRange = coupounPriceRange;
    if (coupounValidBetween) updateData.coupounValidBetween = coupounValidBetween;
    if (coupounOrder !== undefined) updateData.coupounOrder = Number(coupounOrder);
    if (coupounStatus !== undefined) updateData.coupounStatus = (String(coupounStatus) === "true" || coupounStatus === true);

    // Handle image update like slider
    if (req.file) {
        updateData.coupounImageUrl = `/${req.uploadFolder}/${req.file.filename}`;
    }

    const coupoun = await coupounModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!coupoun) {
        throw new ApiError(404, "Coupon not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, coupoun, "Coupon updated successfully"));
});
// ==================== DELETE COUPON ====================
const coupounDelete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const coupoun = await coupounModel.findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
    );

    if (!coupoun) {
        throw new ApiError(404, "Coupon not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Coupon deleted successfully"));
});
// ==================== DELETE MANY COUPONS ====================
const multiDelete = asyncHandler(async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "Valid array of IDs is required");
    }

    const result = await coupounModel.updateMany(
        { _id: { $in: ids } },
        { isDeleted: true, deletedAt: new Date() }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount }, "Coupons deleted successfully"));
});
// ==================== CHANGE STATUS ====================
const changeStatus = asyncHandler(async (req, res) => {
    const { id, ids, status } = req.body;

    if (ids && Array.isArray(ids) && ids.length > 0) {
        const result = await coupounModel.find({ _id: { $in: ids } });
        const updatePromises = result.map((coupon) => {
            return coupounModel.findByIdAndUpdate(
                coupon._id,
                { coupounStatus: !coupon.coupounStatus },
                { new: true }
            );
        });

        await Promise.all(updatePromises);
        return res.status(200).json(new ApiResponse(200, {}, "Statuses toggled successfully"));
    }

    if (!id) {
        throw new ApiError(400, "ID or IDs are required");
    }

    const currentCoupon = await coupounModel.findById(id);
    if (!currentCoupon) throw new ApiError(404, "Coupon not found");

    const newStatus = status !== undefined ? (String(status) === "true" || status === true) : !currentCoupon.coupounStatus;

    const coupoun = await coupounModel.findByIdAndUpdate(
        id,
        { coupounStatus: newStatus },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, coupoun, "Status updated successfully"));
});
// ==================== EXPORTS ====================
module.exports = {
    coupounCreate,
    coupounView,
    coupounUpdate,
    coupounDelete,
    multiDelete,
    changeStatus,
};
