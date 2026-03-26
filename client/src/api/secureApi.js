import api from "./axiosInstance";
import { encryptPayload, decryptPayload } from "../utils/cryptoUtils";

export const securePost = async (url, payload, options = {}) => {
  const tokenPath = options.tokenPath || "/encrypt/token";
  const { data: tokenData } = await api.get(tokenPath);
  const { encryptToken } = tokenData;
  const encryptedBody = encryptPayload(payload, "a2455ebef5668991a0ff629758c32967ed0cb781ead0574e5c9f4f22cd35eff2");
  const { data: response } = await api.post(url, { data: encryptedBody }, {
    headers: { "x-encrypt-token": encryptToken },
  });

  if (response?.data) {
    return decryptPayload(response.data, "a2455ebef5668991a0ff629758c32967ed0cb781ead0574e5c9f4f22cd35eff2");
  }

  return response;
};


export const secureGet = async (url, options = {}) => {
  const tokenPath = options.tokenPath || "/encrypt/token";
  const { data: tokenData } = await api.get(tokenPath);
  const { encryptToken } = tokenData;

  const { data: response } = await api.get(url, { headers: { "x-encrypt-token": encryptToken }});

  if (response?.data) {
    return decryptPayload(response.data, "a2455ebef5668991a0ff629758c32967ed0cb781ead0574e5c9f4f22cd35eff2");
  }

  return response;
};
