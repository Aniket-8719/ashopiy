const rateLimit = require('express-rate-limit');

// Rate limiter for registration (5 attempts per 5 minutes)
const registrationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,  // Allow 5 registration attempts per IP in 5 minutes
  message: 'Too many registration attempts, please try again in 5 minutes.',
});

// Rate limiter for login (5 attempts per 5 minutes)
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,  // Allow 5 login attempts per IP in 5 minutes
  message: 'Too many login attempts, please try again in 5 minutes.',
});

module.exports = { registrationLimiter, loginLimiter };
