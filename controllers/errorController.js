const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  // console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = (err) => {
  // array of error msg
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token,Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired,Please log in again!", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // OPERATIONAL, TRUSTED ERROR: SEND MESSAGE TO CLIENT
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // PROGRAMMING OR OTHER UNKNOWN ERROR: DONT LEAK ERROR DETAILS
  else {
    // 1) Log error in console
    console.error("ERROR", err);
    // 2) Send a generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // error during production vs development start
  if (process.env.NODE_ENV === "development") {
    // here we want complete error
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // copying original error ie err into new variable (error) using destructuring
    let error = { ...err };
    // in prod we want less error details
    // error
    //1). when we try an invalid id in postman
    if (error.name === "CastError") error = handleCastErrorDB(error);
    // 2). for handling duplicate id
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    // 3) handlind mongoose validation error
    if (error.code === "ValidationError")
      error = handleValidationErrorDb(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
  // end
};
