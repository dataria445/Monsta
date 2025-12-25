
class ApiError extends Error {
  /*
    @constructor
    {number} statusCode - HTTP status code
    {string} [message="something went wrong"] - Error message
    {Array} [errors=[]] - Array of validation errors
    {string} [stack=""] - Error stack trace
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

module.exports = { ApiError }