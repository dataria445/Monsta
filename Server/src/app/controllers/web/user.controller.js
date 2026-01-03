/**
 * ============================================================================
 * User Controller
 * ============================================================================
 *
 * @description Handles user-related operations such as registration, authentication,
 * session management, and password recovery. Integrates with Cloudinary for 
 * direct memory-to-cloud image uploads.
 * @module controllers/web/user
 * @requires utils/apiUtils - Async handler, API response and error utilities
 * @requires models/user.model - User data model
 * @requires utils/cloudinary - Cloudinary upload service
 * @requires utils/slug - Slug generation utility
 * @requires crypto - Node native crypto for token generation
 * @requires jsonwebtoken - JWT management
 * 
 * Available Operations:
 * - sendOtp: Dispatch verification codes (OTP logic)
 * - register: Create new user account with avatar/cover uploads
 * - login: Authenticate user and issue JWT tokens
 * - logoutUser: Invalidate session and clear auth cookies
 * - refreshAccessToken: Regenerate expired access tokens
 * - forgotPassword: Initiate password recovery via hashed tokens
 * - resetPassword: Set new password using valid recovery token
 * - updatePassword: Secure password change for authenticated users
 *
 * @author Monsta Team
 * @version 1.2.0
 * @since 2025-12-23
 * ============================================================================
 */

const { asyncHandler, ApiResponse, ApiError } = require("../../utils/apiUtils");
const { userModel } = require("../../models/user.model");
const { uploadOnCloudinary } = require("../../utils/cloudinary");
const { createSlug } = require("../../utils/slug");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");



// ==================== OTP SERVICE ====================

/**
 * @function sendOtp
 * @description Dispatches a one-time password (OTP) for user registration or account validation.
 * @route POST /web/user/send-otp
 */
const sendOtp = asyncHandler(async (req, res) => {
  let obj = { ...req.body };
  console.log(obj);

  res.status(200).json(new ApiResponse(200, {}, "OTP sent successfully"));
});

// ==================== REGISTRATION ====================

/**
 * @function register
 * @description Registers a new user.
 * 1. Validates input fields.
 * 2. Checks for existing users with same email/username.
 * 3. Uploads avatar and cover image buffers directly to Cloudinary.
 * 4. Creates user document in MongoDB.
 * @route POST /web/user/register
 */
const register = asyncHandler(async (req, res) => {
  const { username, password, fullname, email, phone, address, gender } =
    req.body;

  // 1. Validate all required fields
  if (
    [username, email, password, fullname].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // 2. Check for existing user (uniqueness check)
  const existedUser = await userModel.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // 3. Handle file buffers from Multer Memory Storage
  const avatarBuffer = req.files?.avatar?.[0]?.buffer;
  if (!avatarBuffer) {
    throw new ApiError(400, "Avatar file is required");
  }

  const coverImageBuffer = req.files?.coverImage?.[0]?.buffer;

  // 4. Upload directly to Cloudinary using streams
  // Dynamic Folder: Uses req.uploadFolder injected by the multer middleware
  const avatar = await uploadOnCloudinary(avatarBuffer, req.uploadFolder);
  const coverImage = coverImageBuffer
    ? await uploadOnCloudinary(coverImageBuffer, req.uploadFolder)
    : null;

  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar");
  }

  // 5. Create user record
  const user = await userModel.create({
    fullname: fullname.trim(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email: email.toLowerCase(),
    password, // Hashed automatically by Mongoose pre-save hook
    username: username.toLowerCase(),
    phone,
    address,
    gender,
    slug: createSlug(fullname),
  });

  // 6. Return response (excluding sensitive info)
  const createdUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// ==================== LOGIN ====================

/**
 * @function login
 * @description Authenticates a user using credentials and issues JWT access and refresh tokens.
 * Supports authentication via either email or username.
 * @route POST /web/user/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // 1. Validate input
  if (!password || (!email && !username)) {
    throw new ApiError(400, "Username/Email and password are required");
  }

  // 2. Find user
  const user = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // 3. Check password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // 4. Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // 5. Save refresh token in DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // 6. Return response
  const loggedInUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

// ==================== REFRESH TOKEN ====================
/**
 * @function refreshAccessToken
 * @description Generates new access and refresh tokens using a valid refresh token.
 * Validates the token against the database and regenerates a new pair.
 * @route POST /web/user/refresh-token
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    // 1. Verify the incoming refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // 2. Find user and check if token matches
    const user = await userModel.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    // 3. Generate new tokens
    const options = {
      httpOnly: true,
      secure: true,
    };

    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // 4. Update refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});



// ==================== LOGOUT ====================
/**
 * @function logoutUser
 * @description Logs out user by clearing the refresh token in DB and removing cookies.
 * @route POST /web/user/logout
 */
const logoutUser = asyncHandler(async (req, res) => {
  // 1. Clear refresh token in database
  await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  );

  // 2. Cookie options
  const options = {
    httpOnly: true,
    secure: true
  };

  // 3. Clear cookies and return response
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});



// ==================== FORGOT PASSWORD ====================
/**
 * @function forgotPassword
 * @description Generates a reset token and sets expiry.
 * @route POST /web/user/forgot-password
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(404, "User not found with this email");
  }

  // 1. Generate reset token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // 2. Hash and set to user model
  user.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes expiry

  await user.save({ validateBeforeSave: false });

  // Note: In production, send this via email. Returning for now to facilitate testing.
  return res
    .status(200)
    .json(
      new ApiResponse(200, { resetToken }, "Reset token generated successfully")
    );
});

// ==================== RESET PASSWORD ====================
/**
 * @function resetPassword
 * @description Resets user password using reset token.
 * @route POST /web/user/reset-password
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new ApiError(400, "Token and new password are required");
  }

  // 1. Hash the incoming token to compare with DB
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // 2. Find user with valid token
  const user = await userModel.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  // 3. Update password
  user.password = newPassword;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

// ==================== UPDATE PASSWORD ====================
/**
 * @function updatePassword
 * @description Changes password for logged-in users.
 * @route POST /web/user/update-password
 */
const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user?._id; // This requires auth middleware to be present

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new passwords are required");
  }

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  const user = await userModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 1. Verify old password
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect old password");
  }

  // 2. Set new password
  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

// ==================== EXPORTS ====================
module.exports = {
  sendOtp,
  register,
  login,
  logoutUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  updatePassword,
};
