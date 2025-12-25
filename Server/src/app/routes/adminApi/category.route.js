const express = require("express")
const { categoryCreate, categoryView, categoryDelete, categoryUpdate, changeStatus, multiDelete } = require("../../controllers/category.controller")
const upload = require("../../middlewares/multer.middleware")

const categoryRoutes = express.Router()

categoryRoutes.post("/create", upload("categoryImages").single("categoryImage"), categoryCreate)
categoryRoutes.get("/view", categoryView)
categoryRoutes.delete("/delete/:id", categoryDelete)
categoryRoutes.put("/update/:id", upload("categoryImages").single("categoryImage"), categoryUpdate)
categoryRoutes.post("/multiDelete", multiDelete)
categoryRoutes.post("/changeStatus", changeStatus)

module.exports = { categoryRoutes }