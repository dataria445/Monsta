const express = require("express")
const { chooseCreate, chooseView, chooseDelete, chooseUpdate, multiDelete, changeStatus } = require("../../controllers/choose.controller")
const upload = require("../../middlewares/multer.middleware")

const chooseRoutes = express.Router()

chooseRoutes.post("/create", upload("chooseImages").single("chooseImageUrl"), chooseCreate)
chooseRoutes.get("/view", chooseView)
chooseRoutes.delete("/delete/:id", chooseDelete)
chooseRoutes.put("/update/:id", upload("chooseImages").single("chooseImageUrl"), chooseUpdate)
chooseRoutes.post("/multiDelete", multiDelete)
chooseRoutes.post("/changeStatus", changeStatus)

module.exports = { chooseRoutes }