const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { sanitizeXSS, blockSQLInjection, decryptRequestBody, attachEncryptKey } = require("../middleware/securityMiddleware");
const { getProfile, submitForm } = require("../controllers/userController");

router.get("/profile", protect, attachEncryptKey, getProfile);

router.post("/submit-form",protect,decryptRequestBody,sanitizeXSS,blockSQLInjection,submitForm);

module.exports = router;
