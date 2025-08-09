const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  })
}

const sendError = (res, error, message = "An error occurred", statusCode = 500) => {
  console.error("Error:", error)

  res.status(statusCode).json({
    success: false,
    error: message,
    message: process.env.NODE_ENV === "production" ? message : error.message,
    timestamp: new Date().toISOString(),
  })
}

const sendValidationError = (res, errors) => {
  res.status(400).json({
    success: false,
    error: "Validation Error",
    message: "Please check your input data",
    errors,
    timestamp: new Date().toISOString(),
  })
}

const sendNotFound = (res, resource = "Resource") => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `${resource} not found`,
    timestamp: new Date().toISOString(),
  })
}

const sendUnauthorized = (res, message = "Unauthorized access") => {
  res.status(401).json({
    success: false,
    error: "Unauthorized",
    message,
    timestamp: new Date().toISOString(),
  })
}

export {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
  sendUnauthorized,
}
