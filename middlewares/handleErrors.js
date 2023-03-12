const logError = (err) => {
  console.error(err);
};

const logErrorMiddleware = (err, req, res, next) => {
  logError(err);
  next(err);
};

const returnError = (err, req, res, next) => {
  return res.status(err.statusCode || 500).send({
    status: "error",
    error: err.message,
  });
};
module.exports = {
  logError,
  logErrorMiddleware,
  returnError,
};
