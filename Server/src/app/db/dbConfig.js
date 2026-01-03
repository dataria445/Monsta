/**
 * ============================================================================
 * Database Configuration
 * ============================================================================
 * 
 * @description Establishes a connection to the MongoDB database using Mongoose.
 * Validates environment variables before attempting connection.
 * @module db/dbConfig
 * @requires mongoose
 * @requires dotenv
 * 
 * @author Monsta Team
 * @version 1.0.0
 * ============================================================================
 */

const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = process.env.DB_NAME;

/**
 * @function connectDB
 * @description Connects to the MongoDB instance. If credentials or URL are 
 * missing, or if connection fails, the process exits with a failure code (1).
 */
const connectDB = async () => {
  if (!MONGODB_URL || !DB_NAME) {
    console.error(" Critical Error: MONGODB_URL or DB_NAME is not defined in .env");
    process.exit(1); // Stop the server immediately
  }

  try {
    const responseDb = await mongoose.connect(`${MONGODB_URL}/${DB_NAME}`);
    console.log(`MongoDB Connected : ${DB_NAME} Database ${responseDb.connection.host}`);
  }
  catch (error) {
    console.error(" Initial MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
