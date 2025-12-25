/**
 * @file errorHandler.js
 * @description Global error handling middleware for Express
 * Handles MongoDB errors, Mongoose validation errors, and custom ApiErrors
 */

const { ApiError } = require("../utils/apiError");

const errorHandler = (err, req, res, next) => {
    let error = err;

    // If it's not already an ApiError, convert it
    if (!(error instanceof ApiError)) {
        // Handle MongoDB duplicate key error (error code 11000)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const value = error.keyValue[field];
            const message = `Duplicate value for field '${field}': '${value}' already exists`;
            error = new ApiError(409, message, [{ field, message }]);
        }
        // Handle Mongoose validation errors
        else if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err) => ({
                field: err.path,
                message: err.message,
            }));
            const message = "Validation failed";
            error = new ApiError(400, message, errors);
        }
        // Handle Mongoose cast error (invalid ObjectId or type casting)
        else if (error.name === "CastError") {
            const message = `Invalid ${error.path}: ${error.value}`;
            error = new ApiError(400, message, [
                { field: error.path, message },
            ]);
        }
        // Handle JWT errors
        else if (error.name === "JsonWebTokenError") {
            const message = "Invalid token. Please login again";
            error = new ApiError(401, message);
        }
        // Handle JWT expired error
        else if (error.name === "TokenExpiredError") {
            const message = "Token expired. Please login again";
            error = new ApiError(401, message);
        }
        // Handle Multer errors (File Upload)
        else if (error.name === "MulterError") {
            let message = error.message;
            if (error.code === "LIMIT_UNEXPECTED_FILE") {
                message = `Unexpected file upload field${error.field ? ` '${error.field}'` : ""}. Please check your form-data key names.`;
            } else if (error.code === "LIMIT_FILE_SIZE") {
                message = "File is too large. Maximum size allowed is 2MB."; // Adjust size limit message if needed
            }
            error = new ApiError(400, message);
        }
        // Handle other errors
        else {
            const statusCode = error.statusCode || 500;
            const message = error.message || "Internal Server Error";
            error = new ApiError(statusCode, message, [], error.stack);
        }
    }

    // Log error for debugging (in development)
    if (process.env.NODE_ENV === "development") {
        console.error("Error Details:", {
            message: error.message,
            statusCode: error.statusCode,
            errors: error.error,
            stack: error.stack,
        });
    }

    // Send error response
    const response = {
        success: false,
        message: error.message,
        statusCode: error.statusCode,
        ...(error.error && error.error.length > 0 && { errors: error.error }),
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    };

    return res.status(error.statusCode).json(response);
};

module.exports = { errorHandler };
