const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many attempts. Please try again after 15 minutes.",
    code: "RATE_LIMITED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: {
    success: false,
    message: "Too many requests. Slow down.",
    code: "RATE_LIMITED",
  },
});

const encryptTokenLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: "Too many encryption key requests.",
    code: "RATE_LIMITED",
  },
});

module.exports = { authLimiter, apiLimiter, encryptTokenLimiter };
