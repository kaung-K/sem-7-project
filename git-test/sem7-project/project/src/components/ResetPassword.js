import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from '../AuthContext';

const API = process.env.REACT_APP_API_URL || "http://localhost:3002/api";


export default function ResetPassword({ isDarkMode, toggleTheme }) {
  const [uid, setUid] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");
  const { isLoggedIn, logout } = useAuth();
  
  useEffect(() => {
    if (isLoggedIn) logout(); // auto sign-out on entry
    const q = new URLSearchParams(window.location.search);
    setUid(q.get("uid") || "");
    setToken(q.get("token") || "");
  }, []);

  const validate = () => {
    if (!password || password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirm) return "Passwords do not match.";
    if (!uid || !token) return "Invalid or missing reset token.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) return setError(msg);
    setError("");
    try {
      setSubmitting(true);
      await axios.post(`${API}/auth/reset`, {
        uid,
        token,
        newPassword: password,
      });
      setOk(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired link.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className={`w-full max-w-md rounded-2xl shadow p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <h1 className="text-2xl font-semibold mb-2">Set a New Password</h1>
          <p className="text-sm mb-6 opacity-80">
            Create a new password for your account.
          </p>

          {ok ? (
            <div className="space-y-4">
              <div className="rounded-md border p-4 text-sm">
                Password updated successfully. You can log in now.
              </div>
              <a href="/login" className="underline">Go to login</a>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="New password (min 8 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 outline-none ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"}`}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 outline-none ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"}`}
              />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full rounded-md px-4 py-2 font-medium ${submitting ? "opacity-70 cursor-not-allowed" : ""} ${isDarkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-black text-white hover:bg-gray-800"}`}
              >
                {submitting ? "Updating..." : "Reset password"}
              </button>
              <div className="text-sm">
                <a href="/login" className="underline">Back to login</a>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
