const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    phone: {
      type: Number,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      default: "",
    },
    verification_type: {
      type: String,
      trim: true,
      default: "",
    },
    otp: {
      type: Number,
      trim: true,
      default: "",
    },
    attempts: {
      type: Number,
      trim: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Verification", verificationSchema);
