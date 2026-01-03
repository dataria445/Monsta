/**
 * ============================================================================
 * ApiResponse Class
 * ============================================================================
 * 
 * @description Standardized API response format for consistent communication 
 * between backend and frontend.
 * @module utils/apiResponse
 * 
 * @author Monsta Team
 * @version 1.0.0
 * ============================================================================
 */

class ApiResponse {
    /**
     * @constructor
     * @param {number} statusCode - HTTP status code
     * @param {*} data - Response data
     * @param {string} [message="Success"] - Response message
     */
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

module.exports = { ApiResponse };