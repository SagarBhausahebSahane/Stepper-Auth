const xss = require("xss");
const { body, validationResult } = require("express-validator");
const sanitizeXSS = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    const sanitize = (obj) => {
      if (typeof obj === "string") return xss(obj);
      if (Array.isArray(obj)) return obj.map(sanitize);
      if (obj !== null && typeof obj === "object") {
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, sanitize(v)])
        );
      }
      return obj;
    };
    req.body = sanitize(req.body);
  }
  next();
};

const SQL_INJECTION_PATTERN =
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|TRUNCATE|DECLARE|CAST|CONVERT|CHAR|NCHAR|VARCHAR)\b)|(--)|(;)|(\/\*)|(\*\/)|(\bOR\b\s+\d+=\d+)|(\bAND\b\s+\d+=\d+)/gi;

const blockSQLInjection = (req, res, next) => {
  const checkValue = (val, fieldPath) => {
    if (typeof val === "string" && SQL_INJECTION_PATTERN.test(val)) {
      SQL_INJECTION_PATTERN.lastIndex = 0;
      return res.status(400).json({
        success: false,
        message: `Invalid input detected in field: ${fieldPath}`,
        code: "SQL_INJECTION_ATTEMPT",
      });
    }
    SQL_INJECTION_PATTERN.lastIndex = 0;

    if (val !== null && typeof val === "object") {
      for (const [key, nestedVal] of Object.entries(val)) {
        const result = checkValue(nestedVal, `${fieldPath}.${key}`);
        if (result) return result;
      }
    }
    return null;
  };

  for (const [source, data] of [
    ["body", req.body],
    ["query", req.query],
    ["params", req.params],
  ]) {
    if (data && typeof data === "object") {
      for (const [key, val] of Object.entries(data)) {
        const blocked = checkValue(val, `${source}.${key}`);
        if (blocked) return;
      }
    }
  }

  next();
};

const handleValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const validateRegisterInput = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters")
    .matches(/^[a-zA-Z\s]+$/).withMessage("Name must contain only letters"),

  body("email")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain a number"),

  handleValidationResult,
];

const validateLoginInput = [
  body("email")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),

  handleValidationResult,
];

const { verifyEncryptToken } = require("./encryptTokenUtils.js");
const { decryptData } = require("../utils/encryptionUtils");

const attachEncryptKey = (req, res, next) => {
  const encryptToken = req.headers["x-encrypt-token"];

  if (!encryptToken) {
    return next();
  }

  try {
    req.aesKey = verifyEncryptToken(encryptToken);
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Encrypt token expired or invalid. Please request a new one.",
      code: "ENCRYPT_TOKEN_INVALID",
    });
  }
};

const decryptRequestBody = (req, res, next) => {
  try {
    const encryptToken = req.headers["x-encrypt-token"];
    const encryptedPayload = req.body?.data;

    if (!encryptToken || !encryptedPayload) {
      return res.status(400).json({
        success: false,
        message: "Missing encrypt-token or encrypted payload",
        code: "MISSING_ENCRYPTION",
      });
    }

    // Extract AES key from JWT
    let aesKey;
    try {
      aesKey = verifyEncryptToken(encryptToken);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Encrypt token expired or invalid. Please request a new one.",
        code: "ENCRYPT_TOKEN_INVALID",
      });
    }

    // Decrypt body
    const decrypted = decryptData(encryptedPayload, aesKey);
    req.body = decrypted;      // Replace encrypted body with plain data
    req.aesKey = aesKey;       // Attach key so controller can encrypt response
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Failed to decrypt request body",
      code: "DECRYPTION_FAILED",
    });
  }
};

module.exports = {
  sanitizeXSS,
  blockSQLInjection,
  validateRegisterInput,
  validateLoginInput,
  decryptRequestBody,
  attachEncryptKey,
};
