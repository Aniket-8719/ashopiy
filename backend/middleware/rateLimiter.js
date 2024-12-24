const rateLimit = require("express-rate-limit");

// Custom response handler for rate limit errors
const handleRateLimitError = (req, res, next, options) => {
  res.status(options.statusCode || 429).json({
    success: false,
    message: options.message || "Too many requests, please try again later.",
  });
};

// Custom key generator for login attempts
const keyGenerator = (req) => {
  // Use a combination of IP address and User-Agent header to identify unique devices on the same network
  return req.ip + req.headers["user-agent"];
};

// Rate limiter for registration
const registrationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Allow 5 registration attempts per key (user ID or IP) in 5 minutes
  message: "Too many registration attempts, please try again in 5 minutes.",
  keyGenerator, // Use custom key generator
  handler: handleRateLimitError, // Use custom error handler
});

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Allow 5 login attempts per key (user ID or IP) in 5 minutes
  message: "Too many login attempts, please try again in 5 minutes.",
  keyGenerator, // Use custom key generator
  handler: handleRateLimitError, // Use custom error handler
});

// Rate limiter for login
const contactUsmessage = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hour
  max: 5, // Allow 5  attempts per key (user ID or IP) in 5 minutes
  message: "Too many messages, please try again in 24 hours.",
  keyGenerator, // Use custom key generator
  handler: handleRateLimitError, // Use custom error handler
});

module.exports = { registrationLimiter, loginLimiter, contactUsmessage };
