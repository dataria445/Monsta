const express = require("express");
const { admincreate, adminView, adminUpdate, multiDelete, changeStatus } = require("../../controllers/adminDashboard.controller");

const dashboardAdminRoutes = express.Router();

dashboardAdminRoutes.post("/create", admincreate);
dashboardAdminRoutes.get("/view", adminView);
dashboardAdminRoutes.put("/update/:id", adminUpdate);
dashboardAdminRoutes.post("/multiDelete", multiDelete);
dashboardAdminRoutes.post("/changeStatus", changeStatus);

module.exports = { dashboardAdminRoutes };
