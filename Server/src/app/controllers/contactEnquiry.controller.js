/**
 * ============================================================================
 * Contact Enquiry Controller
 * ============================================================================
 * 
 * @description Controller for managing customer contact form submissions
 * @module controllers/contactEnquiry
 * @requires utils/apiUtils - Async handler, API response and error utilities
 * @requires models/contactEnquiry.model - Contact Enquiry data model
 * 
 * Available Operations:
 * - contactEnquiryCreate: Create a new contact enquiry
 * - contactEnquiryView: Retrieve all contact enquiries
 * - contactEnquiryUpdate: Update an existing enquiry
 * - contactEnquiryDelete: Soft delete an enquiry
 * - multiDelete: Bulk delete enquiries
 * - changeStatus: Toggle enquiry status (read/unread)
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const { asyncHandler, ApiResponse, ApiError } = require("../utils/apiUtils");
const { contactEnquiryModel } = require("../models/contactEnquiry.model");
// ==================== CREATE CONTACT ENQUIRY ====================
const contactEnquiryCreate = asyncHandler(async (req, res) => {
    let { contactName, contactEmail, contactPhone, contactMessage } = req.body;

    if (!contactName || contactName === "" || !contactEmail || !contactPhone || !contactMessage) {
        throw new ApiError(400, "All fields (name, email, phone, message) are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
        throw new ApiError(400, "Invalid email format");
    }

    const contactEnquiry = await contactEnquiryModel.create({
        contactName: contactName,
        contactEmail: contactEmail,
        contactPhone: contactPhone,
        contactMessage: contactMessage,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, contactEnquiry, "Contact enquiry submitted successfully"));
});
// ==================== VIEW CONTACT ENQUIRIES ====================
const contactEnquiryView = asyncHandler(async (req, res) => {
    const { search } = req.query;
    const filter = { isDeleted: { $in: [false, null] } };

    // Search filter: Case-insensitive partial match on contactName, email, phone, or message
    if (search) {
        filter.$or = [
            { contactName: { $regex: search, $options: "i" } },
            { contactEmail: { $regex: search, $options: "i" } },
            { contactPhone: { $regex: search, $options: "i" } },
            { contactMessage: { $regex: search, $options: "i" } },
        ];
    }

    const contactEnquiries = await contactEnquiryModel.find(filter).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, contactEnquiries, "Contact enquiries retrieved successfully"));
});
// ==================== UPDATE CONTACT ENQUIRY ====================
const contactEnquiryUpdate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let { contactName, contactEmail, contactPhone, contactMessage, contactStatus } = req.body;

    const updateData = {};
    if (contactName) updateData.contactName = contactName;
    if (contactEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail)) throw new ApiError(400, "Invalid email format");
        updateData.contactEmail = contactEmail;
    }
    if (contactPhone) updateData.contactPhone = contactPhone;
    if (contactMessage) updateData.contactMessage = contactMessage;
    if (contactStatus !== undefined) updateData.contactStatus = (String(contactStatus) === "true" || contactStatus === true);

    const contactEnquiry = await contactEnquiryModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!contactEnquiry) {
        throw new ApiError(404, "Contact enquiry not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, contactEnquiry, "Contact enquiry updated successfully"));
});
// ==================== DELETE CONTACT ENQUIRY ====================
const contactEnquiryDelete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const contactEnquiry = await contactEnquiryModel.findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
    );

    if (!contactEnquiry) {
        throw new ApiError(404, "Contact enquiry not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Contact enquiry deleted successfully"));
});
// ==================== DELETE MANY CONTACT ENQUIRIES ====================
const multiDelete = asyncHandler(async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "Valid array of IDs is required");
    }

    const result = await contactEnquiryModel.updateMany(
        { _id: { $in: ids } },
        { isDeleted: true, deletedAt: new Date() }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount }, "Contact enquiries deleted successfully"));
});
// ==================== CHANGE STATUS ====================
const changeStatus = asyncHandler(async (req, res) => {
    const { id, ids, status } = req.body;

    if (ids && Array.isArray(ids) && ids.length > 0) {
        const result = await contactEnquiryModel.find({ _id: { $in: ids } });
        const updatePromises = result.map((enquiry) => {
            return contactEnquiryModel.findByIdAndUpdate(
                enquiry._id,
                { contactStatus: !enquiry.contactStatus },
                { new: true }
            );
        });

        await Promise.all(updatePromises);
        return res.status(200).json(new ApiResponse(200, {}, "Statuses toggled successfully"));
    }

    if (!id) {
        throw new ApiError(400, "ID or IDs are required");
    }

    const currentEnquiry = await contactEnquiryModel.findById(id);
    if (!currentEnquiry) throw new ApiError(404, "Contact enquiry not found");

    const newStatus = status !== undefined ? (String(status) === "true" || status === true) : !currentEnquiry.contactStatus;

    const contactEnquiry = await contactEnquiryModel.findByIdAndUpdate(
        id,
        { contactStatus: newStatus },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, contactEnquiry, "Status updated successfully"));
});
// ==================== EXPORTS ====================
module.exports = {
    contactEnquiryCreate,
    contactEnquiryView,
    contactEnquiryUpdate,
    contactEnquiryDelete,
    multiDelete,
    changeStatus,
};
