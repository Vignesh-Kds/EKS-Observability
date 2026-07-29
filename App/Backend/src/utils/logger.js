/**
 * Simple application logger
 * Can be replaced with Winston or Pino later.
 */

const timestamp = () => {
  return new Date().toISOString();
};

const format = (level, message) => {
  return `[${timestamp()}] [${level}] ${message}`;
};

const logger = {
  info(message) {
    console.log(format("INFO", message));
  },

  warn(message) {
    console.warn(format("WARN", message));
  },

  error(message, error = null) {
    console.error(format("ERROR", message));

    if (error) {
      console.error(error);
    }
  },

  debug(message) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(format("DEBUG", message));
    }
  },

  success(message) {
    console.log(format("SUCCESS", `✅ ${message}`));
  },

  request(req) {
    console.log(
      format(
        "REQUEST",
        `${req.method} ${req.originalUrl} - ${req.ip}`
      )
    );
  },
};

export default logger;
