const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
    // Default error status code and message
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

   
    // 1. Wrong MongoDB Id error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 404);  // 404 for resource not found
    }

    // 2. Mongoose duplicate key error
    if (err.code === 11000) { 
        const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
        err = new ErrorHandler(message, 409);  // 409 for conflict
    }

    // 3. Wrong JWT error
    if (err.name === "JsonWebTokenError") {
        const message = "Json Web Token is Invalid, Try again";
        err = new ErrorHandler(message, 401);  // 401 Unauthorized for invalid token
    }

    // 4. JWT Expire error
    if (err.name === "TokenExpiredError") {
        const message = "Json Web Token is Expired, Try again";
        err = new ErrorHandler(message, 401);  // 401 Unauthorized for expired token
    }

    // Send the error response
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
