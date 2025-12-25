/**
 * ============================================================================
 * Express App Configuration
 * ============================================================================
 * 
 * @description Configures and exports the Express application. Sets up middleware, headers, CORS, routes, and error handlers.
 * @module app
 * @requires express
 * @requires cors
 * @requires routes/adminApi/adminApi.route
 * @requires middlewares/errorHandler
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

const express = require("express")
const cors = require("cors")
const path = require("path")
const { adminRoutes } = require("./routes/adminApi/adminApi.route")
const { errorHandler } = require("./middlewares/errorHandler")

const app = express()

// ==================== CORS CONFIGURATION ====================

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));


// ==================== MIDDLEWARE CONFIGURATION ====================
app.use(express.json({ limit: "16kb", }))
app.use(express.urlencoded({ extended: true, limit: "16kb", }))
app.use(express.static(path.join(__dirname, "../../public")))

// ==================== ROUTE DEFINITIONS ====================
app.use("/admin", adminRoutes)

// ==================== ERROR HANDLING ====================
// 404 handler - must be after all routes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        statusCode: 404
    });
});

// Global error handler - must be last middleware
app.use(errorHandler)

module.exports = { app }