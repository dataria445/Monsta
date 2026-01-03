/**
 * ============================================================================
 * FAQ Controller
 * ============================================================================
 * 
 * @description Controller for managing Frequently Asked Questions (FAQs)
 * @module controllers/faq
 * @requires utils/apiUtils - Async handler, API response and error utilities
 * @requires models/faq.model - FAQ data model
 * 
 * Available Operations:
 * - faqCreate: Create a new FAQ entry
 * - faqView: Retrieve all active FAQs
 * - faqUpdate: Update an existing FAQ
 * - faqDelete: Soft delete a FAQ
 * - multiDelete: Bulk delete FAQs
 * - changeStatus: Toggle FAQ status (active/inactive)
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const { asyncHandler, ApiResponse, ApiError } = require("../utils/apiUtils");
const { faqModel } = require("../models/faq.model");
// ==================== CREATE FAQ ====================
const faqCreate = asyncHandler(async (req, res) => {
  let { faqQuestion, faqAnswer, faqOrder, faqStatus, question, answer } =
    req.body;

  // Support both naming conventions from frontend
  faqQuestion = faqQuestion || question;
  faqAnswer = faqAnswer || answer;

  if (!faqQuestion || faqQuestion === "" || !faqAnswer) {
    throw new ApiError(400, "FAQ question and answer are required");
  }

  const existingFaq = await faqModel.findOne({
    faqQuestion: faqQuestion,
    isDeleted: false,
  });
  if (existingFaq) {
    throw new ApiError(409, `FAQ with this question already exists`);
  }

  const order = faqOrder ? Number(faqOrder) : 0;
  const status =
    faqStatus !== undefined
      ? String(faqStatus) === "true" || faqStatus === true
      : true;

  const faq = await faqModel.create({
    faqQuestion: faqQuestion,
    faqAnswer: faqAnswer,
    faqOrder: order,
    faqStatus: status,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, faq, "FAQ created successfully"));
});
// ==================== VIEW FAQS ====================
const faqView = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = { isDeleted: { $in: [false, null] } };

  // Search filter: Case-insensitive partial match on faqQuestion, answer or exact match on faqOrder
  if (search) {
    filter.$or = [
      { faqQuestion: { $regex: search, $options: "i" } },
      { faqAnswer: { $regex: search, $options: "i" } },
    ];
    if (!isNaN(search) && search.trim() !== "") {
      filter.$or.push({ faqOrder: Number(search) });
    }
  }

  const faqs = await faqModel
    .find(filter)
    .sort({ faqOrder: 1, createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, faqs, "FAQs retrieved successfully"));
});
// ==================== UPDATE FAQ ====================
const faqUpdate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let { faqQuestion, faqAnswer, faqOrder, faqStatus, question, answer } =
    req.body;

  faqQuestion = faqQuestion || question;
  faqAnswer = faqAnswer || answer;

  if (faqQuestion) {
    const existingFaq = await faqModel.findOne({
      faqQuestion: faqQuestion,
      _id: { $ne: id },
      isDeleted: false,
    });
    if (existingFaq) {
      throw new ApiError(409, `Another FAQ with this question already exists`);
    }
  }

  const updateData = {};
  if (faqQuestion) updateData.faqQuestion = faqQuestion;
  if (faqAnswer) updateData.faqAnswer = faqAnswer;
  if (faqOrder !== undefined) updateData.faqOrder = Number(faqOrder);
  if (faqStatus !== undefined)
    updateData.faqStatus = String(faqStatus) === "true" || faqStatus === true;

  const faq = await faqModel.findByIdAndUpdate(id, updateData, { new: true });

  if (!faq) {
    throw new ApiError(404, "FAQ not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, faq, "FAQ updated successfully"));
});
// ==================== DELETE FAQ ====================
const faqDelete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const faq = await faqModel.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );

  if (!faq) {
    throw new ApiError(404, "FAQ not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "FAQ deleted successfully"));
});
// ==================== DELETE MANY FAQS ====================
const multiDelete = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Valid array of IDs is required");
  }

  const result = await faqModel.updateMany(
    { _id: { $in: ids } },
    { isDeleted: true, deletedAt: new Date() }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
        },
        "FAQs deleted successfully"
      )
    );
});
// ==================== CHANGE STATUS ====================
const changeStatus = asyncHandler(async (req, res) => {
  const { id, ids, status } = req.body;

  if (ids && Array.isArray(ids) && ids.length > 0) {
    const result = await faqModel.find({ _id: { $in: ids } });
    const updatePromises = result.map((faq) => {
      return faqModel.findByIdAndUpdate(
        faq._id,
        { faqStatus: !faq.faqStatus },
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

  const currentFaq = await faqModel.findById(id);
  if (!currentFaq) throw new ApiError(404, "FAQ not found");

  const newStatus =
    status !== undefined
      ? String(status) === "true" || status === true
      : !currentFaq.faqStatus;

  const faq = await faqModel.findByIdAndUpdate(
    id,
    { faqStatus: newStatus },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, faq, "Status updated successfully"));
});

// ==================== EXPORTS ====================
module.exports = {
  faqCreate,
  faqView,
  faqUpdate,
  faqDelete,
  multiDelete,
  changeStatus,
};
