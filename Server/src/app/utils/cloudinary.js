// const cloudinary = require("cloudinary").v2;
// const fs = require("fs");


// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });


// const uploadOnCloudinary = async (localFilePath, folderName = "general") => {
//     try {
//         if (!localFilePath) return null

//         // upload the file on cloudinary with folder organization
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto",
//             folder: folderName
//         })

//         // Remove file from local storage after successful upload
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath)
//         }
//         return response;

//     } catch (error) {
//         // Ensure local file is removed even if upload fails
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath)
//         }
//         console.error("Cloudinary Upload Error:", error);
//         return null;
//     }
// }

// module.exports = { uploadOnCloudinary }