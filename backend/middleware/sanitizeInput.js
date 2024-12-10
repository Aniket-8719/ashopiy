const mongoSanitize = require("mongo-sanitize");

// Middleware to sanitize all incoming request data
const sanitizeInputMiddleware = (req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize(req.body);
  }
  if (req.query) {
    req.query = mongoSanitize(req.query);
  }
  if (req.params) {
    req.params = mongoSanitize(req.params);
  }
  next();
};

module.exports = sanitizeInputMiddleware;
