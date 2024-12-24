const mongoSanitize = require("mongo-sanitize");
const escape = require("escape-html"); // For escaping special characters


// Middleware to sanitize and escape all incoming request data
const sanitizeAndEscapeMiddleware = (req, res, next) => {
  const sanitizeAndEscape = (data) => {
    if (typeof data === "string") {
      return escape(mongoSanitize(data)); // Sanitize and escape strings
    } else if (typeof data === "object" && data !== null) {
      for (const key in data) {
        data[key] = sanitizeAndEscape(data[key]); // Recursively sanitize and escape objects
      }
    }
    return data;
  };

  if (req.body) {
    req.body = sanitizeAndEscape(req.body);
  }
  if (req.query) {
    req.query = sanitizeAndEscape(req.query);
  }
  if (req.params) {
    req.params = sanitizeAndEscape(req.params);
  }

  next();
};

// Middleware to sanitize all incoming request data
// const sanitizeInputMiddleware = (req, res, next) => {
//   if (req.body) {
//     req.body = mongoSanitize(req.body);
//   }
//   if (req.query) {
//     req.query = mongoSanitize(req.query);
//   }
//   if (req.params) {
//     req.params = mongoSanitize(req.params);
//   }
//   next();
// };

module.exports = sanitizeAndEscapeMiddleware;
