const User = require("../models/User");
const { encryptData } = require("../utils/encryptionUtils");
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -refreshToken");

    const payload = { success: true, message: "User fetched successfully", user: { id: user._id, name: user.name, email: user.email, profileCompleted: user.profileCompleted, profileData: user.profileData, createdAt: user.createdAt}};
    if (req.aesKey) {
      return res.status(200).json({ success: true,data: encryptData(payload, req.aesKey)});
    }

    return res.status(200).json(payload);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
const submitForm = async (req, res) => {
  try {
    const { firstName, lastName, phone, username, role, bio, website } = req.body;

    const updated = await User.findByIdAndUpdate(req.user._id, { profileCompleted: true,profileData: { firstName, lastName, phone, username, role, bio, website }},{ new: true, select: "-password -refreshToken" });
    const payload = { success: true, message: "Profile submitted successfully", user: {id: updated._id,name: updated.name,email: updated.email,profileCompleted: updated.profileCompleted,profileData: updated.profileData,}};

    if (req.aesKey) {
      return res.status(200).json({success: true,data: encryptData(payload, req.aesKey)});
    }

    return res.status(200).json(payload);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { getProfile, submitForm };
