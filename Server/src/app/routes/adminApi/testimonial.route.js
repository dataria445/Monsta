const express = require("express")
const { testimonialCreate, testimonialView, testimonialDelete, testimonialUpdate, multiDelete, changeStatus } = require("../../controllers/testimonial.controller")
const upload = require("../../middlewares/multer.middleware")

const testimonialRoutes = express.Router()

testimonialRoutes.post("/create", upload("testimonialImages").single("testimonialImageUrl"), testimonialCreate)
testimonialRoutes.get("/view", testimonialView)
testimonialRoutes.delete("/delete/:id", testimonialDelete)
testimonialRoutes.put("/update/:id", upload("testimonialImages").single("testimonialImageUrl"), testimonialUpdate)
testimonialRoutes.post("/multiDelete", multiDelete)
testimonialRoutes.post("/changeStatus", changeStatus)

module.exports = { testimonialRoutes }
