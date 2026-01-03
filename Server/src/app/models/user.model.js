/**
 * ============================================================================
 * User Model
 * ============================================================================
 * 
 * @description Mongoose schema and model definition for User.
 * Handles user authentication, profile data, and token generation.
 * @module models/user
 * @requires mongoose
 * @requires bcryptjs - For password hashing
 * @requires jsonwebtoken - For authentication tokens
 * 
 * @author Monsta Team
 * @version 1.0.1
 * @since 2025-12-23
 * ============================================================================
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==================== SCHEMA DEFINITION ====================
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    status: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null/empty values while maintaining uniqueness for non-null values
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

// ==================== MIDDLEWARE (PRE-SAVE HOOKS) ====================

/**
 * @description Hash password before saving it to the database.
 * Only runs if the password field is modified.
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// ==================== INSTANCE METHODS ====================

/**
 * @method isPasswordCorrect
 * @description Compares provided plain text password with hashed password in DB.
 * @param {string} password - Plain text password
 * @returns {Promise<boolean>} Match result
 */
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * @method generateAccessToken
 * @description Generates a JWT access token for user authentication.
 * @returns {string} JWT token
 */
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

/**
 * @method generateRefreshToken
 * @description Generates a JWT refresh token for session persistence.
 * @returns {string} JWT token
 */
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// ==================== MODEL DEFINITION & EXPORTS ====================
const userModel = mongoose.model("User", userSchema);
module.exports = { userModel };
