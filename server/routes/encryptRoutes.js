const express = require("express");
const router = express.Router();
const { getEncryptToken } = require("../controllers/encryptController");
const { encryptTokenLimiter } = require("../middleware/rateLimiter");

router.get("/token", encryptTokenLimiter, getEncryptToken);

module.exports = router;
