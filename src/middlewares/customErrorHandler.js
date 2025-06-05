const customErrorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  if (!error.isOperational) {
    console.error(error.message);
  }

  res.status(statusCode).json({
    error: error.message,
  });
};

module.exports = customErrorHandler;
