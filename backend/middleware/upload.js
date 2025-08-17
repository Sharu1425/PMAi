import multer from "multer"
import path from "path"

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed"), false)
  }
}

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

// Middleware for single file upload (profile picture)
export const uploadProfilePicture = upload.single("profilePicture")

// Middleware for multiple files (face registration)
export const uploadFaceImages = upload.array("images", 5) // Max 5 images

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large",
        message: "File size must be less than 5MB",
      })
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        error: "Too many files",
        message: "Maximum 5 files allowed",
      })
    }
  }
  
  if (error.message === "Only image files are allowed") {
    return res.status(400).json({
      error: "Invalid file type",
      message: "Only image files are allowed",
    })
  }
  
  next(error)
}

export default upload
