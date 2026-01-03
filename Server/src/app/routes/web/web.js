const express = require("express");
const { userRoutes } = require("./userRoutes");


const webRoute = express.Router();

webRoute.use("/user", userRoutes);

module.exports = { webRoute };