# Server API

This is the backend server for the Monsta-New Client application, built with Node.js, Express, and MongoDB.

## Features
- **RESTful API** architecture
- **MongoDB** integration via Mongoose
- **Authentication & Authorization** (Admin routes)
- **Features**:
  - FAQ Management
  - Payment Gateway Configuration
  - Dashboard Admin
  - **Category Management**: Create, update, delete, and view product categories with image support.
  - Location/Country Management
  - Slider & Testimonial Management
  - Product Catalogue (Colors, Materials, Coupons)
- **Error Handling**: Centralized error handling with custom `ApiError` and `ApiResponse` classes.
- **File Uploads**: Multer middleware for handling file uploads.

## 🛡️ Error Handling Coverage

### ✅ Global Error Handler
All controllers are protected by a **global error handling middleware** that automatically catches and formats errors.

**Location**: `/src/app/middlewares/errorHandler.js`

### Supported Error Types

| Error Type | Status Code | Description |
|------------|-------------|-------------|
| **MongoDB Error 11000** | `409 Conflict` | Duplicate key violations (unique constraint) |
| **Mongoose ValidationError** | `400 Bad Request` | Schema validation failures |
| **Mongoose CastError** | `400 Bad Request` | Invalid ObjectId or type casting errors |
| **MulterError** | `400 Bad Request` | File upload errors (Size limit, Unexpected field) |
| **JWT Errors** | `401 Unauthorized` | Invalid or expired authentication tokens |
| **Custom ApiError** | Custom | Business logic errors with custom messages |
| **404 Not Found** | `404 Not Found` | Undefined routes |
| **Generic Errors** | `500 Internal Server Error` | All other uncaught errors |

### 🖼️ Image Handling Standardization
As of Dec 2025, all image fields follow a consistent naming convention:
- **Field Name**: `entityImage` (e.g., `categoryImage`, `productImage`).
- **Legacy Support**: The API automatically maps old `*ImageUrl` fields to the new schema for backward compatibility.
- **Upload Path**: Images are stored in the consolidated `public` directory.

### 100% Controller Coverage

All **15 controllers** are automatically protected:
- ✅ Category, SubCategory, SubSubCategory
- ✅ Color, Material, Country
- ✅ Product, Coupon, Newsletter
- ✅ Slider, Testimonial, Choose
- ✅ FAQ, Contact Enquiry, Admin Dashboard

### Error Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": { ... },
  "statusCode": 201
}
```

**Error Response (Duplicate):**
```json
{
  "success": false,
  "message": "Duplicate value for field 'categoryName': 'Electronics' already exists",
  "statusCode": 409,
  "errors": [
    {
      "field": "categoryName",
      "message": "Duplicate value..."
    }
  ]
}
```

**Error Response (Validation):**
```json
{
  "success": false,
  "message": "Validation failed",
  "statusCode": 400,
  "errors": [
    {
      "field": "categoryName",
      "message": "Category name is required"
    }
  ]
}
```

### How It Works

```
Request → Middleware → Route → Controller (wrapped in asyncHandler)
                                              ↓
                                      Error Thrown?
                                              ↓
                                      Global errorHandler
                                              ↓
                                      Formatted JSON Response
```

Every controller function is wrapped in `asyncHandler`, which:
1. Catches any thrown errors automatically
2. Passes them to the global `errorHandler` middleware
3. Returns a consistent, formatted JSON response

**No manual try-catch blocks needed!** All errors are handled automatically.

## Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas connection string)

## Installation

1. Navigate to the server directory:
   ```bash
   cd Server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Configuration:
   Create a `.env` file in the root of the `Server` directory with the following variables:
   ```env
   PORT=8006
   MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net
   DB_NAME=your_db_name
   CORS_ORIGIN=http://localhost:5173  # URL of your frontend dashboard
   NODE_ENV=development
   CATEGORYIMAGESTATICPATH=/public/CategoryImages # Static path for category images
   ```

## Running the Server

- **Development Mode** (using Nodemon):
  ```bash
  npm start
  ```
  The server will start on `http://localhost:8006` (or your defined PORT).

## Project Structure

```
src/
├── app/
│   ├── controllers/    # Request handlers
│   ├── db/             # Database connection logic
│   ├── middleware/     # Custom middleware (multer, error handling)
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API route definitions
│   ├── utils/          # Utility classes (ApiError, ApiResponse, asyncHandler)
│   ├── app.js          # Express app configuration
│   └── index.js        # Entry point
```

## API Highlights

- **Base URL**: `/admin`
- **Routes**:
  - `/admin/faq` - FAQ operations
  - `/admin/payment` - Payment gateway settings
  - `/admin/country` - Country management
  - `/admin/dashboardadmin` - Admin user management
  - ...and more.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Utilities**: Dotenv, CORS, Cookie-Parser, Multer
