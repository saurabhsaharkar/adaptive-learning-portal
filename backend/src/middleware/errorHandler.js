/**
 * Centralized error handler.
 * Keeps routes lean: they just call next(err) and this middleware responds.
 */
export function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.message);
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  // PostgreSQL / pg error
  if (err.code) {
    switch (err.code) {
      case '23505': // unique_violation
        return res.status(409).json({ error: 'Resource already exists' });
      case '23503': // foreign_key_violation
        return res.status(400).json({ error: 'Referenced resource does not exist' });
      case '42703': // undefined_column
      case '42P01': // undefined_table
        return res.status(500).json({ error: 'Database schema error' });
      default:
        break;
    }
  }

  // Custom app errors with a statusCode property
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  return res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}

export function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}