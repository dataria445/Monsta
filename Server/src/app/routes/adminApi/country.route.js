const express=require("express")
const { countryCreate, countryView, countryDelete, countryUpdate, changeStatus, multiDelete } = require("../../controllers/country.controller")

const countryRoutes=express.Router()
countryRoutes.post("/create",countryCreate)
countryRoutes.get("/view",countryView)
countryRoutes.delete("/delete/:id",countryDelete)
countryRoutes.put("/update/:id",countryUpdate)
countryRoutes.post("/multiDelete",multiDelete)
countryRoutes.post("/changeStatus",changeStatus)
module.exports={countryRoutes}