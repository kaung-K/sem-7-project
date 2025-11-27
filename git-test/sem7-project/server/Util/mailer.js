// Util/mailer.js
import dotenv from "dotenv";
dotenv.config(); // <-- ensure env is loaded before reading process.env

import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;                 // e.g. smtp.gmail.com
const port = Number(process.env.SMTP_PORT || 587);  // 465 or 587
const secure = port === 465;                        // true for 465, false for 587

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// optional: see exactly what it's using
console.log("[MAIL] transporter host:", host, "port:", port, "secure:", secure);

// Util/mailer.js
export async function sendPasswordResetMail(to, link) {
  const appName = process.env.APP_NAME || "Your App";
  const fromAddr = process.env.MAIL_FROM || process.env.SMTP_USER;

  const text = `Reset your password (expires in 15 minutes):\n${link}`;
  const html = `
    <p>You requested a password reset.</p>
    <p>This link expires in <strong>15 minutes</strong>.</p>
    <p><a href="${link}" target="_blank" rel="noopener">Reset Password</a></p>
    <p style="margin-top:12px">If the button doesn't open, copy & paste this URL:</p>
    <p><code>${link}</code></p>
  `;

  return transporter.sendMail({
    from: `"${appName} Support" <${fromAddr}>`,
    to,
    subject: "Reset your password",
    text,
    html,
  });
}

