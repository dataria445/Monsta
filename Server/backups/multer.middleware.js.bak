const multer = require("multer");
const fs = require("fs");
const path = require("path");


const upload = (folderName = "common") => {
  const storage = multer.diskStorage({

    destination: function (req, file, cb) {
      // Construct the full path: /project-root/Server/public/folderName
      // Resolves to Server/public relative to this file (Server/src/app/middlewares/multer.middleware.js)
      const uploadPath = path.join(__dirname, "../../../public", folderName);

      // Automatically create folder if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      // Store the folder name on the request object  so the controller can access it for database storage or cleanup
      // Return the upload path (null = no error)
      req.uploadFolder = folderName;
      cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
      // Generate unique suffix: timestamp + random number (0-1 billion) This ensures no two files will have the same name
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

      // Extract file extension (e.g., ".jpg", ".png", ".pdf")
      const fileExt = path.extname(file.originalname);

      // Get filename without extension (e.g., "profile-pic" from "profile-pic.jpg")
      const baseName = path.basename(file.originalname, fileExt);

      // Combine: baseName-uniqueSuffix.extension Example: vacation-photo-1735058423000-847562931.jpg
      cb(null, `${baseName}-${uniqueSuffix}${fileExt}`);
    },
  });

  // Return configured multer instance
  return multer({ storage });
};

module.exports = upload;