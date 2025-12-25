const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });
const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = process.env.DB_NAME;

const connectDB = async () => {
  if (!MONGODB_URL || !DB_NAME) {
    console.error(" Critical Error: MONGODB_URL or DB_NAME is not defined in .env"  );
    process.exit(1); // Stop the server immediately
  }

  try 
  {
    const responseDb = await mongoose.connect(`${MONGODB_URL}/${DB_NAME}`);
    console.log(`MongoDB Connected : ${DB_NAME} Database ${responseDb.connection.host}`);
  } 
  catch (error) {
    console.error(" Initial MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};



module.exports = { connectDB };
