/**
 * Middleware global de gestion des erreurs
 */
import { logger } from "../config/logger.js";

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  logger.error({
    message: err.message,
    status,
    method: req.method,
    url: req.originalUrl,
    ...(isProduction ? {} : { stack: err.stack }),
  });

  res.status(status).json({
    success: false,
    error:
      status === 500
        ? "Internal Server Error"
        : err.message,
  });
}
