const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
} = require("../utils/tokenUtils");

const { encryptData } = require("../utils/encryptionUtils");

const buildSafeUser = (user) => ({id: user._id,name: user.name,email: user.email,profileCompleted: user.profileCompleted,profileData: user.profileData,createdAt: user.createdAt});
const maybeEncryptResponse = (res, req, payload) => {
  if (req.aesKey) {
    return res.status(200).json({ success: true, data: encryptData(payload, req.aesKey) });
  }
  return res.status(200).json(payload);
};
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });

    return maybeEncryptResponse(res, req, {
      success: true,
      message: "User registered successfully",
      user: buildSafeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    setRefreshTokenCookie(res, refreshToken);

    const safeUser = await User.findById(user._id).select("-password -refreshToken");

    return maybeEncryptResponse(res, req, {success: true,accessToken,user: buildSafeUser(safeUser)});
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Refresh token mismatch" });
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();
    setRefreshTokenCookie(res, newRefreshToken);
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
    }

    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out" });
  }
};

module.exports = { register, login, refreshToken, logout };
