// controllers/passwordReset.js
import crypto from "crypto";
import bcrypt from "bcrypt";
import Base from "../models/Base.js"; // or your actual User model
import PasswordResetToken from "../models/PasswordResetToken.js";
import { sendPasswordResetMail } from "../Util/mailer.js";
import dotenv from "dotenv";
dotenv.config();

const TOKEN_TTL_MS = 15 * 60 * 1000;

export async function requestPasswordReset(req, res) {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: "Email is required" });

  // Always respond 200 to avoid user enumeration
  const user = await Base.findOne({ email }).select("_id email");
  if (!user) return res.status(200).json({ message: "If that account exists, an email has been sent." });

  // Invalidate old, unused tokens for this user
  await PasswordResetToken.deleteMany({ userId: user._id, used: false });

  // Create raw token and store only its hash
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = await bcrypt.hash(rawToken, 10);

  await PasswordResetToken.create({
    userId: user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    used: false,
  });
  
// inside requestPasswordReset, before building the link
const BASE_URL =
  process.env.CLIENT_URL ||      // ✅ your current var
  process.env.APP_URL ||         // fallback if you ever rename
  process.env.REQ_ORIGIN ||      // another fallback you already have
  "http://localhost:3000";       // last-resort dev default

const link = `${BASE_URL}/reset-password?uid=${user._id}&token=${rawToken}`;

// (dev only) helps verify the exact link:
console.log("[RESET] link:", link);
console.log("[RESET] uid:", String(user._id));
console.log("[RESET] rawToken:", rawToken); // remove before prod
  try {
    await sendPasswordResetMail(user.email, link);
  } catch (e) {
    // Don’t leak details; still return 200
    console.error("sendPasswordResetMail error:", e);
  }

  return res.status(200).json({ message: "If that account exists, an email has been sent." });
}

export async function resetPassword(req, res) {
  const { uid, token, newPassword } = req.body || {};
  if (!uid || !token || !newPassword) {
    return res.status(400).json({ message: "uid, token and newPassword are required" });
  }

  const prt = await PasswordResetToken.findOne({
    userId: uid,
    used: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!prt) return res.status(400).json({ message: "Invalid or expired token" });

  const matches = await bcrypt.compare(token, prt.tokenHash);
  if (!matches) return res.status(400).json({ message: "Invalid or expired token" });

  // Mark token as used
  prt.used = true;
  await prt.save();

  // Update password
  const user = await Base.findById(uid);
  if (!user) return res.status(400).json({ message: "User not found" });

  user.password = await bcrypt.hash(newPassword, 10);
  // Optional: rotate/clear refresh tokens or sessions here
  await user.save();

  return res.status(204).end();
}
