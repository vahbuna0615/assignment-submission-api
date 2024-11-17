const errorHandler = (err, req, res, next) => {
  const statusCode = (res.statusCode >= 400) ? res.statusCode : 500

  return res.status(statusCode).json({
    message: "Something went wrong",
    error: err.message
  })
}

module.exports = {
  errorHandler
}