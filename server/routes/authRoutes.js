const express = require("express");
const router = express.Router();
const { register, login, refreshToken, logout } = require("../controllers/authController");
const { sanitizeXSS, blockSQLInjection, validateRegisterInput, validateLoginInput, decryptRequestBody } = require("../middleware/securityMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");

router.post("/register", authLimiter, decryptRequestBody, sanitizeXSS, blockSQLInjection, validateRegisterInput, register);
router.post("/login",    authLimiter, decryptRequestBody, sanitizeXSS, blockSQLInjection, validateLoginInput, login);
router.post("/refresh",  refreshToken);
router.post("/logout",   logout);

module.exports = router;
