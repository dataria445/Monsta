/**
 * ============================================================================
 * Testimonial Controller
 * ============================================================================
 * 
 * @description Controller for managing customer testimonials and reviews
 * @module controllers/testimonial
 * @requires utils/apiUtils - Async handler, API response and error utilities
 * @requires models/testimonial.model - Testimonial data model
 * 
 * Available Operations:
 * - testimonialCreate: Create a new testimonial with ratings
 * - testimonialView: Retrieve all active testimonials
 * - testimonialUpdate: Update an existing testimonial
 * - testimonialDelete: Soft delete a testimonial
 * - multiDelete: Bulk delete testimonials
 * - changeStatus: Toggle testimonial status (published/unpublished)
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const { asyncHandler, ApiResponse, ApiError } = require("../utils/apiUtils");
const { testimonialModel } = require("../models/testimonial.model");

// ==================== CREATE TESTIMONIAL ====================

const testimonialCreate = asyncHandler(async (req, res) => {
    let { testimonialName, testimonialDesignation, testimonialMessage, testimonialRating, testimonialOrder, testimonialStatus } = req.body;

    // Validate main identity fields
    if (!testimonialName || testimonialName === "" || !testimonialDesignation) {
        throw new ApiError(400, "Name and designation are required");
    }

    // Default message if empty (since rating might be the primary focus)
    const finalMessage = testimonialMessage || "No message provided";
    const finalRating = testimonialRating ? Number(testimonialRating) : 5;

    const order = testimonialOrder ? Number(testimonialOrder) : 0;
    const status = testimonialStatus !== undefined ? (String(testimonialStatus) === "true" || testimonialStatus === true) : true;

    if (!req.file) {
        throw new ApiError(400, "Testimonial image is required");
    }

    const testimonialImageUrl = `/${req.uploadFolder}/${req.file.filename}`;

    const testimonial = await testimonialModel.create({
        testimonialName: testimonialName,
        testimonialDesignation: testimonialDesignation,
        testimonialMessage: finalMessage,
        testimonialRating: finalRating,
        testimonialImageUrl,
        testimonialOrder: order,
        testimonialStatus: status
    });

    return res
        .status(201)
        .json(new ApiResponse(201, testimonial, "Testimonial created successfully"));
});

// ==================== VIEW TESTIMONIALS ====================

const testimonialView = asyncHandler(async (req, res) => {
    const testimonials = await testimonialModel.find({ isDeleted: false }).sort({ testimonialOrder: 1, createdAt: -1 });
    return res
        .status(200)
        .json(new ApiResponse(200, testimonials, "Testimonials retrieved successfully"));
});

// ==================== UPDATE TESTIMONIAL ====================

const testimonialUpdate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let { testimonialName, testimonialDesignation, testimonialMessage, testimonialRating, testimonialOrder, testimonialStatus } = req.body;

    const updateData = {};
    if (testimonialName) updateData.testimonialName = testimonialName;
    if (testimonialDesignation) updateData.testimonialDesignation = testimonialDesignation;
    if (testimonialMessage) updateData.testimonialMessage = testimonialMessage;
    if (testimonialRating !== undefined) updateData.testimonialRating = Number(testimonialRating);
    if (testimonialOrder !== undefined) updateData.testimonialOrder = Number(testimonialOrder);
    if (testimonialStatus !== undefined) updateData.testimonialStatus = (String(testimonialStatus) === "true" || testimonialStatus === true);

    if (req.file) {
        updateData.testimonialImageUrl = `/${req.uploadFolder}/${req.file.filename}`;
    }

    const testimonial = await testimonialModel.findByIdAndUpdate(id, updateData, {
        new: true,
    });

    if (!testimonial) {
        throw new ApiError(404, "Testimonial not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, testimonial, "Testimonial updated successfully"));
});

// ==================== DELETE TESTIMONIAL ====================

const testimonialDelete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const testimonial = await testimonialModel.findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
    );

    if (!testimonial) {
        throw new ApiError(404, "Testimonial not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Testimonial deleted successfully"));
});

// ==================== DELETE MANY TESTIMONIALS ====================

const multiDelete = asyncHandler(async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "Valid array of IDs is required");
    }

    const result = await testimonialModel.updateMany(
        { _id: { $in: ids } },
        { isDeleted: true, deletedAt: new Date() }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount }, "Testimonials deleted successfully"));
});

// ==================== CHANGE STATUS ====================

const changeStatus = asyncHandler(async (req, res) => {
    const { id, ids, status } = req.body;

    if (ids && Array.isArray(ids) && ids.length > 0) {
        const result = await testimonialModel.find({ _id: { $in: ids } });
        const updatePromises = result.map((entry) => {
            return testimonialModel.findByIdAndUpdate(
                entry._id,
                { testimonialStatus: !entry.testimonialStatus },
                { new: true }
            );
        });

        await Promise.all(updatePromises);
        return res.status(200).json(new ApiResponse(200, {}, "Statuses toggled successfully"));
    }

    if (!id) {
        throw new ApiError(400, "ID or IDs are required");
    }

    const currentTestimonial = await testimonialModel.findById(id);
    if (!currentTestimonial) throw new ApiError(404, "Testimonial not found");

    const newStatus = status !== undefined ? (String(status) === "true" || status === true) : !currentTestimonial.testimonialStatus;

    const testimonial = await testimonialModel.findByIdAndUpdate(
        id,
        { testimonialStatus: newStatus },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, testimonial, "Status updated successfully"));
});

// ==================== EXPORTS ====================

module.exports = {
    testimonialCreate,
    testimonialView,
    testimonialUpdate,
    testimonialDelete,
    multiDelete,
    changeStatus,
};
