// components/SubscribeSuccess.js
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SubscribeSuccess = ({ isDarkMode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer); // cleanup if unmounted
  }, [navigate]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div
        className={`max-w-md w-full px-6 py-8 text-center rounded-lg shadow-lg border ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4">Subscription Successful 🎉</h1>
        <p className="text-lg mb-8">
          Thank you for subscribing! Redirecting you to the home page…
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Go to Home Now
        </Link>
      </div>
    </div>
  );
};

export default SubscribeSuccess;
