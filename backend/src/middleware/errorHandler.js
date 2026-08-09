function notFound(req, res, next) {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
  });
}

module.exports = { notFound, errorHandler };
