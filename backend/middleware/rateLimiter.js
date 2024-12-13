const rateLimit = require('express-rate-limit');

// Custom response handler
const handleRateLimitError = (req, res,next, options) => {
  res.status(options.statusCode || 429).json({
    success: false,
    message: options.message, // Send the message in a JSON response
  });
};

// Rate limiter for registration
const registrationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,  // Allow 5 registration attempts per IP in 5 minutes
  message: 'Too many registration attempts, please try again in 5 minutes.',
  handler: handleRateLimitError, // Use custom handler
});

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,  // Allow 5 login attempts per IP in 5 minutes
  message: 'Too many login attempts, please try again in 5 minutes.',
  handler: handleRateLimitError, // Use custom handler
});

module.exports = { registrationLimiter, loginLimiter };
