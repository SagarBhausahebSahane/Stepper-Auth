const jwt = require("jsonwebtoken");
const generateEncryptToken = (aesKey) => {
  return jwt.sign(
    { aesKey },
    process.env.ENCRYPT_TOKEN_SECRET,
    { expiresIn: process.env.ENCRYPT_TOKEN_EXPIRY || "5m" }
  );
};

const verifyEncryptToken = (token) => {
  const decoded = jwt.verify(token, process.env.ENCRYPT_TOKEN_SECRET);
  return decoded.aesKey;
};

module.exports = { generateEncryptToken, verifyEncryptToken };
