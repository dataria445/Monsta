/**
 * ============================================================================
 * Server Entry Point
 * ============================================================================
 * 
 * @description Main entry point for the backend server. Handles database connection and server initialization.
 * @module index
 * @requires dotenv
 * @requires app
 * @requires db/dbConfig
 * 
 * @author Monsta Team
 * @version 1.0.0
 * @since 2025-12-23
 * ============================================================================
 */

require('dotenv').config();
const { app } = require('./app.js');
const { connectDB } = require('./db/dbConfig.js');

// ==================== SERVER CONFIGURATION ====================
const PORT = process.env.PORT || 8006;

// ==================== DATABSE CONNECTION & SERVER START ====================
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(` Server is running at port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed!", err);
    });

// ==================== GLOBAL ERROR HANDLING ====================
app.on("error", (error) => {
    console.error("Express Error: ", error);
});