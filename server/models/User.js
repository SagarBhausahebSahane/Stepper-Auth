const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    refreshToken: { type: String, default: null },

    // Profile completion tracking
    profileCompleted: { type: Boolean, default: false },
    profileData: {
      firstName:    { type: String, default: "" },
      lastName:     { type: String, default: "" },
      phone:        { type: String, default: "" },
      username:     { type: String, default: "" },
      role:         { type: String, default: "" },
      bio:          { type: String, default: "" },
      website:      { type: String, default: "" },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
