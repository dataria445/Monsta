/**
 * ============================================================================
 * Country Controller
 * ============================================================================
 * 
 * @description Controller for managing country data
 * @module controllers/country
 * @requires utils/apiUtils - Async handler, API response and error utilities
 * @requires models/country.model - Country data model
 * 
 * Available Operations:
 * - countryCreate: Create a new country entry
 * - countryView: Retrieve all active countries
 * - countryUpdate: Update an existing country
 * - countryDelete: Soft delete a country
 * - multiDelete: Bulk delete countries
 * - changeStatus: Toggle country status (active/inactive)
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const { asyncHandler, ApiResponse, ApiError } = require("../utils/apiUtils");
const { countryModel } = require("../models/country.model");

// ==================== CREATE COUNTRY ====================
const countryCreate = asyncHandler(async (req, res) => {
    let { countryName, countryOrder, countryStatus } = req.body;

    if (!countryName || countryName === "") {
        throw new ApiError(400, "Country name is required");
    }

    const existingCountry = await countryModel.findOne({ countryName: countryName, isDeleted: false });
    if (existingCountry) {
        throw new ApiError(409, `Country with name '${countryName}' already exists`);
    }

    const order = countryOrder ? Number(countryOrder) : 0;
    const status = countryStatus !== undefined ? (String(countryStatus) === "true" || countryStatus === true) : true;

    const country = await countryModel.create({
        countryName: countryName,
        countryOrder: order,
        countryStatus: status
    });

    return res
        .status(201)
        .json(new ApiResponse(201, country, "Country created successfully"));
});

// ==================== VIEW COUNTRIES ====================
const countryView = asyncHandler(async (req, res) => {
    const countries = await countryModel
        .find({ isDeleted: false })
        .sort({ countryOrder: 1, createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, countries, "Countries retrieved successfully"));
});

// ==================== UPDATE COUNTRY ====================
const countryUpdate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let { countryName, countryOrder, countryStatus } = req.body;

    if (countryName) {
        const existingCountry = await countryModel.findOne({
            countryName: countryName,
            _id: { $ne: id },
            isDeleted: false
        });
        if (existingCountry) {
            throw new ApiError(409, `Another country with name '${countryName}' already exists`);
        }
    }

    const updateData = {};
    if (countryName) updateData.countryName = countryName;
    if (countryOrder !== undefined) updateData.countryOrder = Number(countryOrder);
    if (countryStatus !== undefined) updateData.countryStatus = (String(countryStatus) === "true" || countryStatus === true);

    const country = await countryModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!country) {
        throw new ApiError(404, "Country not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, country, "Country updated successfully"));
});

// ==================== DELETE COUNTRY ====================
const countryDelete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const country = await countryModel.findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
    );

    if (!country) {
        throw new ApiError(404, "Country not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Country deleted successfully"));
});

// ==================== DELETE MANY COUNTRIES ====================
const multiDelete = asyncHandler(async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "Valid array of IDs is required");
    }

    const result = await countryModel.updateMany(
        { _id: { $in: ids } },
        { isDeleted: true, deletedAt: new Date() }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount }, "Countries deleted successfully"));
});

// ==================== CHANGE STATUS ====================
const changeStatus = asyncHandler(async (req, res) => {
    const { id, ids, status } = req.body;

    if (ids && Array.isArray(ids) && ids.length > 0) {
        const result = await countryModel.find({ _id: { $in: ids } });
        const updatePromises = result.map((country) => {
            return countryModel.findByIdAndUpdate(
                country._id,
                { countryStatus: !country.countryStatus },
                { new: true }
            );
        });

        await Promise.all(updatePromises);
        return res.status(200).json(new ApiResponse(200, {}, "Statuses toggled successfully"));
    }

    if (!id) {
        throw new ApiError(400, "ID or IDs are required");
    }

    const currentCountry = await countryModel.findById(id);
    if (!currentCountry) throw new ApiError(404, "Country not found");

    const newStatus = status !== undefined ? (String(status) === "true" || status === true) : !currentCountry.countryStatus;

    const country = await countryModel.findByIdAndUpdate(
        id,
        { countryStatus: newStatus },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, country, "Status updated successfully"));
});

// ==================== EXPORTS ====================
module.exports = {
    countryCreate,
    countryView,
    countryUpdate,
    countryDelete,
    multiDelete,
    changeStatus,
};
