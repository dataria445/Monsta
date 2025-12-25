const express = require("express")
const { subCategoryCreate, subCategoryView, getParentCategory, subCategoryDelete, subCategoryUpdate, multiDelete, changeStatus } = require("../../controllers/subCategory.controller")
const upload = require("../../middlewares/multer.middleware")

const subCategoryRoutes = express.Router()

subCategoryRoutes.post("/create", upload("subCategoryImages").single("subCategoryImage"), subCategoryCreate)
subCategoryRoutes.get("/view", subCategoryView)
subCategoryRoutes.get("/parentCategory", getParentCategory)
subCategoryRoutes.delete("/delete/:id", subCategoryDelete)
subCategoryRoutes.put("/update/:id", upload("subCategoryImages").single("subCategoryImage"), subCategoryUpdate)
subCategoryRoutes.post("/multiDelete", multiDelete)
subCategoryRoutes.post("/changeStatus", changeStatus)

module.exports = { subCategoryRoutes }
