/**
 * ============================================================================
 * Product Controller
 * ============================================================================
 * 
 * @description Controller for managing products with categories, images, and variants
 * @module controllers/product
 * @requires utils/apiUtils - Async handler, API response and error utilities
 * @requires models/product.model - Product data model
 * @requires models/category.model - Category data model for references
 * @requires models/subCategory.model - SubCategory data model for references
 * @requires models/subSubCategory.model - SubSubCategory data model for references
 * 
 * Available Operations:
 * - productCreate: Create a new product with images and attributes
 * - productView: Retrieve all active products with populated references
 * - getParentCategory: Get all active parent categories
 * - getSubCategory: Get subcategories by parent category ID
 * - getSubSubCategory: Get sub-subcategories by subcategory ID
 * - productUpdate: Update an existing product
 * - productDelete: Soft delete a product
 * - multiDelete: Bulk delete products
 * - changeStatus: Toggle product status (active/inactive)
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const { asyncHandler, ApiResponse, ApiError } = require("../utils/apiUtils");
const { productModel } = require("../models/product.model");
const { categoryModel } = require("../models/category.model");
const { subCategoryModel } = require("../models/subCategory.model");
const { subSubCategoryModel } = require("../models/subSubCategory.model");
// ==================== CREATE PRODUCT ====================
const productCreate = asyncHandler(async (req, res) => {
    let {
        productName,
        productType,
        productDescription,
        productPrice,
        productSalePrice,
        productStock,
        productOrder,
        productBestSelling,
        productTopRated,
        productTrending,
        productUpsell,
        productStatus,
        parentCategoryId,
        subCategoryId,
        subsubCategoryId,
        materialId,
        colorId,
    } = req.body;

    if (!productName || productName === "" || !productPrice || !productStock || !parentCategoryId) {
        throw new ApiError(400, "Product name, price, stock, and parent category are required");
    }

    // Duplicate check
    const existingProduct = await productModel.findOne({ productName: productName, isDeleted: false });
    if (existingProduct) {
        throw new ApiError(409, `Product with name '${productName}' already exists`);
    }

    let productImage = "";
    let productBackImage = "";
    let productImageGallery = [];

    // req.uploadFolder is set by the multer middleware based on the route config

    if (req.files) {
        if (req.files.productImage && req.files.productImage[0]) {
            productImage = `/${req.uploadFolder}/${req.files.productImage[0].filename}`;
        }

        if (req.files.productBackImage && req.files.productBackImage[0]) {
            productBackImage = `/${req.uploadFolder}/${req.files.productBackImage[0].filename}`;
        }

        if (req.files.productImageGallery) {
            productImageGallery = req.files.productImageGallery.map(file => `/${req.uploadFolder}/${file.filename}`);
        }
    }

    const toBool = (val) => (String(val) === "true" || val === true || val === "1" || val === 1);

    const product = await productModel.create({
        productName: productName,
        productType,
        productImage,
        productBackImage,
        productImageGallery,
        productDescription,
        productPrice: Number(productPrice),
        productSalePrice: productSalePrice ? Number(productSalePrice) : undefined,
        productStock: Number(productStock),
        productOrder: productOrder ? Number(productOrder) : 0,
        productBestSelling: toBool(productBestSelling),
        productTopRated: toBool(productTopRated),
        productTrending: toBool(productTrending),
        productUpsell: toBool(productUpsell),
        productStatus: productStatus !== undefined ? toBool(productStatus) : true,
        parentCategoryId,
        subCategoryId: subCategoryId || undefined,
        subsubCategoryId: subsubCategoryId || undefined,
        materialId: materialId || undefined,
        colorId: colorId || undefined,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, product, "Product created successfully"));
});
// ==================== VIEW PRODUCTS ====================
const productView = asyncHandler(async (req, res) => {
    let products = await productModel
        .find({ isDeleted: false })
        .populate("parentCategoryId", "categoryName")
        .populate("subCategoryId", "subCategoryName")
        .populate("subsubCategoryId", "subSubCategoryName")
        .populate("materialId", "materialName")
        .populate("colorId", "colorName colorCode")
        .sort({ productOrder: 1, createdAt: -1 })
        .lean();

    // Legacy mapping
    products = products.map(prod => {
        if (!prod.productImage && prod.productImageUrl) prod.productImage = prod.productImageUrl;
        if (!prod.productBackImage && prod.productBackImageUrl) prod.productBackImage = prod.productBackImageUrl;
        return prod;
    });

    return res
        .status(200)
        .json(new ApiResponse(200, products, "Products retrieved successfully"));
});
// ==================== GET PARENT CATEGORY ====================
const getParentCategory = asyncHandler(async (req, res) => {
    const categories = await categoryModel.find({ isDeleted: false, categoryStatus: true });
    return res
        .status(200)
        .json(new ApiResponse(200, categories, "Parent categories retrieved successfully"));
});
// ==================== GET SUB CATEGORY ====================
const getSubCategory = asyncHandler(async (req, res) => {
    const { parentId } = req.params;

    const subCategories = await subCategoryModel.find({
        parentCategoryId: parentId,
        isDeleted: false,
        subCategoryStatus: true
    });

    return res
        .status(200)
        .json(new ApiResponse(200, subCategories, "SubCategories retrieved successfully"));
});
// ==================== GET SUB SUB CATEGORY ====================
const getSubSubCategory = asyncHandler(async (req, res) => {
    const { subCategoryId } = req.params;

    const subSubCategories = await subSubCategoryModel.find({
        subCategoryId,
        isDeleted: false,
        subSubCategoryStatus: true
    });

    return res
        .status(200)
        .json(new ApiResponse(200, subSubCategories, "SubSubCategories retrieved successfully"));
});
// ==================== UPDATE PRODUCT ====================
const productUpdate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const body = { ...req.body };

    // Sanitize ObjectIds to prevent CastError on empty strings
    if (body.parentCategoryId === "") body.parentCategoryId = undefined;
    if (body.subCategoryId === "") body.subCategoryId = undefined;
    if (body.subsubCategoryId === "") body.subsubCategoryId = undefined;
    if (body.materialId === "") body.materialId = undefined;
    if (body.colorId === "") body.colorId = undefined;

    if (body.productName) {
        const existingProduct = await productModel.findOne({
            productName: body.productName,
            _id: { $ne: id },
            isDeleted: false
        });
        if (existingProduct) {
            throw new ApiError(409, `Another product with name '${body.productName}' already exists`);
        }
        body.productName = body.productName;
    }

    if (req.files) {
        // folder is available via req.uploadFolder
        if (req.files.productImage && req.files.productImage[0]) {
            body.productImage = `/${req.uploadFolder}/${req.files.productImage[0].filename}`;
        }

        if (req.files.productBackImage && req.files.productBackImage[0]) {
            body.productBackImage = `/${req.uploadFolder}/${req.files.productBackImage[0].filename}`;
        }

        if (req.files.productImageGallery) {
            body.productImageGallery = req.files.productImageGallery.map(file => `/${req.uploadFolder}/${file.filename}`);
        }
    }

    // Number conversion
    if (body.productPrice) body.productPrice = Number(body.productPrice);
    if (body.productSalePrice) body.productSalePrice = Number(body.productSalePrice);
    if (body.productStock) body.productStock = Number(body.productStock);
    if (body.productOrder !== undefined) body.productOrder = Number(body.productOrder);

    // Boolean conversion
    const flags = ['productBestSelling', 'productTopRated', 'productTrending', 'productUpsell', 'productStatus'];
    flags.forEach(flag => {
        if (body[flag] !== undefined) body[flag] = (String(body[flag]) === "true" || body[flag] === true || body[flag] === "1" || body[flag] === 1);
    });

    const product = await productModel.findByIdAndUpdate(id, body, {
        new: true,
    });

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product updated successfully"));
});
// ==================== DELETE PRODUCT ====================
const productDelete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await productModel.findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
    );

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Product deleted successfully"));
});
// ==================== DELETE MANY PRODUCTS ====================
const multiDelete = asyncHandler(async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "Valid array of IDs is required");
    }

    const result = await productModel.updateMany(
        { _id: { $in: ids } },
        { isDeleted: true, deletedAt: new Date() }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount }, "Products deleted successfully"));
});
// ==================== CHANGE STATUS ====================
const changeStatus = asyncHandler(async (req, res) => {
    const { id, ids, status } = req.body;

    if (ids && Array.isArray(ids) && ids.length > 0) {
        const result = await productModel.find({ _id: { $in: ids } });
        const updatePromises = result.map((product) => {
            return productModel.findByIdAndUpdate(
                product._id,
                { productStatus: !product.productStatus },
                { new: true }
            );
        });

        await Promise.all(updatePromises);
        return res.status(200).json(new ApiResponse(200, {}, "Statuses toggled successfully"));
    }

    if (!id) {
        throw new ApiError(400, "ID or IDs are required");
    }

    const currentProduct = await productModel.findById(id);
    if (!currentProduct) throw new ApiError(404, "Product not found");

    const newStatus = status !== undefined ? (String(status) === "true" || status === true) : !currentProduct.productStatus;

    const product = await productModel.findByIdAndUpdate(
        id,
        { productStatus: newStatus },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Status updated successfully"));
});
// ==================== EXPORTS ====================
module.exports = {
    productCreate,
    productView,
    getParentCategory,
    getSubCategory,
    getSubSubCategory,
    productUpdate,
    productDelete,
    multiDelete,
    changeStatus,
};
