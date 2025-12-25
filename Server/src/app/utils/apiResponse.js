/* class ApiResponse
 Standardized API response format
 */
class ApiResponse {
    /**
     * @constructor
     * @param {number} statusCode - HTTP status code
     * @param {*} data - Response data
     * @param {string} [message="Success"] - Response message
     */
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

module.exports = { ApiResponse }