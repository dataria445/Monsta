const express = require("express")
const { subSubCategoryCreate, subSubCategoryView, subSubCategoryDelete, subSubCategoryUpdate, multiDelete, changeStatus } = require("../../controllers/subSubCategory.controller")
const upload = require("../../middlewares/multer.middleware")
const { getParentCategory } = require("../../controllers/subCategory.controller")

const subSubCategoryRoutes = express.Router()

subSubCategoryRoutes.post("/create", upload("subSubCategoryImages").single("subSubCategoryImageUrl"), subSubCategoryCreate)
subSubCategoryRoutes.get("/view", subSubCategoryView)
subSubCategoryRoutes.delete("/delete/:id", subSubCategoryDelete)
subSubCategoryRoutes.put("/update/:id", upload("subSubCategoryImages").single("subSubCategoryImageUrl"), subSubCategoryUpdate)
subSubCategoryRoutes.post("/multiDelete", multiDelete)
subSubCategoryRoutes.post("/changeStatus", changeStatus)
subSubCategoryRoutes.get("/parentCategory", getParentCategory)


module.exports = { subSubCategoryRoutes }
