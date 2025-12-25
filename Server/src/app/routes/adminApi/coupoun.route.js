const express = require("express")
const { coupounCreate, coupounView, coupounDelete, coupounUpdate, multiDelete, changeStatus } = require("../../controllers/coupoun.controller")
const upload = require("../../middlewares/multer.middleware")

const coupounRoutes = express.Router()

coupounRoutes.post("/create", upload("coupounImages").single("coupounImageUrl"), coupounCreate)
coupounRoutes.get("/view", coupounView)
coupounRoutes.delete("/delete/:id", coupounDelete)
coupounRoutes.put("/update/:id", upload("coupounImages").single("coupounImageUrl"), coupounUpdate)
coupounRoutes.post("/multiDelete", multiDelete)
coupounRoutes.post("/changeStatus", changeStatus)

module.exports = { coupounRoutes }