const express = require("express")
const { productCreate, productView, getParentCategory, getSubCategory, getSubSubCategory, productDelete, productUpdate, multiDelete, changeStatus, productDetails } = require("../../controllers/product.controller")
const upload = require("../../middlewares/multer.middleware")

const productRoutes = express.Router()

const productUpload = upload("productImages").fields([
    { name: "productImage", maxCount: 1 },
    { name: "productBackImage", maxCount: 1 },
    { name: "productImageGallery", maxCount: 10 }
])

productRoutes.post("/create", productUpload, productCreate)
productRoutes.get("/view", productView)
productRoutes.get("/parentCategory", getParentCategory)
productRoutes.get("/subCategory/:parentId", getSubCategory)
productRoutes.get("/subSubCategory/:subCategoryId", getSubSubCategory)
productRoutes.delete("/delete/:id", productDelete)
productRoutes.put("/update/:id", productUpload, productUpdate)
productRoutes.post("/multiDelete", multiDelete)
productRoutes.post("/changeStatus", changeStatus)
productRoutes.get("/productDetails/:id", productDetails)

module.exports = { productRoutes }