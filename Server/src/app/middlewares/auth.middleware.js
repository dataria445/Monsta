/**
 * ============================================================================
 * Auth Middleware
 * ============================================================================
 * 
 * @description Verifies JWT access tokens and attaches the user object to 
 * the request. This is used to protect private routes.
 * @module middlewares/auth
 * @requires jsonwebtoken
 * @requires models/user.model
 * @requires utils/apiUtils
 * 
 * @author Monsta Team
 * @version 1.0.0
 * ============================================================================
 */

const jwt = require("jsonwebtoken");
const { userModel } = require("../models/user.model");
const { ApiError, asyncHandler } = require("../utils/apiUtils");

/**
 * @function verifyJWT
 * @description Decodes and validates the JWT from headers or cookies.
 * If valid, fetches user from DB and attaches it to req.user.
 */
const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // 1. Get token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // 2. Verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // 3. Find user in database
        const user = await userModel.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // 4. Attach user to request
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});

module.exports = { verifyJWT };
