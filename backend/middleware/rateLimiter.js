const rateLimit = require('express-rate-limit');

// Custom response handler for rate limit errors
const handleRateLimitError = (req, res, next, options) => {
  res.status(options.statusCode || 429).json({
    success: false,
    message: options.message || 'Too many requests, please try again later.',
  });
};

// Custom key generator (for identifying users)
const keyGenerator = (req, res) => {
  // If a user is authenticated, use the user ID for rate limiting, otherwise use the IP address
  return req.user ? req.user.id : req.ip;
};

// Rate limiter for registration
const registrationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,  // Allow 5 registration attempts per key (user ID or IP) in 5 minutes
  message: 'Too many registration attempts, please try again in 5 minutes.',
  keyGenerator, // Use custom key generator
  handler: handleRateLimitError, // Use custom error handler
});

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,  // Allow 5 login attempts per key (user ID or IP) in 5 minutes
  message: 'Too many login attempts, please try again in 5 minutes.',
  keyGenerator, // Use custom key generator
  handler: handleRateLimitError, // Use custom error handler
});

module.exports = { registrationLimiter, loginLimiter };
