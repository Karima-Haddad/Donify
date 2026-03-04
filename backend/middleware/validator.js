/**
 * Middleware de validation des requêtes.
 */

export function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      return res.status(400).json({
        error: "Validation error",
        details: err.errors
      });
    }
  };
} 