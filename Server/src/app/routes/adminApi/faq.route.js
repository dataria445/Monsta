const express = require("express")
const { faqCreate, faqView, faqDelete, faqUpdate, multiDelete, changeStatus } = require("../../controllers/faq.controller")

const faqRoutes = express.Router()

faqRoutes.post("/create", faqCreate)
faqRoutes.get("/view", faqView)
faqRoutes.delete("/delete/:id", faqDelete)
faqRoutes.put("/update/:id", faqUpdate)
faqRoutes.post("/multiDelete", multiDelete)
faqRoutes.post("/changeStatus", changeStatus)

module.exports = { faqRoutes }