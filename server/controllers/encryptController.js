const { generateEncryptToken } = require("../utils/encryptTokenUtils");
const getEncryptToken = (req, res) => {
  const encryptToken = generateEncryptToken(process.env.AES_KEY);
  return res.status(200).json({message: "Encryption token generated",encryptToken});
};

module.exports = { getEncryptToken };
