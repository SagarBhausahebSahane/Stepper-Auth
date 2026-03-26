const CryptoJS = require("crypto-js");

const encryptData = (data, aesKey) => {
  const json = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(json, aesKey).toString();
  return encrypted;
};
const decryptData = (cipherText, aesKey) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, aesKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  if (!decrypted) throw new Error("Decryption failed — invalid key or tampered data");
  return JSON.parse(decrypted);
};

module.exports = { encryptData, decryptData };
