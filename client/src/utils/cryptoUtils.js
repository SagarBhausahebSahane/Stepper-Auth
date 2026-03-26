import CryptoJS from "crypto-js";

export const encryptPayload = (data, aesKey) => {
  const json = JSON.stringify(data);
  return CryptoJS.AES.encrypt(json, aesKey).toString();
};

export const decryptPayload = (cipherText, aesKey) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, aesKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  if (!decrypted) throw new Error("Decryption failed");
  return JSON.parse(decrypted);
};
