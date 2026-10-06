const errorMiddleware = (err, req, res, next) => {
  console.error("API Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      data: null,
      errors
    });
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid resource ID",
      data: null
    });
  }

  // Duplicate MongoDB value
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";

    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      data: null
    });
  }

  // JSON parsing error
  if (err instanceof SyntaxError && err.status === 400 && err.body) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body",
      data: null
    });
  }

  // Default server error
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
    data: null
  });
};

module.exports = errorMiddleware;