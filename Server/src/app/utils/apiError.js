/**
 * ============================================================================
 * ApiError Class
 * ============================================================================
 * 
 * @description Custom Error class for handling API-specific exceptions.
 * Includes HTTP status codes and structured error messages.
 * @module utils/apiError
 * @extends Error
 * 
 * @author Monsta Team
 * @version 1.0.0
 * ============================================================================
 */

class ApiError extends Error {
  /**
   * @constructor
   * @param {number} statusCode - HTTP status code
   * @param {string} [message="something went wrong"] - Error message
   * @param {Array} [errors=[]] - Array of validation errors
   * @param {string} [stack=""] - Error stack trace
   */
  constructor(
    statusCode,
    message = "something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.error = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = { ApiError };