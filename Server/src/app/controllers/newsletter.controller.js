/**
 * ============================================================================
 * Newsletter Controller
 * ============================================================================
 * 
 * @description Controller for managing newsletter subscriptions
 * @module controllers/newsletter
 * @requires utils/apiUtils - Async handler, API response and error utilities
 * @requires models/newsletter.model - Newsletter subscription data model
 * 
 * Available Operations:
 * - newsletterCreate: Subscribe a new email to newsletter
 * - newsletterView: Retrieve all newsletter subscriptions
 * - newsletterUpdate: Update a newsletter subscription
 * - newsletterDelete: Soft delete a subscription
 * - multiDelete: Bulk delete subscriptions
 * - changeStatus: Toggle subscription status (active/inactive)
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const { asyncHandler, ApiResponse, ApiError } = require("../utils/apiUtils");
const { newsletterModel } = require("../models/newsletter.model");
// ==================== CREATE NEWSLETTER ====================
const newsletterCreate = asyncHandler(async (req, res) => {
    let { newsletterEmail, newsletterStatus } = req.body;

    if (!newsletterEmail || newsletterEmail === "") {
        throw new ApiError(400, "Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
        throw new ApiError(400, "Invalid email format");
    }

    const existingNewsletter = await newsletterModel.findOne({ newsletterEmail: newsletterEmail, isDeleted: false });
    if (existingNewsletter) {
        throw new ApiError(409, `Email '${newsletterEmail}' is already subscribed`);
    }

    const status = newsletterStatus !== undefined ? (String(newsletterStatus) === "true" || newsletterStatus === true) : true;

    const newsletter = await newsletterModel.create({
        newsletterEmail: newsletterEmail,
        newsletterStatus: status
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newsletter, "Newsletter subscription successful"));
});
// ==================== VIEW NEWSLETTERS ====================
const newsletterView = asyncHandler(async (req, res) => {
    const { search } = req.query;
    const filter = { isDeleted: { $in: [false, null] } };

    // Search filter: Case-insensitive partial match on newsletterEmail
    if (search) {
        filter.newsletterEmail = { $regex: search, $options: "i" };
    }

    const newsletters = await newsletterModel.find(filter).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, newsletters, "Newsletter subscribers retrieved successfully"));
});
// ==================== UPDATE NEWSLETTER ====================
const newsletterUpdate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let { newsletterEmail, newsletterStatus } = req.body;

    if (newsletterEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newsletterEmail)) {
            throw new ApiError(400, "Invalid email format");
        }

        const existingNewsletter = await newsletterModel.findOne({
            newsletterEmail: newsletterEmail,
            _id: { $ne: id },
            isDeleted: false
        });
        if (existingNewsletter) {
            throw new ApiError(409, `Another subscription with email '${newsletterEmail}' already exists`);
        }
    }

    const updateData = {};
    if (newsletterEmail) updateData.newsletterEmail = newsletterEmail;
    if (newsletterStatus !== undefined) updateData.newsletterStatus = (String(newsletterStatus) === "true" || newsletterStatus === true);

    const newsletter = await newsletterModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!newsletter) {
        throw new ApiError(404, "Newsletter subscription not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, newsletter, "Newsletter subscription updated successfully"));
});
// ==================== DELETE NEWSLETTER ====================
const newsletterDelete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const newsletter = await newsletterModel.findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
    );

    if (!newsletter) {
        throw new ApiError(404, "Newsletter subscription not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Newsletter subscription deleted successfully"));
});
// ==================== DELETE MANY NEWSLETTERS ====================
const multiDelete = asyncHandler(async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "Valid array of IDs is required");
    }

    const result = await newsletterModel.updateMany(
        { _id: { $in: ids } },
        { isDeleted: true, deletedAt: new Date() }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount }, "Newsletter subscriptions deleted successfully"));
});
// ==================== CHANGE STATUS ====================
const changeStatus = asyncHandler(async (req, res) => {
    const { id, ids, status } = req.body;

    if (ids && Array.isArray(ids) && ids.length > 0) {
        const result = await newsletterModel.find({ _id: { $in: ids } });
        const updatePromises = result.map((sub) => {
            return newsletterModel.findByIdAndUpdate(
                sub._id,
                { newsletterStatus: !sub.newsletterStatus },
                { new: true }
            );
        });

        await Promise.all(updatePromises);
        return res.status(200).json(new ApiResponse(200, {}, "Statuses toggled successfully"));
    }

    if (!id) {
        throw new ApiError(400, "ID or IDs are required");
    }

    const currentSub = await newsletterModel.findById(id);
    if (!currentSub) throw new ApiError(404, "Newsletter subscription not found");

    const newStatus = status !== undefined ? (String(status) === "true" || status === true) : !currentSub.newsletterStatus;

    const newsletter = await newsletterModel.findByIdAndUpdate(
        id,
        { newsletterStatus: newStatus },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, newsletter, "Status updated successfully"));
});
// ==================== EXPORTS ====================
module.exports = {
    newsletterCreate,
    newsletterView,
    newsletterUpdate,
    newsletterDelete,
    multiDelete,
    changeStatus,
};
