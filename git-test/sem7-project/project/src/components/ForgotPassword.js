import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const API = process.env.REACT_APP_API_URL || "http://localhost:3002/api";

export default function ForgotPassword({ isDarkMode, toggleTheme }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError("Email is required");
    try {
      setSubmitting(true);
      await axios.post(`${API}/auth/forgot`, { email: email.trim() });
      setDone(true); // always success UX (no user enumeration)
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className={`w-full max-w-md rounded-2xl shadow p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <h1 className="text-2xl font-semibold mb-2">Forgot Password</h1>
          <p className="text-sm mb-6 opacity-80">
            Enter your account email. If it exists, we’ll send a reset link that expires in 15 minutes.
          </p>

          {done ? (
            <div className="space-y-4">
              <div className="rounded-md border p-4 text-sm">
                Check your inbox for the reset link (and spam folder). You can close this tab after resetting.
              </div>
              <a href="/login" className="underline">Back to login</a>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 outline-none ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"}`}
              />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full rounded-md px-4 py-2 font-medium ${submitting ? "opacity-70 cursor-not-allowed" : ""} ${isDarkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-black text-white hover:bg-gray-800"}`}
              >
                {submitting ? "Sending..." : "Send reset link"}
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
