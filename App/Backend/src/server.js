import dotenv from "dotenv";

// ======================================================
// Load Environment Variables
// ======================================================

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.local";

dotenv.config({ path: envFile });

import app from "./app.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

// ======================================================
// Start Server
// ======================================================

const server = app.listen(PORT, HOST, () => {
  logger.success("EKS Observability Backend Started");
  logger.info(`Environment File : ${envFile}`);
  logger.info(`Environment      : ${process.env.NODE_ENV || "development"}`);
  logger.info(`Server           : http://${HOST}:${PORT}`);
  logger.info(`Health API       : http://${HOST}:${PORT}/health`);
});

// ======================================================
// Graceful Shutdown
// ======================================================

const shutdown = (signal) => {
  logger.warn(`${signal} received. Shutting down gracefully...`);

  server.close(() => {
    logger.success("HTTP server closed.");
    process.exit(0);
  });

  setTimeout(() => {
    logger.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// ======================================================
// Unhandled Promise Rejections
// ======================================================

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Promise Rejection", reason);

  server.close(() => process.exit(1));
});

// ======================================================
// Uncaught Exceptions
// ======================================================

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", error);

  process.exit(1);
});
