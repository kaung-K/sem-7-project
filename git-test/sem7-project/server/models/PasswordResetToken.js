// models/PasswordResetToken.js
import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Base", required: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
schema.index({ userId: 1, used: 1, expiresAt: 1 });

export default mongoose.model("PasswordResetToken", schema);
