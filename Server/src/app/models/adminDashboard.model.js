/**
 * ============================================================================
 * AdminDashboard Model
 * ============================================================================
 * 
 * @description Mongoose schema and model definition for AdminDashboard.
 * @module models/adminDashboard
 * @requires mongoose
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const mongoose = require("mongoose");
const adminDashboardSchema = new mongoose.Schema(

   {
      dashboardAdminName: {
         type: String,
         required: true,
      },
      dashboardAdminEmail: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
      },
      dashboardAdminMobile: {
         type: String,
         required: true,
      },
      dashboardAdminStatus: {
         type: Boolean,
         default: true,
      },
      isDeleted: {
         type: Boolean,
         default: false,
      },
      deletedAt: {
         type: Date,
         default: null,
      },
   },
   { timestamps: true }
);
const adminDashboardModel = mongoose.model("AdminDashboard", adminDashboardSchema)

module.exports = { adminDashboardModel }
