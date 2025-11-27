import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../AuthContext'; // ← adjust path if your AuthContext is elsewhere
import { getUnreadCount } from "../services/notifications"; // <- add

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const { isLoggedIn, logout, user, loading } = useAuth();
  const [unread, setUnread] = useState(0);

  const refreshUnread = async () => {
    try {
      const { data } = await getUnreadCount();
      setUnread(Number(data?.count || 0));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshUnread();
  }, []);

  useEffect(() => {
    const handler = () => refreshUnread();
    window.addEventListener("notif:changed", handler);
    const id = setInterval(refreshUnread, 30000); // light polling
    return () => {
      window.removeEventListener("notif:changed", handler);
      clearInterval(id);
    };
  }, []);


  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-b border-gray-700' : 'bg-white border-b border-gray-200 shadow-sm'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'}`}
            >
              Nexora
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                Home
              </Link>

              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                Dashboard
              </Link>
              <Link
                to="/creators"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                Creators
              </Link>
              <Link
                to="/chatbot"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center space-x-1 ${isDarkMode ? 'text-blue-400 hover:text-white hover:bg-gray-700' : 'text-blue-600 hover:text-gray-900 hover:bg-blue-50'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Assistant</span>
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                About
              </Link>
              {/* <Link
                to="/contact"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                Contact
              </Link> */}

              {!loading && isLoggedIn && user?.role !== "admin" && (
                <Link
                  to="/edit-profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isDarkMode
                      ? "text-blue-400 hover:text-white hover:bg-gray-700"
                      : "text-blue-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                >
                  Edit Profile
                </Link>
              )}

            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/notifications" className="relative focus:outline-none group" aria-label="Notifications">
              <svg
                className={`w-6 h-6 ${isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'} transition-colors duration-200`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unread > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
              )}

            </Link>

            {isLoggedIn ? (
              <button
                onClick={logout}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-white bg-red-600 hover:bg-red-700' : 'text-white bg-red-600 hover:bg-red-700'}`}
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-white bg-gray-700 hover:bg-gray-600' : 'text-white bg-gray-900 hover:bg-gray-800'}`}
                >
                  Login
                </Link>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-400 border border-gray-600 hover:text-white hover:bg-gray-700' : 'text-gray-600 border border-gray-300 hover:text-gray-900 hover:bg-gray-50'}`}
                  title="Admin Access"
                >
                  👑 Admin
                </Link>
              </div>
            )}

            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
