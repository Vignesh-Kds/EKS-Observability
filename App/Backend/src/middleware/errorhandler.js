/**
 * Global Error Handling Middleware
 */

const errorHandler = (err, req, res, next) => {
  console.error("========================================");
  console.error("❌ Error:", err.message);
  console.error(err.stack);
  console.error("========================================");

  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || "Internal Server Error",
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
    },
  });
};

export default errorHandler;
