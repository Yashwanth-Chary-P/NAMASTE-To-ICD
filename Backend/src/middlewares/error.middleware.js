function notFound(req, res, next) {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} does not exist`
  });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: err.name || "ServerError",
    message: err.message || "Internal Server Error"
  });
}

module.exports = {
  notFound,
  errorHandler
};