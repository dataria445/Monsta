/**
 * ============================================================================
 * Async Handler Wrapper
 * ============================================================================
 * 
 * @description A high-order function helper to catch errors in asynchronous 
 * route handlers and pass them to the global error middleware.
 * @module utils/asyncHandler
 * 
 * @author Monsta Team
 * @version 1.0.0
 * ============================================================================
 */

/**
 * @function asyncHandler
 * @description Wraps an async function to ensure any rejected promises are 
 * caught and forwarded to the next(err) callback.
 * @param {Function} requestHandler - The async route handler function.
 * @returns {Function} Express middleware function.
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

module.exports = { asyncHandler };
