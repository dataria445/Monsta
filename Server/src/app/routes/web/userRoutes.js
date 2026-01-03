/**
 * ============================================================================
 * User Routes (Web)
 * ============================================================================
 * 
 * @description Defines the API endpoints for user authentication and profile
 * management. Includes middleware for file uploads.
 * @module routes/web/user
 * @requires express
 * @requires controllers/web/user.controller
 * @requires middlewares/multer
 * 
 * @author Monsta Team
 * @version 1.1.0
 * @since 2025-12-23
 * ============================================================================
 */

const express = require("express");
const { register, login, forgotPassword, resetPassword, updatePassword, sendOtp, logoutUser, refreshAccessToken } = require("../../controllers/web/user.controller");
const upload = require("../../middlewares/multer.middleware");
const { verifyJWT } = require("../../middlewares/auth.middleware");

const userRoutes = express.Router();

// ==================== PUBLIC ROUTES ====================

// OTP Generation
userRoutes.post("/send-otp", sendOtp);

/**
 * @route POST /web/user/register
 * @description Handles user registration with 'avatar' and 'coverImage' uploads.
 * Uses Multer middleware to process binary data into buffers.
 */
userRoutes.post("/register", upload("users").fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
]), register);

// Authentication
userRoutes.post("/login", login);
userRoutes.post("/refresh-token", refreshAccessToken);

//logout User
userRoutes.post("/logout", verifyJWT, logoutUser);

// Password Recovery
userRoutes.post("/forgot-password", forgotPassword);
userRoutes.post("/reset-password", resetPassword);

// ==================== PROTECTED ROUTES ====================

// Profile Management
userRoutes.post("/update-password", verifyJWT, updatePassword);

module.exports = { userRoutes };