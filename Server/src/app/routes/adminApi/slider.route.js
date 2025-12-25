const express = require("express")
const { sliderCreate, sliderView, sliderDelete, sliderUpdate, multiDelete, changeStatus } = require("../../controllers/slider.controller")
const upload = require("../../middlewares/multer.middleware")

const sliderRoutes = express.Router()

sliderRoutes.post("/create", upload("sliderImages").single("sliderImage"), sliderCreate)
sliderRoutes.get("/view", sliderView)
sliderRoutes.delete("/delete/:id", sliderDelete)
sliderRoutes.put("/update/:id", upload("sliderImages").single("sliderImage"), sliderUpdate)
sliderRoutes.post("/multiDelete", multiDelete)
sliderRoutes.post("/changeStatus", changeStatus)

module.exports = { sliderRoutes }